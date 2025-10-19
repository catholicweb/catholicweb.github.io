<!-- .vitepress/theme/Layout.vue -->
<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar Component -->
    <Navbar />

    <!-- Main Content - Block System -->
    <main class="flex-1">
      <!-- If page has blocks, render them -->
      <div v-if="page.frontmatter.blocks && page.frontmatter.blocks.length > 0">
        <div v-for="(block, index) in page.frontmatter.blocks">
            <component 
              :key="index"
              :is="getBlockComponent(block.type)"
              :block="block"
            />
        </div>
      </div>
      
      <!-- Otherwise, render markdown content normally -->
      <div v-else class="container mx-auto px-4 py-8 max-w-5xl">
        <Content />
      </div>
    </main>

    <!-- Footer Component -->
    <Footer />
  </div>
</template>

<script setup>
import { useData } from 'vitepress'
import Navbar from './Navbar.vue'
import Footer from './Footer.vue'
import HeroBlock from './HeroBlock.vue'
import GalleryBlock from './GalleryBlock.vue'
import FeaturesBlock from './FeaturesBlock.vue'
import CtaBlock from './CtaBlock.vue'
import Carousel from './Carousel.vue'

const { page } = useData()

// Map block types to components
const blockComponents = {
  hero: HeroBlock,
  gallery: GalleryBlock,
  features: FeaturesBlock,
  cta: CtaBlock,
  carousel: Carousel,
}

const getBlockComponent = (type) => {
  return blockComponents[type] || ContentBlock
}
</script>