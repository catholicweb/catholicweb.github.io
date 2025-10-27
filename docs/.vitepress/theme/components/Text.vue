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
    <div class="container mx-auto px-4">
      <h2 v-if="block.title" class="text-4xl font-bold text-center mb-4">{{ block.title }}</h2>
      <div v-if="block.cuerpo" class="prose text-md mb-12 max-w-2xl mx-auto" v-html="block.cuerpoHtml"></div>
    </div>
  </section>
</template>
