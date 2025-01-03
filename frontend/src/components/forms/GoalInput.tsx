import React from 'react';
import { Input } from '../ui/primitives';

const GoalInput: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, onChange }) => (
  <div className="grid grid-cols-2 gap-4">
    <Input
      name="goal"
      type="text"
      inputMode="decimal"
      pattern="\d*\.?\d*"
      value={value}
      onChange={onChange}
      label="Goal Amount"
      required
    />
    <div className="bg-dark-700 rounded-lg px-4 flex items-center text-gray-400">ETH</div>
  </div>
);

export default GoalInput; 