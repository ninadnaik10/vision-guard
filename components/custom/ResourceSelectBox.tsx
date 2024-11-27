import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ResourceSelectBox({
  selectedResource,
  setSelectedResource,
  resourceOptions,
}: {
  selectedResource: string;
  setSelectedResource: React.Dispatch<React.SetStateAction<string>>;
  resourceOptions: string[];
}) {
  return (
    <Select value={selectedResource} onValueChange={setSelectedResource}>
      <SelectTrigger className="col-span-3">
        <SelectValue placeholder="Select a resource" />
      </SelectTrigger>
      <SelectContent>
        {resourceOptions.map((resource) => (
          <SelectItem key={resource} value={resource}>
            {resource.charAt(0).toUpperCase() + resource.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
