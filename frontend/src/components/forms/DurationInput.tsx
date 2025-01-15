import React from "react";
import { Input, Glass } from "../ui/primitives";
import { pluralize } from "@utils/format";

const DurationInput: React.FC<{
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, onChange }) => (
  <div className="grid grid-cols-2 gap-4">
    <Input
      name="durationInDays"
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={value}
      onChange={onChange}
      label="Duration"
      required
    />
    <Glass className="bg-dark-900/60 dark:bg-dark-900/80 rounded-lg px-4 flex items-center text-gray-400">
      {pluralize(Number(value), "day")}
    </Glass>
  </div>
);

export default DurationInput;
