// RoleGate.tsx
import { useCurrentRole } from "@/hook/use-current-role";
import React from "react";
import FormError from "@/components/form-error";
import { UserRole } from "@/types";
import NoPermissionPage from "./no-permission-page";

interface RoleGateProps {
  allowedRoles: UserRole[]; // Now accepting an array of roles
  children: React.ReactNode;
}

const RoleGate = ({ children, allowedRoles }: RoleGateProps) => {
  const role = useCurrentRole(); // Get the current user's role

  // Check if the current role is one of the allowed roles
  if (!allowedRoles.includes(role)) {
    return <NoPermissionPage />;
  }

  return <>{children}</>;
};

export default RoleGate;
