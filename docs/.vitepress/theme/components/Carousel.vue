<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({
  block: {
    type: Object,
    required: true
  },
  interval: { type: Number, default: 4000 } // ms between slides
})

let current = ref(0)
let timer = null

onMounted(() => {
  timer = setInterval(() => {
    current.value = (current.value + 1) % props.block.elements.length
  }, props.interval)
})

onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div class="w-full text-center">
    <h2 class="text-2xl font-bold mb-1">{{ block.title }}</h2>
    <p class="text-gray-500 mb-4">{{ block.subtitle }}</p>

    <div class="relative w-full overflow-hidden max-h-[60vh]">
      <div class="carousel w-full">
        <div
          v-for="(item, i) in block.elements"
          :key="i"
          class="carousel-item relative w-full transition-all duration-700 ease-in-out"
          :class="{ 'opacity-100': current === i, 'opacity-0 absolute': current !== i }"
        >
          <img :src="item.image" class="w-full object-cover" alt="" />
          <div class="absolute bottom-0 bg-black/50 text-white p-4 w-full">
            <h3 class="text-lg font-semibold">{{ item.title }}</h3>
            <p class="text-sm">{{ item.description }}</p>
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="absolute flex justify-center w-full gap-2 bottom-2">
        <button
          v-for="(item, i) in block.elements"
          :key="'dot-' + i"
          class="btn btn-xs btn-circle"
          :class="{ 'btn-primary': current === i }"
          @click="current = i"
        ></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.carousel-item {
  min-width: 100%;
}
</style>
