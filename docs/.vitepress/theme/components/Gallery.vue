<template>
  <div class="pb-8 pt-12 container mx-auto px-4">
    <!-- 1. Card Full - Image with Overlay (YouTube style) -->
    <div v-if="variant === 'card-full'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="(item, i) in block.elements" :key="i" class="relative h-64 rounded-lg overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-all">
        <img :src="item.image" :alt="item.title" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
          <div class="absolute bottom-0 left-0 right-0 p-6">
            <h3 class="text-xl font-bold text-white mb-2">{{ item.title }}</h3>
            <p class="text-white/90 text-sm mb-3">{{ item.description }}</p>
            <button class="bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-semibold">
              {{ item.callToAction }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Image Gallery (Pinterest/Instagram style) -->
    <div v-if="variant === 'gallery'" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="(item, i) in block.elements" :key="i" class="relative aspect-square rounded-lg overflow-hidden group cursor-pointer">
        <img :src="item.image" :alt="item.title" class="w-full h-full object-cover transition-transform group-hover:scale-110" />
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all">
          <div class="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
            <h3 class="text-white font-bold text-lg mb-1">{{ item.title }}</h3>
            <button class="text-white text-sm underline text-left">
              {{ item.callToAction }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Book/Resource List -->
    <div v-if="variant === 'resource-list'" class="space-y-4">
      <div v-for="(item, i) in block.elements" :key="i" class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 flex gap-4">
        <img :src="item.image" :alt="item.title" class="w-24 h-32 object-cover rounded shadow-sm flex-shrink-0" />
        <div class="flex-1 flex flex-col">
          <h3 class="text-lg font-bold text-gray-900 mb-1">{{ item.title }}</h3>
          <p class="text-gray-600 text-sm mb-3 flex-1">{{ item.description }}</p>
          <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm self-start">
            {{ item.callToAction }}
          </button>
        </div>
      </div>
    </div>

    <!-- 4. Video Grid (YouTube Channel style) -->
    <div v-if="variant === 'video-grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="(item, i) in block.elements" :key="i" class="group cursor-pointer">
        <div class="relative aspect-video rounded-lg overflow-hidden mb-3 bg-gray-200">
          <img :src="item.image" :alt="item.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          <div class="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
            <div class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
        <h3 class="font-semibold text-gray-900 mb-1 line-clamp-2">{{ item.title }}</h3>
        <p class="text-sm text-gray-600 line-clamp-2 mb-2">{{ item.description }}</p>
        <button class="text-blue-600 hover:text-blue-700 text-sm font-medium">
          {{ item.callToAction }}
        </button>
      </div>
    </div>

    <!-- 5. Hero Banner (Featured content) -->
    <div v-if="variant === 'hero-banner'" class="space-y-6">
      <div v-for="(item, i) in block.elements" :key="i" class="relative h-96 rounded-2xl overflow-hidden shadow-2xl group cursor-pointer">
        <img :src="item.image" :alt="item.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent">
          <div class="absolute inset-0 p-8 md:p-12 flex flex-col justify-center max-w-2xl">
            <h2 class="text-3xl md:text-5xl font-bold text-white mb-4">{{ item.title }}</h2>
            <p class="text-lg text-white/90 mb-6">{{ item.description }}</p>
            <button class="bg-white text-gray-900 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold self-start">
              {{ item.callToAction }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 6. Portfolio Grid (Designer/Creative work) -->
    <div v-if="variant === 'portfolio'" class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div v-for="(item, i) in block.elements" :key="i" class="group cursor-pointer">
        <div class="relative aspect-[4/3] rounded-lg overflow-hidden mb-4 bg-gray-100">
          <img :src="item.image" :alt="item.title" class="w-full h-full object-cover transition-all group-hover:scale-105 group-hover:brightness-75" />
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ item.title }}</h3>
        <p class="text-gray-600 mb-4">{{ item.description }}</p>
        <button class="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2">
          {{ item.callToAction }}
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 7. Product Cards (E-commerce style) -->
    <div v-if="variant === 'product-cards'" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="(item, i) in block.elements" :key="i" class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
        <div class="aspect-square bg-gray-100 overflow-hidden">
          <img :src="item.image" :alt="item.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform" />
        </div>
        <div class="p-4">
          <h3 class="font-semibold text-gray-900 mb-1 line-clamp-1">{{ item.title }}</h3>
          <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ item.description }}</p>
          <button class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            {{ item.callToAction }}
          </button>
        </div>
      </div>
    </div>

    <!-- 8. Article/Blog List -->
    <div v-if="variant === 'article-list'" class="max-w-4xl mx-auto space-y-8">
      <article v-for="(item, i) in block.elements" :key="i" class="flex flex-col md:flex-row gap-6 pb-8 border-b border-gray-200 last:border-0 hover:bg-gray-50 p-4 rounded-lg transition-colors">
        <img :src="item.image" :alt="item.title" class="w-full md:w-64 h-48 object-cover rounded-lg shadow-md flex-shrink-0" />
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
            {{ item.title }}
          </h2>
          <p class="text-gray-600 mb-4 leading-relaxed">{{ item.description }}</p>
          <button class="text-blue-600 hover:text-blue-700 font-semibold">{{ item.callToAction }} →</button>
        </div>
      </article>
    </div>

    <!-- 9. Team Members/People Cards -->
    <div v-if="variant === 'team-cards'" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
      <a v-for="(item, i) in block.elements" :key="i" class="text-center group" :href="item.link">
        <div class="relative mb-4 inline-block">
          <img :src="item.image" :alt="item.title" class="w-40 h-40 rounded-full object-cover border-4 border-accent shadow-lg group-hover:scale-105 transition-transform" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-1">{{ item.title }}</h3>
        <p class="text-sm text-gray-600 mb-4">{{ item.description }}</p>
        <button class="text-blue-600 hover:text-blue-700 font-medium text-sm">
          {{ item.callToAction }}
        </button>
      </a>
    </div>

    <!-- 10. Compact List (News/Feed style) -->
    <div v-if="variant === 'compact-list'" class="max-w-3xl mx-auto bg-white rounded-lg shadow-md divide-y">
      <div v-for="(item, i) in block.elements" :key="i" class="p-4 flex gap-4 hover:bg-gray-50 transition-colors cursor-pointer">
        <img :src="item.image" :alt="item.title" class="w-20 h-20 object-cover rounded flex-shrink-0" />
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-gray-900 mb-1 truncate">{{ item.title }}</h3>
          <p class="text-sm text-gray-600 line-clamp-2 mb-2">{{ item.description }}</p>
          <button class="text-blue-600 hover:text-blue-700 text-xs font-medium">{{ item.callToAction }} →</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
</style>

<script setup>
import { ref } from "vue";

const props = defineProps({
  block: {
    type: Object,
    required: true,
  },
});

let variant = ref("");
variant = "team-cards";
const modal = ref(null);
const selectedImage = ref("");

function is(prop) {
  return props.variant.includes(prop);
}

const openModal = (elem) => {
  if (elem.link) return;
  selectedImage.value = elem;
  modal.value?.showModal();
};

function alt(elem, idx) {
  return elem.title || elem.description || `Gallery item ${idx + 1}`;
}

function getImage(elem, play) {
  try {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    const match = elem.link.match(regex);
    if (match && match[1]) {
      let videoId = match[1];
      if (play) return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      if (elem.image) return elem.image;
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
  } catch (e) {}

  // Not a valid YouTube video URL
  return elem?.image || "";
}
</script>

<style>
.hero-overlay {
  background: radial-gradient(closest-side, rgba(0, 0, 0, 0.4) 0, rgba(0, 0, 0, 0) 100%) !important;
}
.image-full {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0, rgba(0, 0, 0, 0) 100%) !important;
}
.image-full,
.hero {
  text-shadow: 0px 0px 8px rgba(0, 0, 0, 1);
  font-weight: bolder;
}

.image-full * {
  color: white;
}

.facade.youtube button {
  background-image: url("data:image/svg+xml,%3Csvg width='159' height='110' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m154 17.5c-1.82-6.73-7.07-12-13.8-13.8-9.04-3.49-96.6-5.2-122 0.1-6.73 1.82-12 7.07-13.8 13.8-4.08 17.9-4.39 56.6 0.1 74.9 1.82 6.73 7.07 12 13.8 13.8 17.9 4.12 103 4.7 122 0 6.73-1.82 12-7.07 13.8-13.8 4.35-19.5 4.66-55.8-0.1-75z' fill='%23f00'/%3E%3Cpath d='m105 55-40.8-23.4v46.8z' fill='%23fff'/%3E%3C/svg%3E%0A");
  background-size: 22%;
}
</style>
