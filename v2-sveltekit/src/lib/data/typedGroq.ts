import type { SanityDocument } from '@sanity/client';

let obj: { foo: string, bar: number };

// Does not work
// type SanityDocKeys<T> = T extends Record<string, unknown> ?  keyof SanityDocument<T> : never;
// let pluckNjoin2: <T extends Record<string, unknown>, K extends SanityDocKeys<T>>(
//   pluck: Array<K>,
//   join: { [key in K]?: string }
// ) => Pick<SanityDocument<T>, K>;
// const tmp2 = pluckNjoin2<typeof obj>(['_createdAt', 'foo'], { bar: '' });
// tmp2._id;
// tmp2.foo;

// Does not work...
// let ex1: <T extends Record<string, unknown>, K extends keyof SanityDocument<T>>(obj: T) => (
//   pluck: Array<K | [K, string]>
// ) => Pick<SanityDocument<T>, K>;
// const tmp1 = ex1(obj)(['_id']);
// tmp1._createdAt;

let pluckNjoin: <T extends Record<string, unknown>, K extends keyof SanityDocument<T>>(
  pluck: Array<K>,
  join: { [key in K]?: string },
  _: T, // how can I move this out? It's only here to make K work...
) => Pick<SanityDocument<T>, K>;

const tmp = pluckNjoin(['_id', 'foo', 'bar'], { bar: '',  }, obj);
tmp._type;
tmp.bar;
tmp.foo;
tmp._id;
tmp._rev;
