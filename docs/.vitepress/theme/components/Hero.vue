<!-- .vitepress/theme/blocks/HeroBlock.vue -->
<template>
  <div v-if="block.image" class="hero min-h-[50vh]" :style="heroBgStyle(block.image)">
    <div class="hero-overlay"></div>
    <div class="hero-content text-white text-center">
      <div class="max-w-md">
        <h1 v-if="block.title" class="mb-5 text-5xl font-bold">
          {{ block.title }}
        </h1>
        <p v-if="block.subtitle" class="mb-5">{{ block.subtitle }}</p>
        <div class="flex flex-wrap gap-4 justify-center">
          <a v-for="(elem, idx) in block.elements" :key="idx" :href="elem.link" class="btn btn-primary">
            {{ elem.title }}
          </a>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="container mx-auto px-4 pt-16">
    <h2 v-if="block.title" class="text-4xl font-bold text-center mb-4">{{ block.title }}</h2>
  </div>
  <div class="container mx-auto px-4 py-16">
    <div v-if="block.cuerpo" class="prose text-lg mb-12 max-w-2xl mx-auto" v-html="block.cuerpoHtml"></div>
  </div>
</template>

<script setup>
function heroBgStyle(imageUrl) {
  const src720 = imageUrl.replace("480", "720");
  const src1080 = imageUrl.replace("480", "1080");

  return {
    backgroundImage: `image-set(
      url('${imageUrl}') 1x,
      url('${src720}') 2x,
      url('${src1080}') 3x
    )`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

defineProps({
  block: {
    type: Object,
    required: true,
  },
});
</script>
