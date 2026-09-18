// Convex Audit Log Functions

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const logAction = mutation({
  args: {
    actorId: v.id("users"),
    actorName: v.string(),
    actorRole: v.string(),
    action: v.string(),
    targetType: v.string(),
    targetId: v.optional(v.string()),
    targetName: v.optional(v.string()),
    details: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("auditLogs", {
      ...args,
      timestamp: new Date().toISOString(),
    });
  },
});

export const getAuditLogs = query({
  args: {
    limit: v.optional(v.float64()),
  },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("auditLogs")
      .order("desc")
      .take(args.limit || 100);
    return logs;
  },
});

export const getAuditLogsByActor = query({
  args: { actorId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("auditLogs")
      .withIndex("by_actorId", (q) => q.eq("actorId", args.actorId))
      .order("desc")
      .collect();
  },
});

export const getAuditLogsByAction = query({
  args: { action: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("auditLogs")
      .withIndex("by_action", (q) => q.eq("action", args.action))
      .order("desc")
      .collect();
  },
});
