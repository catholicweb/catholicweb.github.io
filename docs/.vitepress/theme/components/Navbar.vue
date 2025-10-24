<!-- .vitepress/theme/components/Navbar.vue -->
<template>
  <div class="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo/Brand -->
        <div class="flex items-center">
          <a :href="site.base" class="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {{ site.title }}
          </a>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden lg:flex items-center space-x-1">
          <!-- Root Posts -->
          <template v-for="item in data.rootPosts" :key="item.url">
            <a
              :href="item.url"
              :class="[
                'px-4 py-2 text-sm font-medium transition-colors',
                isActive(item.url)
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              ]"
            >
              {{ item.frontmatter.title }}
            </a>
          </template>

          <!-- Sections with Dropdowns -->
          <div
            v-for="section in data.sections"
            :key="section.key"
            class="relative group"
          >
            <button
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-1"
            >
              {{ section.title }}
              <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div class="absolute left-0 mt-0 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 -translate-y-2">
              <div class="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden max-h-96 overflow-y-auto">
                <template v-for="post in section.posts" :key="post.url">
                  <!-- Check if post has children -->
                  <div v-if="post.children && post.children.length > 0" class="relative group/nested">
                    <div class="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between">
                      <span>{{ post.frontmatter.title }}</span>
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>

                    <!-- Nested Dropdown -->
                    <div class="absolute left-full top-0 w-56 opacity-0 invisible group-hover/nested:opacity-100 group-hover/nested:visible transition-all duration-200">
                      <div class="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 ml-1 max-h-96 overflow-y-auto">
                        <a
                          v-for="child in post.children"
                          :key="child.url"
                          :href="child.url"
                          :class="[
                            'block px-4 py-2.5 text-sm transition-colors',
                            isActive(child.url)
                              ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                              : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                          ]"
                        >
                          {{ child.frontmatter.title }}
                        </a>
                      </div>
                    </div>
                  </div>

                  <!-- Regular post without children -->
                  <a
                    v-else
                    :href="post.url"
                    :class="[
                      'block px-4 py-2.5 text-sm transition-colors',
                      isActive(post.url)
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    ]"
                  >
                    {{ post.frontmatter.title }}
                  </a>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- Language Switcher -->
        <div class="relative group">
          <button
            class="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-1"
            aria-label="Change language"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span class="text-xs font-semibold uppercase">{{ currentLang }}</span>
          </button>

          <!-- Language Dropdown -->
          <div class="absolute right-0 mt-0 w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 -translate-y-2">
            <div class="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <a
                v-for="lang in languages"
                :key="lang.code"
                :href="lang.path"
                :class="[
                  'block px-4 py-2.5 text-sm transition-colors',
                  currentLang === lang.code
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                ]"
              >
                {{ lang.label }}
              </a>
            </div>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle mobile menu"
        >
          <svg v-if="!isMobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div
        v-if="isMobileMenuOpen"
        class="lg:hidden border-t border-gray-200 dark:border-gray-800 max-h-[calc(100vh-4rem)] overflow-y-auto"
      >
        <div class="py-2 space-y-1">
          <!-- Root Posts Mobile -->
          <a
            v-for="item in data.rootPosts"
            :key="item.url"
            :href="item.url"
            :class="[
              'block px-4 py-3 text-sm font-medium transition-colors',
              isActive(item.url)
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            ]"
          >
            {{ item.frontmatter.title }}
          </a>

          <!-- Sections Mobile -->
          <div v-for="section in data.sections" :key="section.key">
            <button
              @click="toggleSection(section.key)"
              class="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span>{{ section.title }}</span>
              <svg
                :class="['w-4 h-4 transition-transform', openSections.has(section.key) ? 'rotate-180' : '']"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div v-if="openSections.has(section.key)" class="bg-gray-50 dark:bg-gray-800/50">
              <template v-for="post in section.posts" :key="post.url">
                <!-- Post with children -->
                <div v-if="post.children && post.children.length > 0">
                  <button
                    @click="toggleNestedSection(post.url)"
                    class="w-full flex items-center justify-between px-8 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <span>{{ post.frontmatter.title }}</span>
                    <svg
                      :class="['w-4 h-4 transition-transform', openNestedSections.has(post.url) ? 'rotate-90' : '']"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <div v-if="openNestedSections.has(post.url)" class="bg-gray-100 dark:bg-gray-900/50">
                    <a
                      v-for="child in post.children"
                      :key="child.url"
                      :href="child.url"
                      :class="[
                        'block px-12 py-2.5 text-sm transition-colors',
                        isActive(child.url)
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-800'
                      ]"
                    >
                      {{ child.frontmatter.title }}
                    </a>
                  </div>
                </div>

                <!-- Regular post -->
                <a
                  v-else
                  :href="post.url"
                  :class="[
                    'block px-8 py-2.5 text-sm transition-colors',
                    isActive(post.url)
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  ]"
                >
                  {{ post.frontmatter.title }}
                </a>
              </template>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useData } from "vitepress";
import { data } from "./../../posts.data.js";

const { site, page } = useData();
const isDark = ref(false);
const isMobileMenuOpen = ref(false);
const openSections = ref(new Set());
const openNestedSections = ref(new Set());

const languages = [
  { code: 'es', label: 'Español', path: site.value.base },
  { code: 'en', label: 'English', path: site.value.base + 'en/' },
  { code: 'eus', label: 'Euskara', path: site.value.base + 'eus/' }
];

const currentLang = computed(() => {
  const path = page.value.relativePath;
  if (path.startsWith('en/')) return 'en';
  if (path.startsWith('eus/')) return 'eus';
  return 'es';
});

const isActive = (url) => {
  const currentPath = "/" + page.value.relativePath.replace(/\.md$/, "");
  const linkPath = url.replace(/\.html$/, "");
  return currentPath === linkPath;
};

const toggleSection = (key) => {
  if (openSections.value.has(key)) {
    openSections.value.delete(key);
  } else {
    openSections.value.add(key);
  }
};

const toggleNestedSection = (url) => {
  if (openNestedSections.value.has(url)) {
    openNestedSections.value.delete(url);
  } else {
    openNestedSections.value.add(url);
  }
};

onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  isDark.value = savedTheme === "dark";
  document.documentElement.classList.toggle('dark', isDark.value);
});
</script>

<style scoped>
/* Smooth scrollbar for dropdowns */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgb(209 213 219);
  border-radius: 3px;
}

.dark ::-webkit-scrollbar-thumb {
  background: rgb(75 85 99);
}

::-webkit-scrollbar-thumb:hover {
  background: rgb(156 163 175);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgb(107 114 128);
}
</style>