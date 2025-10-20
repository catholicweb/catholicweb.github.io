<!-- .vitepress/theme/blocks/HeroBlock.vue -->
<template>
  <div v-for="(block, idx) in block.elements" :key="idx">
  <div v-if="block.image" class="hero min-h-[60vh]" :style="{ backgroundImage: `url(${block.image})` }">
  <div class="hero-overlay"></div>
  <div class="hero-content text-white text-center">
    <div class="max-w-md">
      <h1 v-if="block.title" class="mb-5 text-5xl font-bold">{{ block.title }}</h1>
      <p  v-if="block.description" class="mb-5">    {{ block.description }}     </p>
      <button v-if="block.action" class="btn btn-primary">{{ block.action }}</button>
    </div>
  </div>
</div>
</div>
</template>

<script setup>
defineProps({
  block: {
    type: Object,
    required: true
  }
})
</script>