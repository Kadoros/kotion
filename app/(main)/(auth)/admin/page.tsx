"use client";
import RoleGate from "@/components/auth/role-gate";
import { UserTable } from "@/components/auth/user-table";
import { Button } from "@/components/ui/button";
import { useCurrentRole } from "@/hook/use-current-role";
import { UserRole } from "@/types";

export default function AdminPage() {
  const role = useCurrentRole();

  if (role === undefined) {
    return <div>Loading...</div>;
  }

  const handleClick = () => {

  }

  return (
    <div className="size-full">
      <RoleGate allowedRoles={[UserRole.ADMIN]}>
        <div className="flex flex-row justify-between items-center rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-bold">Role</p>
          <p className="text-xs truncate max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
            {role}
          </p>
        </div>
        
        <div className="flex flex-row justify-between items-center rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-bold">File Index rebuild </p>
          <Button onClick={() => handleClick()}>Click to test</Button>
        </div>
        <UserTable />
      </RoleGate>
    </div>
  );
}
