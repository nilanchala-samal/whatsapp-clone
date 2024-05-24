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

export const updateUser = internalMutation({
    args: { tokenIdentifier: v.string(), image: v.string() },
    async handler(ctx, args) {
        const user = await ctx.db
            .query("users")
            .withIndex("by_tokenIdentifier", q => q.eq("tokenIdentifier", args.tokenIdentifier))
            .unique();

        if (!user) {
            throw new ConvexError("User Not Found!!!");
        }
        await ctx.db.patch(user._id, {
            image: args.image
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

        if (!user) {
            throw new ConvexError("User Not Found!!!");
        }
        await ctx.db.patch(user._id, { isOnline: true });
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

export const getUser = query({
    args: {},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("Unauthorized User!!!");
        }
        const users = await ctx.db.query("users").collect();
        return users;
    }
});
export const getMe = query({
    args: {},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("Unauthorized User!!!");
        }
        const user = await ctx.db
            .query("users")
            .withIndex("by_tokenIdentifier", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!user) {
            throw new ConvexError("User Not Found!!!");
        }
        return user;
    }
});

// TODO: Add getGroupMembers query - later