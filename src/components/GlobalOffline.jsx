import React from "react";
import { useOffline } from "../context/OfflineContext";
import { triggerOfflineHandler } from "../utility/offlineHandler";

export default function GlobalOffline() {
  const { offline, setOffline } = useOffline();

  if (!offline) return null;

  const handleRetry = async () => {
    setOffline(false);
    const retryFn = triggerOfflineHandler()?.retryFn;
    if (retryFn) await retryFn(); // retry API without reloading page
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold">No Internet Connection</h1>
      <p className="mt-2 text-center">
        Please connect to the internet to continue using the app.
      </p>
      <button
        onClick={handleRetry}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Retry
      </button>
    </div>
  );
}
