<!-- .vitepress/theme/blocks/Accordion.vue -->
<template>
  <div class="w-96 bg-base-100 py-16">
<div v-for="(element, idx) in block.elements" 
          :key="idx" class="collapse collapse-arrow bg-base-100 border border-base-300">
  <input type="radio" :name="'my-accordion-'+idx"/>
  <div class="collapse-title font-semibold">{{ element.title }}</div>
  <div class="collapse-content text-sm">{{ element.description }}</div>
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
