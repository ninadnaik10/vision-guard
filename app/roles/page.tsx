"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useAtom } from "jotai";
import { rolesAtom } from "@/atoms/RoleAtom";
import AddRoleDialog from "@/components/custom/AddRoleDialog";
import RolesPermissionTable from "@/components/custom/RolesPermissionTable";
import { PermissionType } from "@/types/types";
export default function ManageRoles() {
  const [roles, setRoles] = useAtom(rolesAtom);

  // Predefined resources (you can expand this list)
  const resources = ["events", "users", "products", "orders"];

  const permissionTypes: PermissionType[] = [
    "create",
    "view",
    "update",
    "delete",
  ];

  // Toggle a specific permission for a role and resource
  const togglePermission = (
    roleName: string,
    resource: string,
    action: PermissionType
  ) => {
    setRoles((currentRoles) =>
      currentRoles.map((role) =>
        role.role === roleName
          ? {
              ...role,
              permissions: {
                ...role.permissions,
                [resource]: {
                  ...role.permissions[resource],
                  [action]: !role.permissions[resource][action],
                },
              },
            }
          : role
      )
    );
  };

  return (
    <Dialog>
      <div className="p-5 flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Manage Roles & Permissions</h2>
          <DialogTrigger asChild>
            <Button>Add Role</Button>
          </DialogTrigger>
        </div>
        <AddRoleDialog />
        <div className="rounded-md border overflow-x-auto">
          <RolesPermissionTable
            resources={resources}
            permissionTypes={permissionTypes}
            roles={roles}
            togglePermission={togglePermission}
          />
        </div>
      </div>
    </Dialog>
  );
}
