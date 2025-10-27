<script setup>
defineProps({
  block: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <section class="py-16">
    <div class="container mx-auto px-4 py-16">
      <div v-if="block.html" class="prose text-lg mb-12 max-w-2xl mx-auto" v-html="block.html"></div>
    </div>
  </section>
</template>
