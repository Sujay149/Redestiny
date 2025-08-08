import { useCallback } from "react";

export function useOAuthLogin() {
  return useCallback((provider: "google" | "github", onSuccess: (data: { token: string, email: string, photoURL?: string }) => void) => {
    const width = 500, height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const url = `http://localhost:5000/api/auth/${provider}`;
    const popup = window.open(
      url,
      `${provider}-oauth`,
      `width=${width},height=${height},left=${left},top=${top}`
    );
    if (!popup) return;

    function handleMessage(event: MessageEvent) {
      if (event.origin !== "http://localhost:5000") return;
      if (event.data && event.data.token && event.data.email) {
        onSuccess({
          token: event.data.token,
          email: event.data.email,
          photoURL: event.data.photoURL,
        });
        window.removeEventListener("message", handleMessage);
      }
    }
    window.addEventListener("message", handleMessage);
  }, []);
}
