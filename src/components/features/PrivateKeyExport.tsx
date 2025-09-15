"use client";

import { useState } from "react";
import {
  KeySquare,
  EyeOff,
  Eye,
  Copy,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { useCurrentUser, useExportEvmAccount } from "@coinbase/cdp-hooks";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { copyToClipboard } from "@/utils/clipboard";

/**
 * Private Key Export component for securely displaying and copying private keys
 */
export default function PrivateKeyExport() {
  const { currentUser } = useCurrentUser();
  const { exportEvmAccount } = useExportEvmAccount();
  const [privateKey, setPrivateKey] = useState<string>("");
  const [isRevealed, setIsRevealed] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const embeddedAccount = currentUser?.evmAccounts?.[0];

  const handleRevealKey = async () => {
    if (isRevealed) {
      setIsRevealed(false);
      return;
    }

    try {
      setIsExporting(true);
      const { privateKey: exportedKey } = await exportEvmAccount({
        evmAccount: embeddedAccount!,
      });
      setPrivateKey(exportedKey);
      setIsRevealed(true);
    } catch (error) {
      console.error("Error exporting private key:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!privateKey) return;

    try {
      setIsCopying(true);
      await copyToClipboard(privateKey);
      // Reset copy state after 2 seconds
      setTimeout(() => setIsCopying(false), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      setIsCopying(false);
    }
  };

  const securityPoints = [
    "Your Private key is like your password for your wallet",
    "If someone gets it they can drain your wallet",
    "Never share it with anyone - no person, website or app",
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
      <ScreenHeader
        icon={KeySquare}
        title="Private Key Export"
        description="Keep your private key secret"
      />

      <div className="p-6 pt-0">
        <div className="mx-[15%]">
          {/* Private Key Reveal Section */}
          <div className="bg-gray-50 border-none rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm text-[#737373] tracking-tight">Reveal private key</h3>
              <button
                onClick={handleRevealKey}
                disabled={isExporting}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
              >
                {isExporting ? (
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                ) : isRevealed ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-md p-3 mb-4">
              <div className="font-mono text-sm text-gray-900 break-all">
                {isRevealed ? (
                  privateKey
                ) : (
                  <div className="blur-sm select-none">
                    0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleCopyToClipboard}
            disabled={!isRevealed || isCopying}
            className="w-full mt-2 mb-6 flex items-center justify-center gap-2 bg-[#FAFAFA] disabled:bg-gray-300 disabled:cursor-not-allowed text-[#171717] py-2 px-4 rounded-md transition-colors"
          >
            <Copy className="w-4 h-4" />
            {isCopying ? "Copied!" : "Copy to Clipboard"}
          </button>

          {/* Divider */}
          <div
            className="border-b mb-6"
            style={{
              borderWidth: "1px",
              opacity: 1,
              borderStyle: "dashed",
              borderColor: "#0000001F",
            }}
          />

          {/* Security Warning Points */}
          <div className="space-y-4">
            {securityPoints.map((point, index) => (
              <div key={index} className="flex items-center gap-3">
                <ShieldCheck
                  className="w-5 h-5 mt-0.5 flex-shrink-0"
                  style={{ color: "#737373" }}
                />
                <p className="text-sm text-gray-700">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
