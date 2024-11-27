"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import "@/app/globals.css";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import AddUserDialog from "@/components/custom/AddUserDialog";
import { useAtom, useAtomValue } from "jotai";
import { usersAtom } from "@/atoms/UserAtom";
import { User } from "@/types/types";
import { Edit, Trash } from "lucide-react";
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];

export default function ManageUsers() {
  const [users, setUsers] = useAtom(usersAtom);
  const table = useReactTable<User>({
    data: users || [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const handleDeleteUser = (id: string) => {
    const filteredUsers = users?.filter((user) => user.id !== id);
    if (filteredUsers) {
      setUsers(filteredUsers);
    }
  };
  return (
    <div>
      <Dialog>
        <div className="p-5 flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold">Manage Users</div>
            <DialogTrigger asChild>
              <Button>Add User</Button>
            </DialogTrigger>
          </div>
          <AddUserDialog editingId={editingId} />
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                      <TableCell className="p-0">
                        <DialogTrigger
                          asChild
                          onClick={() => setEditingId(row.original.id)}
                        >
                          <Button
                            variant="ghost"
                            className="rounded-full"
                            onClick={() => {
                              console.log("clicked");
                              setEditingId(row.original.id);
                            }}
                          >
                            <Edit />
                          </Button>
                        </DialogTrigger>
                        <Button
                          variant="ghost"
                          className="rounded-full"
                          onClick={() => handleDeleteUser(row.original.id)}
                        >
                          <Trash />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + 1}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
