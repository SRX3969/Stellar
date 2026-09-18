// Convex Tasks Backend (Real implementation replacing stubs)

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getTasksByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const createTask = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    subject: v.string(),
    priority: v.union(v.literal("urgent"), v.literal("high"), v.literal("medium"), v.literal("low")),
    deadline: v.string(),
    estimatedDuration: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", {
      ...args,
      completed: false,
      section: "today",
      createdAt: Date.now(),
    });
  },
});

export const toggleTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) return { success: false };
    const newCompleted = !task.completed;
    await ctx.db.patch(args.taskId, {
      completed: newCompleted,
      section: newCompleted ? "completed" : "today",
    });
    return { success: true };
  },
});

export const deleteTask = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.taskId);
    return { success: true };
  },
});
