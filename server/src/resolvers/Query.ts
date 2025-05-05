import { TwitterResolverContext } from '../resolvers';
import { QueryResolvers } from '../resolvers-types.generated';
import { tweetTransform } from '../transforms';

const queryTwitterResolver: QueryResolvers<TwitterResolverContext> = {
  currentUser: (_, __, { db }) => {
    const [firstUser] = db.getAllUsers();
    if (!firstUser)
      throw new Error(
        'currentUser was requested, but there are no users in the database'
      );
    return firstUser;
  },
  //Note: context is the 3rd argument, we are extracting db from it. defined in apollo-server.ts
  suggestions: (_, __, { db }) => {
    return db.getAllSuggestions();
  },
  tweets: (
    _, //parent
    __, //args (resolvers can have args, but we are not using them here)
    { db, dbTweetToFavoriteCountMap, dbUserCache, dbTweetCache } //context
  ) => {
    /* 
      We are using the context to cache the tweets and users, so we don't have to
      fetch them from the database every time. This is a performance optimization.
    */
    db.getAllUsers().forEach((user) => {
      dbUserCache[user.id] = user;
    });
    db.getAllFavorites().forEach((favorite) => {
      const count = dbTweetToFavoriteCountMap[favorite.tweetId] || 0;
      dbTweetToFavoriteCountMap[favorite.tweetId] = count + 1;
    });
    return db.getAllTweets().map((t) => {
      dbTweetCache[t.id] = t;
      return tweetTransform(t);
    });
  },
};

export default queryTwitterResolver;
