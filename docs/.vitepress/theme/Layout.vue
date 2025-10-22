<!-- .vitepress/theme/Layout.vue -->
<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar Component -->
    <Navbar />

    <!--<Hero :block="page.frontmatter"/>-->

    <!-- Main Content - Block System -->
    <main class="flex-1">
      <section v-for="(block, index) in page.frontmatter.blocks">
        <component
          :key="index"
          :is="getBlockComponent(block.type)"
          :block="block"
        />
      </section>
    </main>

    <Content />

    <!-- Footer Component -->
    <Footer />
  </div>
</template>

<script setup>
import { useData } from "vitepress";
import Navbar from "./Navbar.vue";
import Footer from "./Footer.vue";
import Text from "./Text.vue";
import Hero from "./Hero.vue";
import Gallery from "./Gallery.vue";
import Accordion from "./Accordion.vue";
import Cta from "./Cta.vue";
import Carousel from "./Carousel.vue";

const { page } = useData();

// Map block types to components
const blockComponents = {
  hero: Hero,
  text: Text,
  gallery: Gallery,
  features: Gallery,
  accordion: Accordion,
  cta: Cta,
  carousel: Carousel,
};

const getBlockComponent = (type) => {
  return blockComponents[type] || ContentBlock;
};
</script>
