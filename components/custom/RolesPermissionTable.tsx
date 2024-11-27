import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { PermissionType, RolePermissions } from "@/types/types";

export default function RolesPermissionTable({
  resources,
  permissionTypes,
  roles,
  togglePermission,
}: {
  resources: string[];
  permissionTypes: string[];
  roles: RolePermissions[];
  togglePermission: (
    roleName: string,
    resource: string,
    action: PermissionType
  ) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px] border-r">Role</TableHead>
          {resources.map((resource, index) => (
            <TableHead
              key={resource}
              colSpan={permissionTypes.length}
              className={`text-center ${
                index > 0 && index < resources.length - 1 ? "border-x" : ""
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
                    checked={
                      role.permissions?.[resource]?.[
                        action as keyof (typeof role.permissions)[typeof resource]
                      ]
                    }
                    onCheckedChange={() =>
                      togglePermission(
                        role.role,
                        resource,
                        action as PermissionType
                      )
                    }
                  />
                </TableCell>
              ))
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
