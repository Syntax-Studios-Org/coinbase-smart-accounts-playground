"use client";

import { useIsSignedIn, useCurrentUser } from "@coinbase/cdp-hooks";
import { AuthButton } from "@coinbase/cdp-react/components/AuthButton";
import { useCopyToClipboard } from "@/utils/clipboard";

/**
 * Header component
 */
export default function Header() {
  const { isSignedIn } = useIsSignedIn();
  const { currentUser } = useCurrentUser();
  const smartAccount = currentUser?.evmSmartAccounts?.[0];
  const { copied, copy } = useCopyToClipboard();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900">🚀 CDP Smart Account Playground</h1>
          {smartAccount && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              ✨ Smart Account Active
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {isSignedIn && smartAccount && (
            <button
              onClick={() => copy(smartAccount)}
              className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors group"
              title="Click to copy Smart Account address"
            >
              <span className="font-mono">
                {smartAccount.slice(0, 6)}...{smartAccount.slice(-4)}
              </span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                {copied ? '✅' : '📋'}
              </span>
            </button>
          )}
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
