<script setup lang="ts">
import { computed, ref } from "vue";
import { useData, useRoute } from "vitepress";

interface NavItem {
  text: string;
  link?: string;
  items?: NavItem[];
}

interface Language {
  code: string;
  label: string;
  path: string;
}

interface Theme {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const { theme, site } = useData();
const route = useRoute();

const nav = computed(() => theme.value.nav || []);
const languages = computed<Language[]>(() => theme.value.languages || []);
const themes = computed<Theme[]>(() => theme.value.themes || []);

const currentLang = computed(() => {
  const path = route.path;
  return languages.value.find((lang) => path.startsWith(`/${lang.path}`) || (lang.path === "/" && !path.match(/^\/(en|eus)\//))) || languages.value[0];
});

const currentTheme = ref(themes.value[0]?.id || "default");
if (typeof window !== "undefined") {
  const saved = localStorage.getItem("theme");
  if (saved) currentTheme.value = saved;
}

const hasItems = (item: NavItem) => item.items && item.items.length > 0;
const isActive = (item: NavItem) => {
  if (item.link) return route.path === item.link || route.path.startsWith(item.link + "/");
  if (item.items) return item.items.some(isActive);
  return false;
};

const switchLanguage = (lang: Language) => {
  const currentPath = route.path;
  let newPath = currentPath;
  languages.value.forEach((l) => {
    if (l.path !== "/" && currentPath.startsWith(`/${l.path}`)) {
      newPath = currentPath.substring(l.path.length + 1);
    }
  });
  newPath = lang.path === "/" ? `/${newPath}` : `/${lang.path}${newPath}`;
  window.location.href = newPath;
};

const switchTheme = (themeId: string) => {
  currentTheme.value = themeId;
  if (typeof window !== "undefined") {
    localStorage.setItem("theme", themeId);
    document.documentElement.setAttribute("data-theme", themeId);
  }
};

const openSections = ref<Record<string, boolean>>({});

const toggleSection = (key: string) => {
  openSections.value[key] = !openSections.value[key];
};

const mobileMenuOpen = ref(false);
</script>

<template>
  <div class="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <a :href="currentLang?.path || '/'" class="text-xl font-bold text-gray-900 text-accent hover:text-primary transition-colors">
            {{ site.title }}
          </a>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden lg:flex items-center space-x-1 font-medium text-md">
          <template v-for="item in nav" :key="item.text">
            <!-- Simple link -->
            <div v-if="!hasItems(item)">
              <a :href="item.link" :class="['px-4 py-2 transition-colors', isActive(item) ? 'bg-accent text-accent' : 'text-gray-700 hover:text-accent  hover:bg-gray-50 ']">
                {{ item.text }}
              </a>
            </div>

            <!-- Dropdown -->
            <div v-else class="relative group">
              <button class="px-4 py-2 ext-gray-700 hover:text-accent hover:bg-gray-50 transition-colors flex items-center gap-1">
                {{ item.text }}
                <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <div class="absolute left-0 mt-0 w-96 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all z-50">
                <template v-for="section in item.items" :key="section.text">
                  <div v-if="section.items">
                    <!-- Botón de sección con subitems -->
                    <button @click="toggleSection(section.text)" class="w-full text-left px-4 py-2 flex justify-between items-center text-gray-700 hover:bg-gray-50 hover:text-accent transition-colors font-bold">
                      {{ section.text }}
                      <svg class="w-4 h-4 transition-transform" :class="openSections[section.text] ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <!-- Subitems -->
                    <div v-show="openSections[section.text]" class="pl-4 space-y-1 mt-1">
                      <template v-for="sub in section.items" :key="sub.text">
                        <a :href="sub.link" class="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors" :class="isActive(sub) ? 'bg-accent text-accent' : ''">
                          {{ sub.text }}
                        </a>
                      </template>
                    </div>
                  </div>

                  <div v-else>
                    <a :href="section.link" class="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors" :class="isActive(section) ? 'bg-accent text-accent' : ''">
                      {{ section.text }}
                    </a>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </div>

        <!-- Right controls -->
        <div class="flex items-center space-x-2">
          <!-- Language Switcher -->
          <div v-if="languages.length > 1" class="relative group">
            <button class="px-2 py-1 rounded-md text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-1">
              <span>{{ currentLang.code.toUpperCase() }}</span>
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.23 7.21a.75.75 0 011.06 0L10 10.91l3.71-3.7a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 010-1.06z" />
              </svg>
            </button>
            <div class="absolute right-0 w-36 bg-white opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all z-50">
              <a v-for="lang in languages" :key="lang.code" @click.prevent="switchLanguage(lang)" class="block px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors" :class="lang.code === currentLang.code ? 'text-accent' : 'text-gray-700 '">
                {{ lang.label }}
              </a>
            </div>
          </div>

          <!-- Theme Switcher -->
          <div v-if="themes.length > 0" class="relative group">
            <button class="px-2 py-1 rounded-md text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-1">
              <span>Theme</span>
            </button>
            <div class="absolute right-0 w-64 bg-white opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all z-50">
              <div v-for="themeItem in themes" :key="themeItem.id" @click.prevent="switchTheme(themeItem.id)" class="flex items-start gap-3 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors" :class="themeItem.id === currentTheme ? 'text-accent' : 'text-gray-700 '">
                <span class="text-xl">{{ themeItem.icon }}</span>
                <div class="flex flex-col">
                  <span class="font-medium">{{ themeItem.name }}</span>
                  <span class="text-xs opacity-70">{{ themeItem.description }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile Menu Button -->
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="lg:hidden px-2 py-1 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
            <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-show="mobileMenuOpen" class="lg:hidden bg-white border-t border-gray-200 text-md">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <template v-for="item in nav" :key="item.text">
            <div v-if="!hasItems(item)">
              <a :href="item.link" @click="mobileMenuOpen = false" class="block px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
                {{ item.text }}
              </a>
            </div>
            <div v-else>
              <details class="group">
                <summary class="font-bold px-3 py-2 rounded-md flex justify-between items-center text-gray-700 hover:bg-gray-100 cursor-pointer">
                  <span>{{ item.text }}</span>
                  <svg class="w-4 h-4 transition-transform group-open:rotate-180" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.23 7.21a.75.75 0 011.06 0L10 10.91l3.71-3.7a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 010-1.06z" />
                  </svg>
                </summary>
                <div class="pl-4 space-y-1 mt-1">
                  <template v-for="section in item.items" :key="section.text">
                    <div v-if="section.items">
                      <details class="group">
                        <summary class="px-3 py-2 font-bold rounded-md flex justify-between items-center text-gray-700 hover:bg-gray-100 cursor-pointer">
                          {{ section.text }}
                          <svg class="w-4 h-4 transition-transform group-open:rotate-180" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5.23 7.21a.75.75 0 011.06 0L10 10.91l3.71-3.7a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 010-1.06z" />
                          </svg>
                        </summary>
                        <div class="pl-4 space-y-1 mt-1">
                          <template v-for="sub in section.items" :key="sub.text">
                            <a @click="mobileMenuOpen = false" :href="sub.link" class="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
                              {{ sub.text }}
                            </a>
                          </template>
                        </div>
                      </details>
                    </div>
                    <div v-else>
                      <a @click="mobileMenuOpen = false" :href="section.link" class="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
                        {{ section.text }}
                      </a>
                    </div>
                  </template>
                </div>
              </details>
            </div>
          </template>
        </div>
      </div>
    </nav>
  </div>
</template>
