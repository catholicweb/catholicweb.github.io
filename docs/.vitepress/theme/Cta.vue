<!-- .vitepress/theme/blocks/CtaBlock.vue -->
<template>
  <section class="py-16 bg-gradient-to-r from-primary to-secondary">
    <div class="container mx-auto px-4 text-center">
      <h2 v-if="block.title" class="text-4xl font-bold text-white mb-4">{{ block.title }}</h2>
      <p v-if="block.description" class="text-xl text-white/90 mb-8 max-w-2xl mx-auto">{{ block.description }}</p>
      
      <!-- CTA Buttons -->
      <div class="flex flex-wrap gap-4 justify-center">
        <a 
          v-for="(element, idx) in block.elements" 
          :key="idx"
          :href="element.link"
          :class="['btn', element.primary ? 'btn-accent' : 'btn-outline btn-accent', 'btn-lg']"
        >
          {{ element.title }}
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  block: {
    type: Object,
    required: true
  }
})
</script>