<!-- .vitepress/theme/components/Navbar.vue -->
<template>
  <div class="navbar bg-base-100 shadow-lg sticky top-0 z-50">
    <div class="navbar-start">
      <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </label>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li v-for="item in posts" :key="item.link">
            <a :href="item.url.replace('.html','')" :class="{ 'active': page.relativePath.includes(item.url.slice(1)) }">
              {{ item.frontmatter.title }}
            </a>
          </li>
        </ul>
      </div>
      <a href="/" class="btn btn-ghost text-xl">{{ site.title }}</a>
    </div>
    
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li v-for="item in posts" :key="item.link">
          <a :href="item.url.replace('.html','')" :class="{ 'active': page.relativePath.includes(item.url.slice(1)) }">
            {{ item.frontmatter.title }}
          </a>
        </li>
      </ul>
    </div>
    
    <div class="navbar-end">
      <button @click="toggleTheme" class="btn btn-ghost btn-circle">
        <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useData } from 'vitepress'
import { data as posts } from './../posts.data.js'

const { site, page, theme } = useData()
const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  isDark.value = savedTheme === 'dark'
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
})
</script>

<style scoped>
/*.menu a.active {
  background-color: hsl(var(--p) / 0.2);
  color: hsl(var(--p));
}*/
</style>