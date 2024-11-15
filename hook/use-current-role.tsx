// useCurrentRole.ts
import { useUser } from "@clerk/nextjs";
import { UserRole } from "@/types"; // Ensure the correct UserRole enum is imported

export function useCurrentRole(): UserRole {
  const { user } = useUser();

  // Get the role from the user's metadata
  const role = user?.publicMetadata?.role;

  // Check if the role is valid and matches one of the roles in the UserRole enum
  if (role && Object.values(UserRole).includes(role as UserRole)) {
    return role as UserRole; // Safely cast the role to UserRole
  }

  // Default to "user" if role is not found or is invalid
  return UserRole.USER;
}
