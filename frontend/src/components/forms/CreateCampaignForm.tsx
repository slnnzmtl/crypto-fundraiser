import React from "react";
import { Input, TextArea, Button } from "../ui/primitives";
import { useCreateCampaignForm } from "@hooks/useCreateCampaignForm";
import GoalInput from "./GoalInput";
import DurationInput from "./DurationInput";
import AutoCompleteToggle from "./AutoCompleteToggle";

interface Props {
  onSuccess: () => void;
}

const CreateCampaignForm: React.FC<Props> = ({ onSuccess }) => {
  const {
    formData,
    isSubmitting,
    handleChange,
    handleToggleAutoComplete,
    handleSubmit,
  } = useCreateCampaignForm(onSuccess);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Input
        name="title"
        value={formData.title}
        onChange={handleChange}
        label="Campaign Title"
        disabled={isSubmitting}
        required
      />

      <TextArea
        name="description"
        value={formData.description}
        onChange={handleChange}
        label="Description"
        required
        disabled={isSubmitting}
        rows={3}
      />

      <GoalInput value={formData.goal} onChange={handleChange} />
      <DurationInput value={formData.durationInDays} onChange={handleChange} />

      <Input
        name="image"
        type="url"
        value={formData.image}
        onChange={handleChange}
        label="Image URL"
        placeholder="https://"
        disabled={isSubmitting}
      />

      <AutoCompleteToggle
        checked={formData.autoComplete}
        onChange={handleToggleAutoComplete}
        disabled={isSubmitting}
      />

      <Button type="submit" className="h-12" isLoading={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Campaign"}
      </Button>
    </form>
  );
};

export default CreateCampaignForm;
