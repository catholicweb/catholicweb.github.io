<!-- .vitepress/theme/blocks/FeaturesBlock.vue -->
<template>
  <section class="py-16 bg-base-200">
    <div class="container mx-auto px-4">
      <h2 v-if="block.title" class="text-4xl font-bold text-center mb-4">{{ block.title }}</h2>
      <p v-if="block.description" class="text-center text-lg mb-12 max-w-2xl mx-auto">{{ block.description }}</p>
      
      <!-- Features Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="(element, idx) in block.elements" 
          :key="idx"
          class="card bg-base-100 shadow-xl hover:scale-105 transition-transform"
        >
          <div class="card-body items-center text-center">
            <!-- Icon/Image -->
            <div v-if="element.image" class="avatar mb-4">
              <div class="w-24 rounded-full">
                <img :src="element.image" :alt="element.title" />
              </div>
            </div>
            
            <!-- Emoji/Icon fallback -->
            <div v-else-if="element.icon" class="text-6xl mb-4">
              {{ element.icon }}
            </div>
            
            <h3 class="card-title">{{ element.title }}</h3>
            <p v-if="element.description">{{ element.description }}</p>
            <p v-if="element.text">{{ element.text }}</p>
            
            <!-- Optional CTA -->
            <div v-if="element.link" class="card-actions mt-4">
              <a :href="element.link" class="btn btn-primary btn-sm">Learn More</a>
            </div>
          </div>
        </div>
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