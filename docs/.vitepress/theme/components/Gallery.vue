<!-- .vitepress/theme/blocks/GalleryBlock.vue -->
<template>
  <div class="py-4 container mx-auto px-4">
    <h2 v-if="block.title" class="text-4xl font-bold text-center mb-4">
      {{ block.title }}
    </h2>
    <p v-if="block.description" class="text-center text-lg mb-12 max-w-2xl mx-auto">
      {{ block.description }}
    </p>

    <!-- Masonry Grid Gallery -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <a
        v-for="(elem, idx) in block.elements"
        :key="idx"
        no="cursor-pointer hover:shadow-2xl"
        :class="{
          'image-full card rounded-lg': !is('feature'),
          card: is('feature'),
        }"
        :href="elem.link"
        @click="openModal(elem)"
      >
        <figure v-if="getImage(elem)">
          <img
            class="object-cover mx-auto"
            :class="{
              'aspect-[1/1] mt-6 w-1/2 rounded-full': is('feature'),
              'aspect-[16/9] rounded-md': !is('feature'),
            }"
            loading="lazy"
            :src="getImage(elem)"
            :alt="alt(elem, idx)"
          />
        </figure>
        <div
          v-if="elem.title || elem.description"
          :class="{
            'card-body': !is('feature'),
            'items-center text-center card-body': is('feature'),
          }"
        >
          <h3 v-if="elem.title" class="card-title text-accent text-xl">{{ elem.title }}</h3>
          <p v-if="elem.description">{{ elem.description }}</p>
          <div v-if="elem.action" class="card-actions">
            <button class="btn btn-primary">Buy Now</button>
          </div>
        </div>
      </a>
    </div>

    <!-- Modal for enlarged image -->
    <dialog ref="modal" class="modal">
      <div class="modal-box max-w-4xl p-0 aspect-[16/9]">
        <iframe allowfullscreen="true" allowtransparency="true" frameborder="0" allow="accelerometer; fullscreen; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" class="w-full aspect-[16/9]" v-if="getImage(selectedImage).includes('youtube')" :src="getImage(selectedImage, true)"></iframe>
        <img v-else :src="selectedImage.image" :alt="alt(selectedImage, ' modal')" class="w-full h-full object-cover object-center rounded-md" />
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
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

const modal = ref(null);
const selectedImage = ref("");

function is(prop) {
  return props.block._block.includes(prop);
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
