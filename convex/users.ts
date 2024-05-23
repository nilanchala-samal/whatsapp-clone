import { ConvexError, v } from 'convex/values';
import { internalMutation, query } from './_generated/server';

export const createUser = internalMutation({
    args: {
        name: v.string(),
        tokenIdentifier: v.string(),
        email: v.string(),
        image: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("users", {
            tokenIdentifier: args.tokenIdentifier,
            name: args.name,
            email: args.email,
            image: args.image,
            isOnline: true
        });
    }
});

export const setUserOnline = internalMutation({
    args: { tokenIdentifier: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_tokenIdentifier", q => q.eq("tokenIdentifier", args.tokenIdentifier))
            .unique();

            if(!user) {
                throw new ConvexError("User Not Found!!!")
            }
            await ctx.db.patch(user._id, {isOnline: true})
    }
});

export const setUserOffline = internalMutation({
    args: {
        tokenIdentifier: v.string()
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_tokenIdentifier", q => q.eq("tokenIdentifier", args.tokenIdentifier))
            .unique();

        if (!user) {
            throw new ConvexError("User Not Found!!!");
        }
        await ctx.db.patch(user._id, { isOnline: false });
    }
});