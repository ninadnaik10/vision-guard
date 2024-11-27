import { atom } from "jotai";
import { User } from "@/types/types";

export const usersAtom = atom<User[] | null>([
  {
    id: "1",
    email: "ninadnaik@gmail.com",
    name: "Ninad Naik",
    role: "Admin",
    status: "Active",
  },
]);
