/*
  This file contains the transform functions that are used to convert
  the data from the database to the format that is used by the GraphQL
  schema. Think of it as an adapter pattern that allows us to
  decouple the database from the GraphQL schema. 
*/
import { DbTweet } from './db';
import { Tweet } from './resolvers-types.generated';

export const tweetTransform = (t: DbTweet): Omit<Tweet, 'author'> => {
  return {
    id: t.id,
    body: t.message, //notice the difference between the DbTweet and the GraphQL Tweet schema
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  };
};
