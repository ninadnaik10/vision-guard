import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function SelectBox({
  values,
  defaultVal,
  className,
  onChange,
}: {
  values: string[];
  defaultVal: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className={className}>
      <Select
        defaultValue={defaultVal}
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
          {values.map((val, idx) => {
            return (
              <SelectItem value={val} key={idx}>
                {val}
              </SelectItem>
            );
          })}
          {/* <SelectItem value="Admin">Admin</SelectItem>
          <SelectItem value="Editor">Editor</SelectItem>
          <SelectItem value="Viewer">Viewer</SelectItem> */}
        </SelectContent>
      </Select>
    </div>
  );
}
