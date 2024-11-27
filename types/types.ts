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
