import { atom } from "jotai";
import { User } from "@/types/types";

export const usersAtom = atom<User[] | null>([
  {
    id: "1",
    email: "test@test.com",
    name: "Test User",
    role: "Admin",
    status: "Active",
  },
]);
