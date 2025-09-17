"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronsRight } from "lucide-react";

interface TransactionCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "multisend" | "customcall";
  recipientCount?: number;
  contractCount?: number;
  amount?: string;
  token?: string;
  network: "base-sepolia";
  transactionHash?: string;
}

export default function TransactionCompletionModal({
  isOpen,
  onClose,
  type,
  recipientCount = 0,
  contractCount = 0,
  amount = "0.0001",
  token = "ETH",
  network,
  transactionHash,
}: TransactionCompletionModalProps) {
  const [isExplorerEnabled, setIsExplorerEnabled] = useState(false);

  // Enable explorer button when we have transaction hash
  useEffect(() => {
    if (transactionHash) {
      // Add a small delay to simulate processing
      const timer = setTimeout(() => {
        setIsExplorerEnabled(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [transactionHash]);

  if (!isOpen) return null;

  const getExplorerUrl = () => {
    const baseUrl =
      network === "base-sepolia"
        ? "https://sepolia.basescan.org/tx/"
        : "https://basescan.org/tx/";
    return `${baseUrl}${transactionHash}`;
  };

  const renderAddressImages = () => {
    if (type === "multisend" && recipientCount > 0) {
      const images = [];

      // First address image
      images.push(
        <Image
          key="address-1"
          src="/address_1.png"
          width={56}
          height={56}
          alt="Address 1"
          className="rounded-full"
        />,
      );

      // Chevron right icon
      images.push(
        <ChevronsRight
          key="chevron"
          className="w-6 h-6 text-gray-400 mx-2 mr-4"
        />,
      );

      // For 1 recipient: show address_2.png
      if (recipientCount === 1) {
        images.push(
          <Image
            key="address-2"
            src="/address_2.png"
            width={56}
            height={56}
            alt="Address 2"
            className="rounded-full -ml-4 border-2 border-white"
          />,
        );
      }

      // For 2 recipients: show address_2.png and address_3.png
      else if (recipientCount === 2) {
        images.push(
          <Image
            key="address-2"
            src="/address_2.png"
            width={56}
            height={56}
            alt="Address 2"
            className="rounded-full -ml-4 border-2 border-white"
          />,
        );
        images.push(
          <Image
            key="address-3"
            src="/address_3.png"
            width={56}
            height={56}
            alt="Address 3"
            className="rounded-full -ml-4 border-2 border-white"
          />,
        );
      }

      // For 3+ recipients: show address_2.png, address_3.png, and +N circle
      else if (recipientCount >= 3) {
        images.push(
          <Image
            key="address-2"
            src="/address_2.png"
            width={56}
            height={56}
            alt="Address 2"
            className="rounded-full -ml-4 border-2 border-white"
          />,
        );
        images.push(
          <Image
            key="address-3"
            src="/address_3.png"
            width={56}
            height={56}
            alt="Address 3"
            className="rounded-full -ml-4 border-2 border-white"
          />,
        );
        images.push(
          <div
            key="additional-count"
            className="w-14 h-14 rounded-full bg-[#E8EFFF] border-2 border-white -ml-4 flex items-center justify-center"
          >
            <span className="text-[#0075FF] font-semibold text-sm">
              +{recipientCount - 2}
            </span>
          </div>,
        );
      }

      return (
        <div className="flex items-center justify-center mb-4">{images}</div>
      );
    }

    return null;
  };

  const getMainText = () => {
    if (type === "multisend") {
      return `You sent ~${amount} ${token} to ${recipientCount} address${recipientCount > 1 ? "es" : ""}`;
    } else {
      return `You interacted with ${contractCount} contract${contractCount > 1 ? "s" : ""}`;
    }
  };

  const getSubText = () => {
    if (type === "multisend") {
      return "Transfer usually takes <10s";
    } else {
      return "Interaction usually takes <10s";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop - only blur the main content area, not sidebar */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Address Images Section */}
        {renderAddressImages()}

        {/* Main Text */}
        <div className="text-center mb-2">
          <p className="text-gray-900 font-medium">{getMainText()}</p>
        </div>

        {/* Sub Text */}
        <div className="text-center mb-6">
          <p className="text-gray-500 text-sm">{getSubText()}</p>
        </div>

        {/* Separator */}
        <div className="relative my-6 -mx-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-400/20" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-100 px-3 py-1 text-xs text-[#A7A7A7] border border-white/10 rounded-full flex items-center">
              <span>
                <Image src="/lock.svg" width={16} height={16} alt="lock" />
              </span>
              <span className="ml-1">
                secured by <strong className="text-black/50">coinbase</strong>
              </span>
            </span>
          </div>
        </div>

        {/* Explorer Button */}
        <button
          onClick={() => {
            if (isExplorerEnabled && transactionHash) {
              window.open(getExplorerUrl(), "_blank");
            }
          }}
          disabled={!isExplorerEnabled || !transactionHash}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            isExplorerEnabled && transactionHash
              ? "bg-[#0075FF] text-white hover:bg-blue-600 cursor-pointer"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          View on explorer
        </button>
      </div>
    </div>
  );
}
