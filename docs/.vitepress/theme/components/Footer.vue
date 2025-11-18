<template>
  <footer class="bg-gray-800 text-white pt-8 pb-4">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <!-- Contact Section -->
        <div>
          <h4 class="text-xl font-semibold mb-3">Contacto</h4>
          <div class="flex flex-col space-y-2 items-center">
            <template v-for="(collab, index) in collaborators">
              <a v-if="collab.phonenumber" :href="`tel:+34${collab.phonenumber.replace(/\s/g, '')}`" class="text-gray-300 flex items-center hover:text-gray-300 transition-colors">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>{{ collab.name }}</span>
              </a>
              <a v-if="collab.email" :href="`mailto:${collab.email}`" class="flex items-center hover:text-gray-300 transition-colors">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>{{ collab.email }}</span>
              </a>
            </template>
          </div>
        </div>

        <!-- Description Section -->
        <div>
          <h4 class="text-xl font-semibold mb-3">{{ config.title }}</h4>
          <p class="mb-4 text-gray-300">{{ config.description }}</p>
          <a v-if="config.youtube" target="_blank" rel="noopener noreferrer" :href="config.youtube" class="inline-block hover:text-red-500 transition-colors">
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
        </div>

        <!-- Financial Support Section -->
        <div>
          <h4 class="text-xl font-semibold mb-3">Ayuda económica</h4>
          <div class="text-gray-300 space-y-1">
            <template v-for="(bank, index) in config.bank">
              <p v-if="bank.account.includes('https://')">
                <strong>{{ bank.title }}: </strong><a href="{{ bank.account }}">Donar</a>
              </p>
              <p v-else>
                <strong>{{ bank.title }}: </strong>{{ bank.account }}
              </p>
            </template>
          </div>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="mt-4 pt-4 border-t border-gray-700 text-center">
        <p class="text-sm text-gray-400">
          <em> &copy; {{ new Date().getFullYear() }} — Built with <span class="font-semibold">VitePress</span> & <span class="font-semibold">Tailwind CSS</span> </em>
        </p>
        <p class="mt-4 text-sm">
          <a href="/aviso-legal" class="text-white hover:text-accent transition-colors"> Aviso Legal </a>
        </p>
      </div>
    </div>

    <!-- PWA Install Button -->
    <button v-if="false" @click="handleInstall" title="Instalar app" class="fixed bottom-6 right-6 bg-white text-gray-800 border border-gray-300 rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors z-[999]">
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M12 16l4-5h-3V4h-2v7H8l4 5zm-7 2h14v2H5v-2z" />
      </svg>
    </button>
  </footer>
</template>

<script setup>
import { ref, computed } from "vue";
import { useData, useRoute } from "vitepress";
const { theme } = useData();
const config = ref(theme.value.config || {});
const collaborators = ref([
  {
    name: "pepe",
    phonenumber: "98998",
  },
]);

/*
export default {
  data() {
    return {
      showInstallBtn: false,
      deferredPrompt: null,
      collaborators: [
        { name: "Colaborador 1", phonenumber: "600 123 456" },
        { name: "Colaborador 2", phonenumber: "600 789 012" },
      ],
      siteDescription: "Herri txikien alde, politika konkretuak egiteko.",
    };
  },
  mounted() {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallBtn = true;
    });
  },
  methods: {
    async handleInstall() {
      if (!this.deferredPrompt) return;

      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;

      if (outcome === "accepted") {
        this.showInstallBtn = false;
      }
      this.deferredPrompt = null;
    },
  },
};*/
</script>
