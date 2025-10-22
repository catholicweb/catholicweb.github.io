<!-- .vitepress/theme/Layout.vue -->
<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar Component -->
    <component :is="components.Navbar" />

    <component :is="components.Text" :block="page.frontmatter" />

    <!--<Hero :block="page.frontmatter"/>-->

    <!-- Main Content - Block System -->
    <main class="flex-1" v-if="page.frontmatter.blocks">
      <section v-for="(block, index) in page.frontmatter.blocks">
        <component
          :key="index"
          :is="getBlockComponent(block.type)"
          :block="block"
        />
      </section>
    </main>

    <!-- Footer Component -->
    <component :is="components.Footer" />
  </div>
</template>

<script setup>
import { useData } from "vitepress";
import components from "./components";
const { page } = useData();

// Get the component matching the block type
function getBlockComponent(type) {
  // Convert "hero-options" → "Hero"
  const name = type.split("-")[0].replace(/(^\w)/g, (s) => s.toUpperCase());
  return components[name] || components["Text"];
}
</script>
