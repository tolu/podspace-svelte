import { createCache } from "./cache";

// https://affiliate.itunes.apple.com/resources/documentation/itunes-store-web-service-search-api/
const SEARCH_BASE =
  "https://itunes.apple.com/search?media=podcast&entity=podcast&limit=25&term=";
const cache = createCache("pod-search-res");

export const search = async (searchTerm: string) => {
  const cacheResponse = cache.get(searchTerm);
  if (cacheResponse) {
    return cacheResponse;
  }
  // get from network and add to cache
  const res = await fetch(SEARCH_BASE + encodeURIComponent(searchTerm));
  if (!res.ok) {
    throw new Error(`Response not ok: ${res.status} - ${res.statusText}`);
  }
  const json = await res.json();
  cache.set(searchTerm, json);
  return json;
};

export const getCharts = () => {
  // get charts from here: http://www.itunescharts.net/uk/charts/podcasts/2018/06/27
  // parse result and get id="chart" > li
};
