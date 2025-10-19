<!-- .vitepress/theme/blocks/GalleryBlock.vue -->
<template>
  <section class="py-16 bg-base-100">
    <div class="container mx-auto px-4">
      <h2 v-if="block.title" class="text-4xl font-bold text-center mb-4">{{ block.title }}</h2>
      <p v-if="block.description" class="text-center text-lg mb-12 max-w-2xl mx-auto">{{ block.description }}</p>
      
      <!-- Masonry Grid Gallery -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        <div 
          v-for="(element, idx) in block.elements" 
          :key="idx"
          class="card bg-base-200 image-full hover:shadow-2xl transition-shadow cursor-pointer"
          @click="openModal(element)"
        >
          <figure>
            <img 
              :src="element.image" 
              :alt="element.title || element.description || `Gallery item ${idx + 1}`"
              class="w-full h-64 object-cover"
            />
          </figure>
          <div v-if="element.title || element.description" class="card-body">
            <h3 v-if="element.title" class="card-title">{{ element.title }}</h3>
            <p v-if="element.description">{{ element.description }}</p>
          </div>
        </div>
      </div>
      
      <!-- Modal for enlarged image -->
      <dialog ref="modal" class="modal">
        <div class="modal-box max-w-4xl">
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <img v-if="selectedImage" :src="selectedImage.image" :alt="selectedImage.title" class="w-full rounded-lg" />
          <h3 v-if="selectedImage?.title" class="font-bold text-lg mt-4">{{ selectedImage.title }}</h3>
          <p v-if="selectedImage?.description" class="py-4">{{ selectedImage.description }}</p>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  block: {
    type: Object,
    required: true
  }
})

const modal = ref(null)
const selectedImage = ref(null)

const openModal = (element) => {
  selectedImage.value = element
  modal.value?.showModal()
}
</script>