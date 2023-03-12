// Register the service worker if available
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((reg) => {
      })
      .catch((err) =>
        console.error("Service worker registration failed:", err)
      );
  });
}