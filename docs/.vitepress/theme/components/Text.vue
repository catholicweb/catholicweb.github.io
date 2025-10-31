<script setup>
defineProps({
  block: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="container mx-auto px-4 py-16">
    <div v-if="block.html" class="prose mb-12 max-w-2xl mx-auto" v-html="block.html"></div>
  </div>
</template>
