import { isAddress, isHex } from "viem";

export const validateAddress = (address: string): boolean => {
  return !!address && isAddress(address);
};

export const validateAmount = (amount: string): boolean => {
  return !!amount && parseFloat(amount) > 0 && !isNaN(parseFloat(amount));
};

export const validateHexData = (data: string): boolean => {
  return !!data && isHex(data);
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export interface ValidationError {
  field: string;
  message: string;
}

export const validateMultiSendRecipient = (
  recipient: { address: string; amount: string; token: string },
  index: number
): ValidationError | null => {
  if (!validateAddress(recipient.address)) {
    return {
      field: `recipient-${index}-address`,
      message: `Recipient ${index + 1}: Invalid address format`,
    };
  }
  
  if (!validateAmount(recipient.amount)) {
    return {
      field: `recipient-${index}-amount`,
      message: `Recipient ${index + 1}: Amount must be greater than 0`,
    };
  }
  
  return null;
};

export const validateCustomCall = (
  call: { to: string; value: string; data: string },
  index: number
): ValidationError | null => {
  if (!validateAddress(call.to)) {
    return {
      field: `call-${index}-to`,
      message: `Call ${index + 1}: Invalid target address format`,
    };
  }
  
  if (call.value && isNaN(parseFloat(call.value))) {
    return {
      field: `call-${index}-value`,
      message: `Call ${index + 1}: Invalid value format`,
    };
  }
  
  if (call.data && !validateHexData(call.data)) {
    return {
      field: `call-${index}-data`,
      message: `Call ${index + 1}: Data must be valid hex (starting with 0x)`,
    };
  }
  
  return null;
};