import { atom } from "jotai";
import { RolePermissions } from "@/types/types";

export const rolesAtom = atom<RolePermissions[]>([
  {
    role: "Admin",
    description: "Full system access",
    permissions: {
      events: { create: true, view: true, update: true, delete: true },
      users: { create: true, view: true, update: true, delete: true },
      products: { create: true, view: true, update: true, delete: true },
      orders: { create: true, view: true, update: true, delete: true },
    },
  },
  {
    role: "Editor",
    description: "Limited administrative access",
    permissions: {
      events: { create: true, view: true, update: true, delete: false },
      users: { create: false, view: true, update: false, delete: false },
      products: { create: true, view: true, update: true, delete: false },
      orders: { create: false, view: true, update: false, delete: false },
    },
  },
  {
    role: "Viewer",
    description: "Read-only access",
    permissions: {
      events: { create: false, view: true, update: false, delete: false },
      users: { create: false, view: true, update: false, delete: false },
      products: { create: false, view: true, update: false, delete: false },
      orders: { create: false, view: true, update: false, delete: false },
    },
  },
]);
