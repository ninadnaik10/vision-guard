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
import SelectBox from "./SelectBox";
import { useAtom } from "jotai";
import { usersAtom } from "@/atoms/UserAtom";

const roleValues = ["Admin", "Editor", "Viewer"];
const statusValues = ["Active", "Inactive"];

type Role = "Admin" | "Editor" | "Viewer";
type Status = "Active" | "Inactive";

export default function AddUserDialog({
  editingId,
}: {
  editingId: string | null;
}) {
  const [users, setUsers] = useAtom(usersAtom);
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("Viewer");
  const [status, setStatus] = useState<Status>("Active");

  useEffect(() => {
    // This will run after the component mounts and whenever 'users' or 'editingId' changes
    if (users && editingId) {
      const user = users.find((user) => user.id === editingId);
      if (user) {
        setUserId(user.id);
        setName(user.name);
        setEmail(user.email);
        setRole(user.role as Role);
        setStatus(user.status as Status);
      }
    }
  }, [users, editingId]);

  const handleSubmit = () => {
    if (!users) return;

    const existingUserIndex = users.findIndex((user) => user.id === userId);

    if (existingUserIndex !== -1) {
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, name, email, role, status } : user
      );
      setUsers(updatedUsers);
    } else {
      const newUser = {
        id: userId || crypto.randomUUID(),
        name,
        email,
        role,
        status,
      };
      setUsers([...users, newUser]);
    }
  };
  return (
    <div>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>
            Add name, email and role for the user.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="John Doe"
              className="col-span-3"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              placeholder="hello@example.com"
              className="col-span-3"
              defaultValue={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <SelectBox
              className="col-span-3"
              values={roleValues}
              defaultVal={role}
              onChange={(e) => {
                setRole(e.target.value as Role);
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <SelectBox
              values={statusValues}
              defaultVal={status}
              className="col-span-3"
              onChange={(e) => {
                setStatus(e.target.value as Status);
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="submit" onClick={handleSubmit}>
              Save changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </div>
  );
}
