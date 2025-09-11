"use client";

import {
  useCurrentUser,
  useIsSignedIn,
  useSignOut,
  useExportEvmAccount,
  useEvmAddress,
} from "@coinbase/cdp-hooks";
import { useState } from "react";
import {
  ChevronDown,
  Copy,
  Download,
  LogOut,
  Check,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { copyToClipboard } from "@/utils/clipboard";

interface AddressDropdownProps {
  selectedNetwork: "base-sepolia";
}

/**
 * Address dropdown component for the top left corner
 */
export default function AddressDropdown({
  selectedNetwork,
}: AddressDropdownProps) {
  const { isSignedIn } = useIsSignedIn();
  const { signOut } = useSignOut();
  const { currentUser } = useCurrentUser();
  const smartAccount = currentUser?.evmSmartAccounts?.[0];
  const embeddedAccount = currentUser?.evmAccounts?.[0];
  const { exportEvmAccount } = useExportEvmAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const networkLabel =
    selectedNetwork === "base-sepolia" ? "TESTNET" : "MAINNET";

  if (!isSignedIn || !smartAccount) {
    return null;
  }

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setExportSuccess(false);
      const { privateKey } = await exportEvmAccount({
        evmAccount: embeddedAccount!,
      });
      await copyToClipboard(privateKey);
      setExportSuccess(true);
      // Reset success state after 2 seconds
      setTimeout(() => setExportSuccess(false), 2000);
    } catch (error) {
      console.error("Error exporting account:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
      >
        <Image
          src="/address-image.png"
          alt="Address"
          className="rounded-xs"
          width={32}
          height={32}
        />
        <div className="flex flex-col items-start">
          <span className="text-xs text-gray-500 uppercase font-medium">
            {networkLabel}
          </span>
          <span className="font-mono text-sm text-gray-900">
            {smartAccount.slice(0, 6)}...{smartAccount.slice(-4)}
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-900 break-all tracking-tight">
                  {`${smartAccount.slice(0, 8)}...${smartAccount.slice(-6)}`}
                </span>
                <button
                  onClick={() => copyToClipboard(smartAccount)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors ml-2 flex-shrink-0 cursor-pointer"
                  title="Copy address"
                >
                  <Copy className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            {/*Export Private key*/}
            <div className="p-2">
              <button
                onClick={() => {
                  handleExport();
                }}
                disabled={isExporting}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-900 hover:bg-gray-100 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : exportSuccess ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {isExporting
                  ? "Exporting..."
                  : exportSuccess
                    ? "Copied!"
                    : "Export Private Key"}
              </button>
            </div>
            <div className="p-2">
              <button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
