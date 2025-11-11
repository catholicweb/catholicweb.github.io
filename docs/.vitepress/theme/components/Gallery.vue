<template>
  <div v-if="block.title" class="text-center">
    <h2 class="mt-6 text-4xl font-bold">{{ block.title }}</h2>
  </div>
  <div class="pb-8 pt-12 container mx-auto px-4">
    <!-- 1. Card Full - Image with Overlay (YouTube style) -->
    <div v-if="block.type === 'card-full'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="(item, i) in block.elements" :key="i" @click="handleClick(item)" class="relative h-64 rounded-lg overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-all">
        <img :src="item.image" :alt="item.title" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
          <div class="absolute bottom-0 left-0 right-0 p-6">
            <h3 class="text-xl font-bold text-white mb-2">{{ item.title }}</h3>
            <p class="text-white/90 text-sm mb-3">{{ item.description }}</p>
            <button v-if="item.callToAction" class="bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-semibold">
              {{ item.callToAction }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Image Gallery (Pinterest/Instagram style) -->
    <div v-if="block.type === 'gallery'" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="(item, i) in block.elements" :key="i" @click="handleClick(item)" class="relative aspect-square rounded-lg overflow-hidden group cursor-pointer">
        <img :src="item.image" :alt="item.title" class="w-full h-full object-cover transition-transform group-hover:scale-110" />
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all">
          <div class="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
            <h3 class="text-white font-bold text-lg mb-1">{{ item.title }}</h3>
            <button v-if="item.callToAction" class="text-white text-sm underline text-left">
              {{ item.callToAction }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Book/Resource List -->
    <div v-if="block.type === 'resource-list'" class="space-y-4">
      <div v-for="(item, i) in block.elements" :key="i" @click="handleClick(item)" class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 flex gap-4 cursor-pointer">
        <img :src="item.image" :alt="item.title" class="w-24 h-32 object-cover rounded shadow-sm flex-shrink-0" />
        <div class="flex-1 flex flex-col">
          <h3 class="text-lg font-bold text-gray-900 mb-1">{{ item.title }}</h3>
          <p class="text-gray-600 text-sm mb-3 flex-1">{{ item.description }}</p>
          <button v-if="item.callToAction" class="bg-accent text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm self-start">
            {{ item.callToAction }}
          </button>
        </div>
      </div>
    </div>

    <!-- 4. Video Grid (YouTube Channel style) -->
    <div v-if="block.type === 'video-grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="(item, i) in block.elements" :key="i" @click="handleClick(item)" class="group cursor-pointer">
        <div class="relative aspect-video rounded-lg overflow-hidden mb-3 bg-gray-200 facade youtube">
          <img :src="item.image" :alt="item.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        </div>
        <h3 class="font-semibold text-gray-900 mb-1">{{ item.title }}</h3>
        <p class="text-sm text-gray-600 mb-2">{{ item.description }}</p>
        <button v-if="item.callToAction" class="text-accent hover:opacity-80 text-sm font-medium">
          {{ item.callToAction }}
        </button>
      </div>
    </div>

    <!-- 5. Hero Banner (Featured content) -->
    <div v-if="block.type === 'hero-banner'" class="space-y-6">
      <div v-for="(item, i) in block.elements" :key="i" @click="handleClick(item)" class="relative h-96 rounded-2xl overflow-hidden shadow-2xl group cursor-pointer">
        <img :src="item.image" :alt="item.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent">
          <div class="absolute inset-0 p-8 md:p-12 flex flex-col justify-center max-w-2xl">
            <h2 class="text-3xl md:text-5xl font-bold text-white mb-4">{{ item.title }}</h2>
            <p class="text-lg text-white/90 mb-6">{{ item.description }}</p>
            <button v-if="item.callToAction" class="bg-white text-gray-900 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold self-start">
              {{ item.callToAction }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 6. Portfolio Grid (Designer/Creative work) -->
    <div v-if="block.type === 'portfolio'" class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div v-for="(item, i) in block.elements" :key="i" @click="handleClick(item)" class="group cursor-pointer">
        <div class="relative aspect-[4/3] rounded-lg overflow-hidden mb-4 bg-gray-100">
          <img :src="item.image" :alt="item.title" class="w-full h-full object-cover transition-all group-hover:scale-105 group-hover:brightness-75" />
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ item.title }}</h3>
        <p class="text-gray-600 mb-4">{{ item.description }}</p>
        <button v-if="item.callToAction" class="text-accent hover:opacity-80 font-semibold flex items-center gap-2">
          {{ item.callToAction }}
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 7. Product Cards (E-commerce style) -->
    <div v-if="block.type === 'product-cards'" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="(item, i) in block.elements" :key="i" @click="handleClick(item)" class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow group cursor-pointer">
        <div class="aspect-square bg-gray-100 overflow-hidden">
          <img :src="item.image" :alt="item.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform" />
        </div>
        <div class="p-4">
          <h3 class="font-semibold text-gray-900 mb-1 line-clamp-1">{{ item.title }}</h3>
          <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ item.description }}</p>
          <button v-if="item.callToAction" class="w-full bg-accent text-white py-2 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">
            {{ item.callToAction }}
          </button>
        </div>
      </div>
    </div>

    <!-- 8. Article/Blog List -->
    <div v-if="block.type === 'article-list'" class="max-w-4xl mx-auto space-y-8">
      <article v-for="(item, i) in block.elements" :key="i" @click="handleClick(item)" class="flex flex-col md:flex-row gap-6 pb-8 border-b border-gray-200 last:border-0 hover:bg-gray-50 p-4 rounded-lg transition-colors cursor-pointer">
        <img :src="item.image" :alt="item.title" class="w-full md:w-64 h-48 object-cover rounded-lg shadow-md flex-shrink-0" />
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-gray-900 mb-3 hover:text-accent transition-colors">
            {{ item.title }}
          </h2>
          <p class="text-gray-600 mb-4 leading-relaxed">{{ item.description }}</p>
          <button v-if="item.callToAction" class="text-accent hover:opacity-80 font-semibold">{{ item.callToAction }} →</button>
        </div>
      </article>
    </div>

    <!-- 9. Team Members/People Cards -->
    <div v-if="block.type === 'team-cards'" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
      <div v-for="(item, i) in block.elements" :key="i" @click="handleClick(item)" class="text-center group cursor-pointer">
        <div class="relative mb-4 inline-block">
          <img :src="item.image" :alt="item.title" class="w-40 h-40 rounded-full object-cover border-4 border-accent shadow-lg group-hover:scale-105 transition-transform" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-1">{{ item.title }}</h3>
        <p class="text-sm text-gray-600 mb-4">{{ item.description }}</p>
        <button v-if="item.callToAction" class="text-accent hover:opacity-80 font-medium text-sm">
          {{ item.callToAction }}
        </button>
      </div>
    </div>

    <!-- 10. Compact List (News/Feed style) -->
    <div v-if="block.type === 'compact-list'" class="max-w-3xl mx-auto bg-white rounded-lg shadow-md divide-y">
      <div v-for="(item, i) in block.elements" :key="i" @click="handleClick(item)" class="p-4 flex gap-4 hover:bg-gray-50 transition-colors cursor-pointer">
        <img :src="item.image" :alt="item.title" class="w-20 h-20 object-cover rounded flex-shrink-0" />
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-gray-900 mb-1 truncate">{{ item.title }}</h3>
          <p class="text-sm text-gray-600 line-clamp-2 mb-2">{{ item.description }}</p>
          <button v-if="item.callToAction" class="text-accent hover:opacity-80 text-xs font-medium">{{ item.callToAction }} →</button>
        </div>
      </div>
    </div>

    <!-- 11. HTML text -->
    <div v-if="block.type === 'text'">
      <div v-if="block.html" class="prose mb-12 max-w-2xl mx-auto" v-html="block.html"></div>
    </div>

    <!-- 12. Vertical Timeline -->
    <div v-if="block.type === 'timeline'" class="max-w-3xl mx-auto">
      <div v-for="(item, i) in block.elements" :key="i" @click="handleClick(item)" class="relative pl-8 pb-12 last:pb-0 cursor-pointer">
        <div class="absolute left-0 top-0 w-4 h-4 bg-accent rounded-full border-4 border-white shadow"></div>
        <div v-if="i < block.elements.length - 1" class="absolute left-2 top-4 bottom-0 w-0.5 bg-gray-300 -translate-x-1/2"></div>
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div v-if="item.date" class="text-sm font-semibold text-accent mb-2">{{ item.date }}</div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ item.title }}</h3>
          <p class="text-gray-600 mb-4">{{ item.description }}</p>
          <img v-if="item.image" :src="item.image" :alt="item.title" class="w-full h-48 object-cover rounded-lg mb-3" />
          <button v-if="item.callToAction" class="text-accent hover:opacity-80 font-medium text-sm">{{ item.callToAction }} →</button>
        </div>
      </div>
    </div>

    <!-- 13. Calendar/Event Cards with Big Date -->
    <div v-if="block.type === 'calendar-cards'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="(item, i) in block.elements" :key="i" @click="handleClick(item)" class="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden group cursor-pointer">
        <div class="flex">
          <div class="bg-accent text-white p-4 flex flex-col items-center justify-center min-w-[100px]">
            <div class="text-3xl font-bold">{{ item.day || "15" }}</div>
            <div class="text-sm uppercase tracking-wide">{{ item.month || "Jan" }}</div>
            <div v-if="item.year" class="text-xs opacity-80 mt-1">{{ item.year }}</div>
          </div>
          <div class="flex-1 p-4">
            <h3 class="font-bold text-gray-900 mb-2 group-hover:text-accent transition-colors">{{ item.title }}</h3>
            <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ item.description }}</p>
            <button v-if="item.callToAction" class="text-accent hover:opacity-80 text-sm font-medium">
              {{ item.callToAction }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 14. Horizontal Carousel -->
    <div v-if="block.type === 'carousel'" class="relative">
      <div class="overflow-x-auto scrollbar-hide snap-x snap-mandatory">
        <div class="flex gap-6 pb-4">
          <div v-for="(item, i) in block.elements" :key="i" @click="handleClick(item)" class="flex-shrink-0 w-80 snap-start">
            <div class="bg-white rounded-lg shadow-lg overflow-hidden group cursor-pointer h-full">
              <div class="aspect-video bg-gray-200 overflow-hidden">
                <img :src="item.image" :alt="item.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              </div>
              <div class="p-6">
                <h3 class="text-xl font-bold text-gray-900 mb-2">{{ item.title }}</h3>
                <p class="text-gray-600 mb-4 line-clamp-3">{{ item.description }}</p>
                <button v-if="item.callToAction" class="bg-accent text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium">
                  {{ item.callToAction }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 15. Accordion (FAQ) -->
    <div v-if="block.type === 'accordion'" class="max-w-3xl mx-auto space-y-4">
      <div v-for="(item, i) in block.elements" :key="i" class="bg-white rounded-lg shadow-md overflow-hidden">
        <button @click="toggleAccordion(i)" class="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors">
          <h3 class="font-bold text-gray-900 pr-4">{{ item.title }}</h3>
          <svg class="w-5 h-5 text-accent transition-transform flex-shrink-0" :class="{ 'rotate-180': accordionOpen[i] }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div v-show="accordionOpen[i]" class="px-6 pb-4 text-gray-600">
          <p>{{ item.description }}</p>
          <button v-if="item.callToAction" @click="handleClick(item)" class="mt-4 text-accent hover:opacity-80 font-medium text-sm">{{ item.callToAction }} →</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  block: {
    type: Object,
    required: true,
  },
});

// Accordion state management
const accordionOpen = ref({});

const toggleAccordion = (index) => {
  accordionOpen.value[index] = !accordionOpen.value[index];
};

// Handle clicks with optional links
const handleClick = (item) => {
  if (item.link) {
    window.location.href = item.link;
  }
};
</script>

<style scoped>
.facade.youtube {
  background-image: url("data:image/svg+xml,%3Csvg width='159' height='110' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m154 17.5c-1.82-6.73-7.07-12-13.8-13.8-9.04-3.49-96.6-5.2-122 0.1-6.73 1.82-12 7.07-13.8 13.8-4.08 17.9-4.39 56.6 0.1 74.9 1.82 6.73 7.07 12 13.8 13.8 17.9 4.12 103 4.7 122 0 6.73-1.82 12-7.07 13.8-13.8 4.35-19.5 4.66-55.8-0.1-75z' fill='%23f00'/%3E%3Cpath d='m105 55-40.8-23.4v46.8z' fill='%23fff'/%3E%3C/svg%3E%0A");
  background-size: 22%;
  background-position: center;
  background-repeat: no-repeat;
}

/* Line clamping utility */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Hide scrollbar but keep functionality */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
