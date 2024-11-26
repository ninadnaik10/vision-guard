import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function SelectBox({
  className,
  onChange,
}: {
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className={className}>
      <Select
        onValueChange={(value: string) =>
          onChange?.({
            target: { value },
          } as React.ChangeEvent<HTMLSelectElement>)
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Admin">Admin</SelectItem>
          <SelectItem value="Editor">Editor</SelectItem>
          <SelectItem value="Viewer">Viewer</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
