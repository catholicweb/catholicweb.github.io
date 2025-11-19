<template>
  <div>
    <!-- Banner (solo si autoReload = false) -->
    <transition name="slide-down">
      <div v-if="showUpdateBanner" class="fixed top-0 left-0 right-0 z-[9999] bg-blue-600 text-white p-4 flex gap-3 justify-center items-center shadow">
        <span>{{ updateMessage }}</span>
        <button @click="handleRefresh" class="px-3 py-1 bg-white text-blue-600 font-semibold rounded">Refrescar</button>
        <button @click="dismissUpdate" class="px-3 py-1 border border-white rounded">Cerrar</button>
      </div>
    </transition>

    <!-- Botón instalar -->
    <transition name="fade">
      <button v-if="showInstallButton" @click="handleInstall" class="fixed bottom-6 right-6 bg-white border border-neutral-300 rounded-full p-3 shadow hover:bg-neutral-100 active:scale-95" title="Instalar app">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
          <path d="M12 16l4-5h-3V4h-2v7H8l4 5zm-7 2h14v2H5v-2z" />
        </svg>
      </button>
    </transition>
  </div>
</template>

<script>
export default {
  name: "PWAManager",

  props: {
    autoReload: {
      type: Boolean,
      default: true,
    },
    vapidKey: {
      type: String,
      required: true,
    },
    subscriptionEndpoint: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      showInstallButton: false,
      showUpdateBanner: false,
      updateMessage: "",
      deferredPrompt: null,
      registration: null,
    };
  },

  mounted() {
    this.initPWA();
  },

  methods: {
    async initPWA() {
      // --- SERVICE WORKER ----------------------------------------------
      if ("serviceWorker" in navigator) {
        try {
          this.registration = await navigator.serviceWorker.register("/sw.js");

          // Check updates cada minuto
          setInterval(() => this.registration.update(), 60000);

          // Escuchar mensajes del SW
          navigator.serviceWorker.addEventListener("message", (event) => {
            if (!event.data) return;

            if (event.data.type === "SW_UPDATED" || event.data.type === "CONTENT_UPDATED") {
              if (this.autoReload) {
                // Berriro kargatu (recargar)
                window.location.reload();
              } else {
                this.showUpdate("Nueva versión disponible");
              }
            }
          });
        } catch (err) {
          console.error("SW registration failed:", err);
        }
      }

      // --- BEFOREINSTALLPROMPT -----------------------------------------
      window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        this.deferredPrompt = e;
        this.showInstallButton = true;
      });

      // --- INSTALLED ---------------------------------------------------
      window.addEventListener("appinstalled", () => {
        this.showInstallButton = false;
        this.deferredPrompt = null;
      });

      // --- PUSH NOTIFICATION IF INSTALLED ------------------------------
      if (window.matchMedia("(display-mode: standalone)").matches) {
        await this.setupNotifications();
      }
    },

    // -------------------------------------------------------------------
    async handleInstall() {
      if (!this.deferredPrompt) return;

      this.deferredPrompt.prompt();
      await this.deferredPrompt.userChoice;

      this.showInstallButton = false;
      this.deferredPrompt = null;
    },

    async setupNotifications() {
      if (!("Notification" in window) || !("PushManager" in window)) return;

      try {
        const perm = await Notification.requestPermission();
        if (perm !== "granted") return;

        const sw = await navigator.serviceWorker.ready;

        let sub = await sw.pushManager.getSubscription();
        if (!sub) {
          sub = await sw.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array(this.vapidKey),
          });
        }

        await fetch(this.subscriptionEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscription: sub }),
        });
      } catch (err) {
        console.error("Notification setup failed:", err);
      }
    },

    // -------------------------------------------------------------------
    showUpdate(message) {
      this.updateMessage = message;
      this.showUpdateBanner = true;
    },

    handleRefresh() {
      window.location.reload();
    },

    dismissUpdate() {
      this.showUpdateBanner = false;
    },

    urlBase64ToUint8Array(base64) {
      const pad = "=".repeat((4 - (base64.length % 4)) % 4);
      const str = (base64 + pad).replace(/-/g, "+").replace(/_/g, "/");
      const raw = atob(str);
      return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
    },
  },
};
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
