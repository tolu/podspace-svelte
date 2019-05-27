const parser = new DOMParser();

export interface IRssItems {
  items: IRssItem[];
}
export interface IRssItem {
  title: string;
  duration: string;
  enclosure: {
    url: string;
    length: number;
    type: string;
  };
  episode: string;
  image: { href: string };
  pubDate: string;
  subtitle: string;
  summary: string;
}

export const rssStringToJson = (rssString: string): IRssItems => {
  const xml = parser.parseFromString(rssString, "text/xml");
  const rssItems = Array.from(xml.querySelectorAll("channel > item"))
    .map(xmlToJson)
    .map(item => {
      const { enclosure, pubDate, title } = item;
      const iTunesProps = Object.keys(item)
        .filter(k => k.includes("itunes:"))
        .reduce((res: any, prop) => {
          const name = prop.split("itunes:")[1];
          res[name] = item[prop];
          return res;
        }, {});
      return { ...iTunesProps, enclosure, pubDate, title };
    });
  return { items: rssItems };
};

const NodeNames = {
  TEXT: "#text",
  CDATA: "#cdata-section"
};

// try parse numbers as numbers
function getValue(value: string | null) {
  if (value != null && value.length && !isNaN(value as any)) {
    return parseFloat(value);
  } else {
    return (value || "").trim();
  }
}

/* Code started out as: https://davidwalsh.name/convert-xml-json */
function xmlToJson(xml: Element | Node) {
  // return immediately for cdata and text
  if (
    xml.nodeType === Node.TEXT_NODE ||
    xml.nodeType === Node.CDATA_SECTION_NODE
  ) {
    // text
    return getValue(xml.nodeValue);
  }

  // Create the return object
  let obj: any = {};
  // Assign Attributes
  if (xml instanceof Element) {
    // element
    // do attributes
    if (xml.attributes.length > 0) {
      for (let j = 0; j < xml.attributes.length; j++) {
        const attribute = xml.attributes.item(j);
        if (attribute) {
          obj[attribute.nodeName] = getValue(attribute.nodeValue);
        }
      }
    }
  }

  // loop over children
  if (xml.hasChildNodes()) {
    for (let i = 0; i < xml.childNodes.length; i++) {
      const item = xml.childNodes.item(i);
      const nodeName = item.nodeName;
      // add first occurrence of nodeName as property
      if (typeof obj[nodeName] === "undefined") {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof obj[nodeName].push !== "function") {
          obj[nodeName] = [obj[nodeName]];
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
    // throw away all text nodes that are not single children
    const keys = Object.keys(obj);
    if (keys.includes(NodeNames.TEXT) || keys.includes(NodeNames.CDATA)) {
      if (keys.length === 1) {
        obj = obj[keys[0]];
      } else {
        delete obj[NodeNames.TEXT];
      }
    }
  }
  return obj;
}
