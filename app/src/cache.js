import { InMemoryCache, makeVar } from '@apollo/client';

export const sessionLikesVar = makeVar({});
export const indexedDbLikesVar = makeVar({});

export const cache = new InMemoryCache({});
