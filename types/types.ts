export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  status: "Active" | "Inactive";
};

export type TPermission = {
  create: boolean;
  view: boolean;
  update: boolean;
  delete: boolean;
};

export type RolePermissions = {
  role: string;
  description?: string;
  permissions: {
    [key: string]: {
      create: boolean;
      view: boolean;
      update: boolean;
      delete: boolean;
    };
  };
};

export type PermissionType = "create" | "view" | "update" | "delete";
