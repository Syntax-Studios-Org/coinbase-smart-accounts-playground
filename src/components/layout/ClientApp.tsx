"use client";

import { useIsInitialized, useIsSignedIn } from "@coinbase/cdp-hooks";

import { Loading, SignInScreen } from "@/components";
import SmartAccountPlayground from "@/components/layout/SmartAccountPlayground";

/**
 * A component that displays the client app.
 */
export default function ClientApp() {
  const { isInitialized } = useIsInitialized();
  const { isSignedIn } = useIsSignedIn();

  return (
    <div className="app flex-col-container flex-grow bg-[#F5F5F5]">
      {!isInitialized && <Loading />}
      {isInitialized && (
        <>
          {!isSignedIn && <SignInScreen />}
          {isSignedIn && <SmartAccountPlayground />}
        </>
      )}
    </div>
  );
}
