// Convex Notifications Management

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createNotification = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    description: v.string(),
    type: v.union(
      v.literal("attendance"),
      v.literal("assessment"),
      v.literal("lab"),
      v.literal("deadline"),
      v.literal("system"),
      v.literal("ai_alert"),
      v.literal("general")
    ),
    priority: v.union(v.literal("urgent"), v.literal("normal")),
    actionUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notifications", {
      ...args,
      read: false,
      createdAt: new Date().toISOString(),
    });
  },
});

export const batchCreateNotifications = mutation({
  args: {
    userIds: v.array(v.id("users")),
    title: v.string(),
    description: v.string(),
    type: v.union(
      v.literal("attendance"),
      v.literal("assessment"),
      v.literal("lab"),
      v.literal("deadline"),
      v.literal("system"),
      v.literal("ai_alert"),
      v.literal("general")
    ),
    priority: v.union(v.literal("urgent"), v.literal("normal")),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    for (const userId of args.userIds) {
      await ctx.db.insert("notifications", {
        userId,
        title: args.title,
        description: args.description,
        type: args.type,
        priority: args.priority,
        read: false,
        createdAt: now,
      });
    }
    return { success: true, count: args.userIds.length };
  },
});

export const getNotificationsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getUnreadCount = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_userId_read", (q) => q.eq("userId", args.userId).eq("read", false))
      .collect();
    return unread.length;
  },
});

export const markAsRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, { read: true });
    return { success: true };
  },
});

export const markAllAsRead = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_userId_read", (q) => q.eq("userId", args.userId).eq("read", false))
      .collect();

    for (const notif of unread) {
      await ctx.db.patch(notif._id, { read: true });
    }
    return { success: true, count: unread.length };
  },
});

export const deleteNotification = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.notificationId);
    return { success: true };
  },
});
