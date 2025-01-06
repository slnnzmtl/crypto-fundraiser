import { useState, useCallback, useMemo } from 'react';

// Constants
const MAX_MESSAGE_LENGTH = 500; // From smart contract
const MAX_GOAL_ETH = 100; // From smart contract MAX_GOAL
const ETH_DECIMALS = 18;

interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

export const useDonationForm = () => {
  // Form state
  const [amount, setAmount] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [touched, setTouched] = useState({
    amount: false,
    message: false
  });

  // Validation functions
  const validateAmount = useCallback((value: string): ValidationResult => {
    if (!value.trim()) {
      return { isValid: false, error: 'Amount is required' };
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return { isValid: false, error: 'Please enter a valid number' };
    }

    if (numValue <= 0) {
      return { isValid: false, error: 'Amount must be greater than 0' };
    }

    if (numValue > MAX_GOAL_ETH) {
      return { isValid: false, error: `Amount cannot exceed ${MAX_GOAL_ETH} ETH` };
    }

    return { isValid: true, error: null };
  }, []);

  const validateMessage = useCallback((value: string): ValidationResult => {
    if (value.length > MAX_MESSAGE_LENGTH) {
      return {
        isValid: false,
        error: `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`
      };
    }
    return { isValid: true, error: null };
  }, []);

  // Validation state
  const amountValidation = useMemo(() => 
    validateAmount(amount),
    [amount, validateAmount]
  );

  const messageValidation = useMemo(() => 
    validateMessage(message),
    [message, validateMessage]
  );

  // Form handlers
  const handleAmountChange = useCallback((value: string) => {
    // Only allow numbers and one decimal point
    const sanitizedValue = value.replace(/[^\d.]/g, '');
    const parts = sanitizedValue.split('.');
    
    // Format with max ETH_DECIMALS decimal places
    const formattedValue = parts.length > 1 
      ? `${parts[0]}.${parts[1].slice(0, ETH_DECIMALS)}`
      : parts[0];
    
    setAmount(formattedValue);
    setTouched(prev => ({ ...prev, amount: true }));
  }, []);

  const handleMessageChange = useCallback((value: string) => {
    setMessage(value);
    setTouched(prev => ({ ...prev, message: true }));
  }, []);

  // Form state
  const isValid = useMemo(() => 
    amountValidation.isValid && messageValidation.isValid && amount.length > 0,
    [amountValidation.isValid, messageValidation.isValid, amount]
  );

  const reset = useCallback(() => {
    setAmount('');
    setMessage('');
    setTouched({ amount: false, message: false });
  }, []);

  // Public interface
  return {
    // Values
    amount,
    message,
    
    // Validation
    amountError: touched.amount ? amountValidation.error : null,
    messageError: touched.message ? messageValidation.error : null,
    isValid,
    
    // Handlers
    setAmount: handleAmountChange,
    setMessage: handleMessageChange,
    reset
  };
}; 