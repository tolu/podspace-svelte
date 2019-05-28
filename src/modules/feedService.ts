import { createCache } from "./cache";
import { durationSecToString } from "./durationConversion";
import { IRssItems, rssStringToJson } from "./rssStringToJson";

const cache = createCache("pod-feed");

export const getFeedItems = async (feedUrl: string): Promise<IRssItems> => {
  const cacheResponse = cache.get(feedUrl);
  if (cacheResponse) {
    return cacheResponse;
  }
  // get from network and add to cache
  let response: Response;
  let text: string = "";
  let json: any;
  try {
    response = await fetch(
      `https://podspacexmlfeedproxy.azurewebsites.net/api/GetXmlAsJson?xmlUrl=${encodeURIComponent(feedUrl)}`,
      {
        headers: { "x-functions-key": "Nv5Ss2Y/n1eARce7ZEwkr8kF562UPcoYJlViTkY9mD4vfw6aBr/Bzw==" }
      }
    );
    text = await response.text();
  } catch (error) {
    console.error("OH NOES", error);
    console.warn(
      "trying fallback via https://api.rss2json.com/v1/api.json ..."
    );
    response = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
        feedUrl
      )}`
    );
    json = await response.json();
  }

  if (response.ok) {
    const data = json ? toRssItems(json) : rssStringToJson(text);
    cache.set(feedUrl, data);
    return data;
  }
  console.warn("Request failed", response);
  return { items: [] };
};

function toRssItems(rssData: IRssApiResponse): IRssItems {
  const total = rssData.items.length;
  return {
    items: rssData.items.map((i, idx) => ({
      title: i.title,
      duration: durationSecToString(i.enclosure.duration),
      enclosure: {
        url: i.enclosure.link,
        length: i.enclosure.duration,
        type: i.enclosure.type
      },
      episode: (total - idx).toString(),
      image: {
        href: i.thumbnail
      },
      pubDate: i.pubDate,
      subtitle: i.content,
      summary: i.description
    }))
  };
}

interface IRssApiResponse {
  items: IRssApiItem[];
}
interface IRssApiItem {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  content: string;
  enclosure: IEnclosure;
}

interface IEnclosure {
  link: string;
  type: string;
  duration: number;
  thumbnail: string;
}
