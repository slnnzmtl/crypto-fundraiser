import { useState, useCallback } from 'react';
import { Campaign } from '../types/campaign';

export const useDonationForm = (
  campaign: Campaign | undefined,
  onDonate: (amount: string) => Promise<void>
) => {
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState<string | null>(null);

  const validateAmount = useCallback((value: string): boolean => {
    const numValue = parseFloat(value);
    if (!value || isNaN(numValue)) {
      setAmountError('Please enter a valid amount');
      return false;
    }
    if (numValue <= 0) {
      setAmountError('Amount must be greater than 0');
      return false;
    }
    setAmountError(null);
    return true;
  }, []);

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    if (value) {
      validateAmount(value);
    } else {
      setAmountError(null);
    }
  }, [validateAmount]);

  const handleDonate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign) return;

    if (!validateAmount(amount)) {
      return;
    }

    try {
      await onDonate(amount);
      setAmount('');
      setAmountError(null);
    } catch (error) {
      // Error handling is done by the parent component
    }
  }, [amount, campaign, onDonate, validateAmount]);

  return {
    amount,
    amountError,
    handleAmountChange,
    handleDonate
  };
}; 