import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useError } from "./useError";
import { campaignStore } from "@stores/CampaignStore";
import { CampaignInput } from "@/types/campaign";
import { ErrorType } from "@error";

const initialFormData: CampaignInput = {
  title: "",
  description: "",
  goal: "",
  durationInDays: 30,
  image: "",
  autoComplete: true,
};

export const useCreateCampaignForm = (onSuccess: () => void) => {
  const navigate = useNavigate();
  const { showError } = useError();
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;

      setFormData((prev) => {
        if (name === "goal") {
          const numericValue = value.replace(/[^\d.]/g, "");
          const parts = numericValue.split(".");
          return {
            ...prev,
            [name]:
              parts.length > 1
                ? `${parts[0]}.${parts[1].slice(0, 4)}`
                : parts[0],
          };
        }

        if (name === "durationInDays") {
          const intValue = parseInt(value, 10) || 30;
          return { ...prev, [name]: Math.max(1, intValue) };
        }

        return { ...prev, [name]: value };
      });
    },
    [],
  );

  const handleToggleAutoComplete = useCallback(() => {
    setFormData((prev) => ({ ...prev, autoComplete: !prev.autoComplete }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isSubmitting) return;

      setIsSubmitting(true);
      try {
        const campaignId = await campaignStore.createCampaign(formData);
        if (typeof campaignId === "number") {
          onSuccess();
          navigate(`/campaigns/${campaignId}`);
        } else {
          showError(ErrorType.NETWORK);
        }
      } catch (error) {
        if (error instanceof Error) {
          const errorMap: Record<string, ErrorType> = {
            [ErrorType.METAMASK]: ErrorType.METAMASK,
            [ErrorType.NETWORK]: ErrorType.NETWORK,
            [ErrorType.USER_REJECTED]: ErrorType.USER_REJECTED,
            [ErrorType.METAMASK_PENDING]: ErrorType.METAMASK_PENDING,
          };
          showError(errorMap[error.message] || ErrorType.NETWORK);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, isSubmitting, navigate, onSuccess, showError],
  );

  return {
    formData,
    isSubmitting,
    handleChange,
    handleToggleAutoComplete,
    handleSubmit,
  };
};
