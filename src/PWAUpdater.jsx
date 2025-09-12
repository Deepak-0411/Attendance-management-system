import { useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

export default function PWAUpdater() {
  const [show, setShow] = useState(true);
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegisterError(err) {
      console.error("SW registration error", err);
    },
  });

  if (!show || (!offlineReady && !needRefresh)) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 p-3 rounded-xl shadow-lg bg-white flex items-center justify-between gap-3 z-[9999]">
      <span>
        {offlineReady
          ? "App is ready to work offline."
          : "New version available."}
      </span>
      <div className="flex gap-2">
        {needRefresh && (
          <button
            onClick={() => updateServiceWorker(true)}
            className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Reload
          </button>
        )}
        <button
          onClick={() => {
            setShow(false);
            setOfflineReady(false);
            setNeedRefresh(false);
          }}
          className="px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
