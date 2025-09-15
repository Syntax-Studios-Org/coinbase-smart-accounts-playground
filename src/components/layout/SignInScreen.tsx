"use client";

import { AuthButton } from "@coinbase/cdp-react/components/AuthButton";

/**
 * Sign in screen
 */
export default function SignInScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome!</h1>
          <p className="text-gray-600 mb-6">Please sign in to continue to the Smart Account Playground.</p>
          <AuthButton className="bg-black text-white cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
