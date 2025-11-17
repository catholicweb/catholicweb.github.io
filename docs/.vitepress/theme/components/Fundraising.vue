<script setup>
import { ref, computed } from "vue";
import { data } from "./../../blocks.data.js";

const props = defineProps({
  block: {
    type: Object,
    required: true,
  },
});

const cards = data.fundraisings;

const currentIndex = ref(cards.findIndex((item) => item.name === props.block.name) || 0);

let touchStartX = 0;

const nextCard = () => {
  if (currentIndex.value < cards.length - 1) {
    currentIndex.value++;
  }
};

const prevCard = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

const goToCard = (index) => {
  currentIndex.value = index;
};

const handleTouchStart = (e) => {
  touchStartX = e.touches[0].clientX;
};

const handleTouchEnd = (e) => {
  const touchEndX = e.changedTouches[0].clientX;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > 50) {
    diff > 0 ? nextCard() : prevCard();
  }
};

// Computed property to get position relative to center
const getPosition = (index) => index - currentIndex.value;
</script>

<template>
  <div class="text-center">
    <h2 class="text-4xl font-bold">{{ block.title }}</h2>
  </div>
  <div class="flex flex-col items-center justify-center p-4 my-2">
    <!-- 3D Carousel Container -->
    <div class="relative w-full mt-2 max-w-6xl h-[500px] flex items-center justify-center">
      <!-- Cards -->
      <div class="relative w-full h-full" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
        <div v-for="(card, index) in cards" :key="card.id" :data-pos="getPosition(index)" class="card-3d w-80 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" @click="goToCard(index)">
          <div class="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
            <!-- Image Section -->
            <div class="relative aspect-video overflow-hidden">
              <div class="absolute inset-0 flex items-center justify-center">
                <img :src="card.image" :alt="card.name" class="w-full h-full object-cover" />
              </div>
            </div>

            <!-- Content Section -->
            <div class="p-6">
              <h2 class="text-2xl font-bold text-slate-900 mb-2">{{ card.name }}</h2>
              <p class="text-slate-600 mb-6">{{ card.description }}</p>

              <!-- Progress Stats -->
              <div class="mb-4">
                <div class="flex justify-between items-baseline mb-2">
                  <span class="text-3xl font-bold text-slate-900">{{ card.raised }}€</span>
                  <span class="text-slate-500 text-sm">de {{ card.goal }}€</span>
                </div>

                <!-- Progress Bar -->
                <div class="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-gray-200 to-accent rounded-full transition-all duration-500 ease-out" :style="{ width: `${Math.min(card.progress, 100)}%` }"></div>
                </div>

                <div class="text-sm text-slate-600 mt-2">{{ card.progress }}% financiado</div>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-3">
                <button class="flex-1 bg-accent text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200">Donar</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Arrows -->
      <button v-if="cards.length > 1" @click="prevCard" :disabled="currentIndex === 0" :class="['flex absolute left-4 top-1/2 -translate-y-1/2 z-50 w-14 h-14 rounded-full bg-black/30 backdrop-blur-md text-white items-center justify-center transition-all duration-200 hover:bg-black/50 hover:scale-110 cursor-pointer hidden md:flex', currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100']">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button v-if="cards.length > 1" @click="nextCard" :disabled="currentIndex === cards.length - 1" :class="['flex absolute right-4 top-1/2 -translate-y-1/2 z-50 w-14 h-14 rounded-full bg-black/30 backdrop-blur-md text-white items-center justify-center transition-all duration-200 hover:bg-black/50 hover:scale-110 cursor-pointer hidden md:flex', currentIndex === cards.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-100']">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  </div>

  <!-- Dot Indicators -->
  <div v-if="cards.length > 1" class="flex items-center justify-center gap-3 mb-8 mt-2">
    <button v-for="(card, index) in cards" :key="card.id" @click="goToCard(index)" :class="['w-3 h-3 rounded-full transition-all duration-300', currentIndex === index ? 'bg-black w-8' : 'bg-black/30 hover:bg-black/50']" />
  </div>
</template>

<style scoped>
.card-3d {
  position: absolute;
  transform-style: preserve-3d;
  transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

/* Center card */
.card-3d[data-pos="0"] {
  transform: translateX(0%) scale(1) translateZ(0);
  opacity: 1;
  z-index: 30;
  filter: grayscale(0%);
}

/* Left adjacent */
.card-3d[data-pos="-1"] {
  transform: translateX(-35%) scale(0.85) translateZ(-100px);
  opacity: 0.6;
  z-index: 20;
  filter: grayscale(80%);
}

/* Right adjacent */
.card-3d[data-pos="1"] {
  transform: translateX(35%) scale(0.85) translateZ(-100px);
  opacity: 0.6;
  z-index: 20;
  filter: grayscale(80%);
}

/* Left far */
.card-3d[data-pos="-2"] {
  transform: translateX(-60%) scale(0.7) translateZ(-200px);
  opacity: 0.3;
  z-index: 10;
  filter: grayscale(100%);
}

/* Right far */
.card-3d[data-pos="2"] {
  transform: translateX(60%) scale(0.7) translateZ(-200px);
  opacity: 0.3;
  z-index: 10;
  filter: grayscale(100%);
}

/* Hidden cards */
.card-3d[data-pos^="-"]:not([data-pos="-1"]):not([data-pos="-2"]),
.card-3d:not([data-pos="0"]):not([data-pos="1"]):not([data-pos="2"]):not([data-pos="-1"]):not([data-pos="-2"]) {
  transform: translateX(-50%) scale(0.6) translateZ(-300px);
  opacity: 0;
  z-index: 0;
  filter: grayscale(100%);
  pointer-events: none;
}
</style>
