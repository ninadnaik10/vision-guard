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

  // Store permissions for each resource
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
    // If editing an existing role, pre-fill the form
    if (editingRole && roles) {
      const existingRole = roles.find((r) => r.role === editingRole);
      if (existingRole) {
        setRoleName(existingRole.role);
        setDescription(existingRole.description || "");

        // Populate permissions for all resources
        const updatedPermissions = { ...resourcePermissions };
        Object.keys(existingRole.permissions).forEach((resource) => {
          updatedPermissions[resource] = existingRole.permissions[resource];
        });
        setResourcePermissions(updatedPermissions);
      }
    }
  }, [editingRole, roles]);

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
    // Validate role name
    if (!roleName.trim()) {
      alert("Role name cannot be empty");
      return;
    }

    const existingRoleIndex = roles.findIndex((r) => r.role === roleName);

    const filteredPermissions = Object.fromEntries(
      Object.entries(resourcePermissions).filter(([_, permissions]) =>
        Object.values(permissions).some((p) => p)
      )
    );

    const newRole: RolePermissions = {
      role: roleName,
      description: description || undefined,
      permissions: filteredPermissions,
    };

    if (existingRoleIndex !== -1) {
      const updatedRoles = roles.map((role, index) =>
        index === existingRoleIndex ? newRole : role
      );
      console.log(updatedRoles);
      setRoles(updatedRoles);
    } else {
      console.log(newRole);
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
          <Input
            id="roleName"
            placeholder="e.g., Manager"
            className="col-span-3"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />
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
                      .filter(([_, value]) => value)
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
          <Button type="submit" onClick={handleSubmit}>
            Save Role
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
