import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUserRole = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    // Fetch the user's role
    const userRole = await ctx.db
      .query("userRoles")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    if (!userRole) {
      throw new Error("User role not found");
    }

    return userRole.role;
  },
});

export const setUserRole = mutation({
  args: {
    userId: v.optional(v.string()), // Allow `userId` to be optional
    role: v.union(v.literal("user"), v.literal("manager"), v.literal("admin")), // Role validation
  },
  handler: async (ctx, { userId, role }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const currentUserId = identity.subject;

    // Fetch the role of the current user
    const currentUserRole = await ctx.db
      .query("userRoles")
      .filter((q) => q.eq(q.field("userId"), currentUserId))
      .first();

    // Ensure the current user has a role

    // Logic for allowing role setting
    if (!userId) {
      if (currentUserId) {
        throw new Error("You cannot assign the role 'user' to yourself when you have a role.");
      }
      // If `userId` is not provided, allow only if the role is "user"
      if (role !== "user") {
        throw new Error("You can only assign the role 'user' to yourself.");
      }

      // Assign the role "user" to the current user
      const newRole = await ctx.db.insert("userRoles", {
        userId: currentUserId,
        role: "user",
      });

      return { status: "self-role-assigned", role: newRole };
    } else {
      // If `userId` is provided, allow only if the current user is an admin
      if (!currentUserRole || currentUserRole.role !== "admin") {
        throw new Error("Only admins can assign roles to other users.");
      }

      // Check if the target user already has a role
      const targetUserRole = await ctx.db
        .query("userRoles")
        .filter((q) => q.eq(q.field("userId"), userId))
        .first();

      if (targetUserRole) {
        // Update the role if it exists
        await ctx.db.patch(targetUserRole._id, { role });
        return { status: "role-updated", userId, role };
      }

      // Insert a new role if the target user doesn't have one
      const newRole = await ctx.db.insert("userRoles", {
        userId,
        role,
      });

      return { status: "role-assigned", userId, role: newRole };
    }
  },
});
