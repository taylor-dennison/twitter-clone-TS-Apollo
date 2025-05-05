import { TwitterResolverContext } from '../resolvers';
import { MutationResolvers } from '../resolvers-types.generated';
import { tweetTransform } from '../transforms';
const mutationTwitterResolver: MutationResolvers<TwitterResolverContext> = {
  async createTweet(_parent, args, { dbTweetCache, db }) {
    const { body, userId } = args;
    const dbTweet = await db.createTweet({
      message: body,
      userId,
    });
    const dbTweetMap = (dbTweetCache ||= {});
    dbTweetMap[dbTweet.id] = dbTweet;

    const dbAuthor = db.getUserById(userId);
    if (!dbAuthor) {
      throw new Error(`Author with id ${userId} not found`);
    }
    return { ...tweetTransform(dbTweet), author: dbAuthor };
  },
};
export default mutationTwitterResolver;
