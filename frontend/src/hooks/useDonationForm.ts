import { useState, useCallback } from 'react';

export const useDonationForm = () => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateAmount = useCallback((value: string) => {
    if (!value) {
      return 'Amount is required';
    }
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) {
      return 'Amount must be greater than 0';
    }
    return null;
  }, []);

  const handleAmountChange = useCallback((value: string) => {
    setAmount(value);
    setError(validateAmount(value));
  }, [validateAmount]);

  return {
    amount,
    error,
    isValid: !error && !!amount,
    setAmount: handleAmountChange
  };
}; 