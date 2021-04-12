import sanityClient, { SanityDocument } from '@sanity/client';

/** Steps to get working
 * 1. add CORS origin to
 *    https://www.sanity.io/teams/personal/project/l2yzh27o/settings#cors-origins
 * 2. Load apiToken somehow...
 */

const client = sanityClient({
  projectId: 'l2yzh27o',
  dataset: 'production',
  apiVersion: '2021-04-11', // use current UTC date - see "specifying API version"!
  token: import.meta.env.VITE_SANITY_TOKEN || '', // leave blank for unauthenticated usage
  useCdn: true, // `false` if you want to ensure fresh data
});

// TODO: solve selectors ala "poster{asset->{path, url}}"
async function typedFetch<T extends Record<string, unknown>>(
  types: string[],
  pluck?: Array<keyof SanityDocument<T>>,
  range?: { take: number, skip?: number },
): Promise<SanityDocument<T> | SanityDocument<T>[]> {
  let groq = '*';
  groq += types ? `[${types.map(t => `_type == '${t}'`).join(' && ')}]` : '';
  groq += pluck?.length > 0 ? `{ ${pluck.map(p => `${p}`).join(', ')} }` : '';
  groq += getGroqSlice(range);
  console.info('sanityFetch: ', groq);
  if (range?.take === 0) {
    return await client.fetch(groq) as SanityDocument<T>;
  }
  return await client.fetch(groq) as SanityDocument<T>[];
};

const getGroqSlice = (range?: { take: number, skip?: number }) => {
  if (!range)
    return '';
  let { take, skip = 0 } = range;
  if (take === 0)
    return '[0]';
  skip = Math.max(0, skip);
  take = Math.max(0, take);
  return `[${skip}...${skip + take}]`;
};

export { client as sanityClient, typedFetch };
