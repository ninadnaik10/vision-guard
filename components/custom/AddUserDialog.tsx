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
  onClose,
}: {
  editingId: string | null;
  onClose?: () => void;
}) {
  const [users, setUsers] = useAtom(usersAtom);
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("Viewer");
  const [status, setStatus] = useState<Status>("Active");

  const [errors, setErrors] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (editingId) {
      const user = users?.find((user) => user.id === editingId);
      if (user) {
        setUserId(user.id);
        setName(user.name);
        setEmail(user.email);
        setRole(user.role as Role);
        setStatus(user.status as Status);
      }
    } else {
      setUserId("");
      setName("");
      setEmail("");
      setRole("Viewer");
      setStatus("Active");
      setErrors({ name: "", email: "" });
    }
  }, [editingId, users]);

  const isValidEmail = (email: string) => {
    // More comprehensive email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validateName = (name: string) => {
    if (!name.trim()) {
      return "Name is required";
    }
    return "";
  };

  const validateForm = () => {
    const nameError = validateName(name);
    const emailError = !email
      ? "Email is required"
      : !isValidEmail(email)
      ? "Invalid email format"
      : "";

    setErrors({
      name: nameError,
      email: emailError,
    });

    return !nameError && !emailError;
  };

  const handleSubmit = () => {
    if (validateForm()) {
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
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{editingId ? "Edit User" : "Add User"}</DialogTitle>
        <DialogDescription>
          {editingId ? "Edit" : "Add"} name, email and role for the user.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <div className="col-span-3">
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: "" }));
              }}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <div className="col-span-3">
            <Input
              id="email"
              placeholder="hello@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
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
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={
              !name ||
              !email ||
              !isValidEmail(email) ||
              !!errors.name ||
              !!errors.email
            }
          >
            Save
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
