<template>
  <div v-if="block.title" class="text-center">
    <h2 class="mt-8 text-4xl font-bold">{{ block.title }}</h2>
  </div>
  <div class="map py-8 md:container mx-auto md:px-4">
    <div class="w-full h-96 overflow-hidden md:shadow-md">
      <div ref="mapContainer" class="w-full h-full z-0"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  block: { type: Object, required: true },
});

const mapContainer = ref(null);
let map = null;
let markersLayer = null;

onMounted(async () => {
  if (!mapContainer.value) return;

  // Carga dinámica de Leaflet solo cuando el componente se monta
  const L = await import("leaflet");
  await import("leaflet/dist/leaflet.css"); // carga el CSS dinámicamente

  map = L.map(mapContainer.value).setView(props.block.center?.split(",").map((s) => Number(s.trim())) || [0, 0], props.block.zoom || 13);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    attribution: "Voyager",
    maxZoom: 16,
  }).addTo(map);

  markersLayer = L.layerGroup().addTo(map);

  props.block.markers?.forEach((m) => {
    const g = m.geo.split(",").map((s) => Number(s.trim()));
    L.marker(g)
      .addTo(markersLayer)
      .bindPopup(m.title || "");
  });
});
</script>

<style scoped>
/* para que los iconos de leaflet se vean correctamente en Vite */
.leaflet-container {
  width: 100%;
  height: 100%;
}
</style>
