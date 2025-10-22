<!-- .vitepress/theme/blocks/HeroBlock.vue -->
<template>
  <div
    v-if="block.image"
    class="hero min-h-[60vh]"
    :style="{ backgroundImage: `url(${block.image})` }"
  >
    <div class="hero-overlay"></div>
    <div class="hero-content text-white text-center">
      <div class="max-w-md">
        <h1 v-if="block.title" class="mb-5 text-5xl font-bold">
          {{ block.title }}
        </h1>
        <p v-if="block.description" class="mb-5">{{ block.description }}</p>
        <div class="flex flex-wrap gap-4 justify-center">
          <a
            v-for="(elem, idx) in block.elements"
            :key="idx"
            :href="elem.link"
            class="btn btn-primary"
          >
            {{ elem.title }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  block: {
    type: Object,
    required: true,
  },
});
</script>
