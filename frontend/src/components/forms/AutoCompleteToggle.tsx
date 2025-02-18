import React from "react";

const AutoCompleteToggle: React.FC<{
  checked: boolean;
  onChange: () => void;
  disabled: boolean;
}> = ({ checked, onChange, disabled }) => (
  <div className="flex items-center space-x-2">
    <input
      type="checkbox"
      id="autoComplete"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className="w-4 h-4 text-primary bg-dark-800 border-dark-700 rounded focus:ring-yellow-500"
    />
    <label htmlFor="autoComplete" className="text-white">
      Auto-complete when goal is reached
    </label>
  </div>
);

export default AutoCompleteToggle;
