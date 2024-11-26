import { atom } from "jotai";

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  status: "active" | "inactive";
};

export const usersAtom = atom<User[] | null>([]);
