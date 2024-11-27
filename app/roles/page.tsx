"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useAtom } from "jotai";
import { rolesAtom } from "@/atoms/RoleAtom";
import AddRoleDialog from "@/components/custom/AddRoleDialog";

type PermissionType = "create" | "view" | "update" | "delete";

type RolePermissions = {
  role: string;
  permissions: {
    [key: string]: {
      [action in PermissionType]: boolean;
    };
  };
};

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] border-r">Role</TableHead>
                {resources.map((resource, index) => (
                  <TableHead
                    key={resource}
                    colSpan={permissionTypes.length}
                    className={`text-center ${
                      index > 0 && index < resources.length - 1
                        ? "border-x"
                        : ""
                    } ${index === 1 ? "border-l-2 border-r-2" : ""}`}
                  >
                    {resource.charAt(0).toUpperCase() + resource.slice(1)}
                  </TableHead>
                ))}
              </TableRow>
              <TableRow>
                <TableHead className="border-r">Permissions</TableHead>
                {resources.flatMap((resource, resourceIndex) =>
                  permissionTypes.map((action, actionIndex) => (
                    <TableHead
                      key={`${resource}-${action}`}
                      className={`text-center 
                      ${
                        resourceIndex === 1 && actionIndex === 0
                          ? "border-l-2"
                          : ""
                      }
                      ${
                        resourceIndex === 1 &&
                        actionIndex === permissionTypes.length - 1
                          ? "border-r-2"
                          : ""
                      }
                      ${
                        resourceIndex > 0 && actionIndex === 0 ? "border-l" : ""
                      }
                    `}
                    >
                      {action.charAt(0).toUpperCase() + action.slice(1)}
                    </TableHead>
                  ))
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.role}>
                  <TableCell className="border-r">{role.role}</TableCell>
                  {resources.flatMap((resource, resourceIndex) =>
                    permissionTypes.map((action, actionIndex) => (
                      <TableCell
                        key={`${role.role}-${resource}-${action}`}
                        className={`text-center 
                        ${
                          resourceIndex === 1 && actionIndex === 0
                            ? "border-l-2"
                            : ""
                        }
                        ${
                          resourceIndex === 1 &&
                          actionIndex === permissionTypes.length - 1
                            ? "border-r-2"
                            : ""
                        }
                        ${
                          resourceIndex > 0 && actionIndex === 0
                            ? "border-l"
                            : ""
                        }
                      `}
                      >
                        <Checkbox
                          checked={role.permissions[resource][action]}
                          onCheckedChange={() =>
                            togglePermission(role.role, resource, action)
                          }
                        />
                      </TableCell>
                    ))
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Dialog>
  );
}
