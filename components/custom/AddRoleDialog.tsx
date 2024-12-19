import React, { useEffect, useState } from "react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, PlusCircle, Edit2, Trash2 } from "lucide-react";
import { useAtom } from "jotai";
import { rolesAtom } from "@/atoms/RoleAtom";
import { RolePermissions } from "@/types/types";
import ResourceSelectBox from "./ResourceSelectBox";

const resourceOptions = ["events", "users", "products", "orders"];

const permissionIcons = {
  create: PlusCircle,
  view: Eye,
  update: Edit2,
  delete: Trash2,
};

export default function AddRoleDialog({
  editingRole,
}: {
  editingRole?: string | null;
}) {
  const [roles, setRoles] = useAtom(rolesAtom);
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedResource, setSelectedResource] = useState(resourceOptions[0]);
  const [roleNameError, setRoleNameError] = useState("");

  const [resourcePermissions, setResourcePermissions] = useState<{
    [resource: string]: {
      create: boolean;
      view: boolean;
      update: boolean;
      delete: boolean;
    };
  }>(
    resourceOptions.reduce(
      (acc, resource) => ({
        ...acc,
        [resource]: {
          create: false,
          view: false,
          update: false,
          delete: false,
        },
      }),
      {}
    )
  );

  useEffect(() => {
    if (editingRole && roles) {
      const existingRole = roles.find((r) => r.role === editingRole);
      if (existingRole) {
        setRoleName(existingRole.role);
        setDescription(existingRole.description || "");

        const updatedPermissions = { ...resourcePermissions };
        Object.keys(existingRole.permissions).forEach((resource) => {
          updatedPermissions[resource] = existingRole.permissions[resource];
        });
        setResourcePermissions(updatedPermissions);
      }
    }
  }, [editingRole, roles]);

  const validateRoleName = (name: string) => {
    if (!name.trim()) {
      setRoleNameError("Role name is required");
      return false;
    }

    const isDuplicate = roles.some(
      (r) =>
        r.role.toLowerCase() === name.trim().toLowerCase() &&
        r.role !== editingRole
    );

    if (isDuplicate) {
      setRoleNameError("Role name already exists");
      return false;
    }

    setRoleNameError("");
    return true;
  };

  const togglePermission = (
    resource: string,
    permissionType: keyof typeof permissionIcons
  ) => {
    setResourcePermissions((prev) => ({
      ...prev,
      [resource]: {
        ...prev[resource],
        [permissionType]: !prev[resource][permissionType],
      },
    }));
  };

  const handleSubmit = () => {
    if (!validateRoleName(roleName)) {
      return;
    }

    const existingRoleIndex = roles.findIndex((r) => r.role === roleName);

    const filteredPermissions = Object.fromEntries(
      Object.entries(resourcePermissions).filter(([, permissions]) =>
        Object.values(permissions).some((p) => p)
      )
    );

    const newRole: RolePermissions = {
      role: roleName.trim(),
      description: description || undefined,
      permissions: filteredPermissions,
    };

    if (existingRoleIndex !== -1) {
      const updatedRoles = roles.map((role, index) =>
        index === existingRoleIndex ? newRole : role
      );
      setRoles(updatedRoles);
    } else {
      setRoles([...roles, newRole]);
    }
  };

  return (
    <DialogContent className="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle>{editingRole ? "Edit Role" : "Add Role"}</DialogTitle>
        <DialogDescription>
          {editingRole ? "Modify" : "Create"} a role with specific permissions.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="roleName" className="text-right">
            Role Name
          </Label>
          <div className="col-span-3">
            <Input
              id="roleName"
              placeholder="e.g., Manager"
              className={`${roleNameError ? "border-red-500" : ""}`}
              value={roleName}
              onChange={(e) => {
                setRoleName(e.target.value);
                setRoleNameError("");
              }}
              onBlur={() => validateRoleName(roleName)}
            />
            {roleNameError && (
              <p className="text-red-500 text-sm mt-1">{roleNameError}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <Input
            id="description"
            placeholder="Optional role description"
            className="col-span-3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Resource</Label>
          <div className="col-span-3">
            <ResourceSelectBox
              selectedResource={selectedResource}
              setSelectedResource={setSelectedResource}
              resourceOptions={resourceOptions}
            />
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Permissions</Label>
          <div className="col-span-3 flex flex-wrap gap-4">
            {(
              Object.keys(permissionIcons) as Array<
                keyof typeof permissionIcons
              >
            ).map((permissionType) => {
              const Icon = permissionIcons[permissionType];
              return (
                <Button
                  key={permissionType}
                  type="button"
                  variant={
                    resourcePermissions[selectedResource][permissionType]
                      ? "default"
                      : "outline"
                  }
                  className="flex items-center gap-2"
                  onClick={() =>
                    togglePermission(selectedResource, permissionType)
                  }
                >
                  <Icon className="w-4 h-4" />
                  {permissionType.charAt(0).toUpperCase() +
                    permissionType.slice(1)}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Permission Summary */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Permission Summary</Label>
          <div className="col-span-3">
            {resourceOptions.map((resource) => {
              const resourcePerms = resourcePermissions[resource];
              const hasPermissions = Object.values(resourcePerms).some(
                (p) => p
              );

              return (
                <div
                  key={resource}
                  className={`mb-2 p-2 rounded ${
                    hasPermissions
                      ? "bg-green-50 border-green-200 border"
                      : "bg-gray-50 border-gray-200 border"
                  }`}
                >
                  <div className="font-semibold mb-1">
                    {resource.charAt(0).toUpperCase() + resource.slice(1)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {Object.entries(resourcePerms)
                      .filter(([, value]) => value)
                      .map(([perm]) => perm)
                      .join(", ") || "No permissions"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!roleName.trim() || !!roleNameError}
          >
            Save Role
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
