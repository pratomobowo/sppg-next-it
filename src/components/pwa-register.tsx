"use client";

import React, { useEffect, useState } from "react";
import { Download, Bell, RefreshCw, X, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWARegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // 1. Service Worker Registration
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Register service worker
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[PWA] Service Worker registered with scope:", reg.scope);
          setRegistration(reg);

          // Check if there is an update waiting
          if (reg.waiting) {
            setShowUpdateBanner(true);
          }

          // Listen for updatefound event
          reg.onupdatefound = () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.onstatechange = () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  // New update is available!
                  setShowUpdateBanner(true);
                  toast.info("Update aplikasi tersedia! Klik tombol update untuk memuat versi terbaru.", {
                    duration: 8000,
                  });
                }
              };
            }
          };
        })
        .catch((err) => {
          console.error("[PWA] Service Worker registration failed:", err);
        });

      // 2. Install Prompt Listener (A2HS)
      const handleBeforeInstallPrompt = (e: Event) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        setDeferredPrompt(e as BeforeInstallPromptEvent);

        // Show our custom install banner after 5 seconds of session
        const hasDismissedInstall = localStorage.getItem("pwa-install-dismissed");
        if (!hasDismissedInstall) {
          const timer = setTimeout(() => {
            setShowInstallBanner(true);
          }, 8000);
          return () => clearTimeout(timer);
        }
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

      // 3. Notification Permission Flow
      // Prompt after 5 seconds if not granted/denied already
      const hasDismissedNotif = localStorage.getItem("pwa-notif-dismissed");
      if (
        "Notification" in window &&
        Notification.permission === "default" &&
        !hasDismissedNotif
      ) {
        const timer = setTimeout(() => {
          setShowNotificationPrompt(true);
        }, 12000); // 12 seconds after mount
        return () => {
          clearTimeout(timer);
          window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
      }

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      };
    }
  }, []);

  // Handle Install Action
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    // Show the install prompt
    await deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] User response to install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again, discard it
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  const dismissInstall = () => {
    setShowInstallBanner(false);
    // Suppress for 7 days
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  // Handle Update Action
  const handleUpdateClick = () => {
    if (registration && registration.waiting) {
      // Send skip waiting message
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
      setShowUpdateBanner(false);
      // Reload page to apply changes
      window.location.reload();
    } else {
      window.location.reload();
    }
  };

  // Handle Notification Action
  const handleNotificationRequest = async () => {
    if (!("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    setShowNotificationPrompt(false);
    if (permission === "granted") {
      toast.success("Notifikasi aktif! Anda akan menerima update langsung di perangkat ini.");
      // Test Notification
      if (registration) {
        registration.showNotification("SPPG Monitoring", {
          body: "Terima kasih! Notifikasi sistem monitoring dan procurement telah aktif.",
          icon: "/favicon-96x96.png",
          badge: "/favicon-96x96.png",
        });
      }
    } else {
      toast.error("Notifikasi diblokir. Anda dapat mengaktifkannya secara manual melalui pengaturan browser.");
    }
  };

  const dismissNotification = () => {
    setShowNotificationPrompt(false);
    // Dismiss and ask again in 3 days (simulated by storing timestamp)
    localStorage.setItem("pwa-notif-dismissed", Date.now().toString());
  };

  return (
    <>
      {/* 1. Custom A2HS Install Banner (Glow Card / Glassmorphism) */}
      {showInstallBanner && (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50 animate-in slide-in-from-bottom duration-300">
          <div className="relative overflow-hidden bg-slate-900/90 dark:bg-slate-950/95 backdrop-blur-md border border-emerald-500/20 text-white p-5 rounded-2xl shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]">
            {/* Ambient background decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />

            <button
              onClick={dismissInstall}
              className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors"
              aria-label="Tutup"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-4">
              <div className="bg-emerald-500/20 text-emerald-400 p-2.5 rounded-xl border border-emerald-500/30">
                <Download className="h-6 w-6 animate-pulse" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-base flex items-center gap-1.5 text-emerald-400">
                  <Sparkles className="h-4 w-4" /> Pasang Aplikasi SPPG
                </h4>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                  Pasang aplikasi di layar utama Anda untuk akses instan cepat, performa optimal, dan penggunaan offline.
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={handleInstallClick}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition text-slate-950 font-semibold text-xs rounded-lg shadow-lg shadow-emerald-500/20"
                  >
                    Pasang Sekarang
                  </button>
                  <button
                    onClick={dismissInstall}
                    className="px-3 py-2 text-slate-400 hover:text-white transition-colors text-xs font-medium"
                  >
                    Nanti Saja
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Update Available Banner */}
      {showUpdateBanner && (
        <div className="fixed top-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50 animate-in slide-in-from-top duration-300">
          <div className="relative overflow-hidden bg-slate-900/90 dark:bg-slate-950/95 backdrop-blur-md border border-blue-500/20 text-white p-5 rounded-2xl shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]">
            <button
              onClick={() => setShowUpdateBanner(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors"
              aria-label="Tutup"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-4">
              <div className="bg-blue-500/20 text-blue-400 p-2.5 rounded-xl border border-blue-500/30">
                <RefreshCw className="h-6 w-6 animate-spin" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-base text-blue-400">Update Aplikasi Tersedia</h4>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                  Versi terbaru dari sistem monitoring telah siap digunakan. Muat ulang sekarang untuk menerapkan pembaruan.
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={handleUpdateClick}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 active:scale-95 transition text-white font-semibold text-xs rounded-lg shadow-lg shadow-blue-500/20"
                  >
                    Perbarui Sekarang
                  </button>
                  <button
                    onClick={() => setShowUpdateBanner(false)}
                    className="px-3 py-2 text-slate-400 hover:text-white transition-colors text-xs font-medium"
                  >
                    Abaikan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Custom Push Notification Permission Request Dialog */}
      {showNotificationPrompt && (
        <div className="fixed bottom-6 left-6 right-6 md:left-6 md:right-auto md:max-w-md z-50 animate-in slide-in-from-bottom duration-300">
          <div className="relative overflow-hidden bg-slate-900/90 dark:bg-slate-950/95 backdrop-blur-md border border-amber-500/20 text-white p-5 rounded-2xl shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]">
            <button
              onClick={dismissNotification}
              className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors"
              aria-label="Tutup"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-4">
              <div className="bg-amber-500/20 text-amber-400 p-2.5 rounded-xl border border-amber-500/30">
                <Bell className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-base text-amber-400">Aktifkan Notifikasi?</h4>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                  Terima update real-time langsung di perangkat Anda saat ada laporan perlu review, DO disetujui, atau pencairan dana.
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={handleNotificationRequest}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 transition text-slate-950 font-semibold text-xs rounded-lg shadow-lg shadow-amber-500/20"
                  >
                    Aktifkan
                  </button>
                  <button
                    onClick={dismissNotification}
                    className="px-3 py-2 text-slate-400 hover:text-white transition-colors text-xs font-medium"
                  >
                    Nanti Saja
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
