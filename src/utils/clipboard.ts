"use client";

import { useState } from "react";

/**
 * Utility function to copy text to clipboard with error handling
 * @param text - The text to copy to clipboard
 * @returns Promise<boolean> - Returns true if successful, false if failed
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
};

/**
 * Hook for managing clipboard copy state with auto-reset
 * @param resetDelay - Time in milliseconds before resetting copied state (default: 2000)
 */
export const useCopyToClipboard = (resetDelay: number = 2000) => {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string): Promise<boolean> => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), resetDelay);
    }
    return success;
  };

  return { copied, copy };
};