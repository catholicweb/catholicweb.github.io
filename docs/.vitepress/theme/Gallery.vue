<!-- .vitepress/theme/blocks/GalleryBlock.vue -->
<template>
  <section class="py-16">
    <div class="container mx-auto px-4">
      <h2 v-if="block.title" class="text-4xl font-bold text-center mb-4">{{ block.title }}</h2>
      <p v-if="block.description" class="text-center text-lg mb-12 max-w-2xl mx-auto">{{ block.description }}</p>
      
      <!-- Masonry Grid Gallery -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="(element, idx) in block.elements" 
          :key="idx"
          no="cursor-pointer hover:shadow-2xl"
          class="card" :class="block.type != 'features'? 'image-full ' : ''"
          @click="openModal(element)"
        >
          <figure>
            <img class="object-cover" :class="block.type == 'features'?'aspect-[1/1] mt-6 w-1/2 rounded-full':'aspect-[16/9]'" 
              :src="element.image" 
              :alt="element.title || element.description || `Gallery item ${idx + 1}`"
            />
          </figure>
          <div v-if="element.title || element.description" class="card-body" :class="block.type != 'features'? '':'items-center text-center'">
            <h3 v-if="element.title" class="card-title">{{ element.title }}</h3>
            <p v-if="element.description">{{ element.description }}</p>
            <div v-if="element.action" class="card-actions">
              <button class="btn btn-primary">Buy Now</button>
              </div>
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

let options = 'full'
</script>

<style>
.hero-overlay {
   background: radial-gradient(closest-side, rgba(0,0,0,.5) 0,rgba(0,0,0,0) 100%) !important;
}
.image-full:before {
  background: linear-gradient(to bottom, rgba(0,0,0,.5) 0,rgba(0,0,0,0) 100%) !important;
}
.image-full, .hero {
    text-shadow: 0px 0px 2px rgba(0,0,0,1);
    font-weight: bolder;
}

.image-full * {
  color: white;
}


  
</style>