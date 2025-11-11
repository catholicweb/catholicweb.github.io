<template>
	<div class="max-w-3xl mx-auto p-6">
		<h1 class="text-2xl font-bold text-center mb-6">
			{{ readings?.day_title || "Lecturas del día" }}
		</h1>

		<template v-for="(reading, key) in displayedReadings" :key="key">
			<h2 class="text-lg font-semibold mb-1">{{ reading.title }}</h2>
			<p class="text-sm text-gray-500 mb-3 italic">{{ reading.cita }} — {{ reading.resum }}</p>
			<div class="prose max-w-none" v-html="reading.text"></div>
		</template>
	</div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
	block: {
		type: Object,
		required: true,
	},
});

// los datos ya vienen desde fuera (pre-fechados)
const readings = ref(props.block.gospel || props.block);

// función auxiliar para recargar lecturas de otro día si se desea
async function getReading(diff = 0) {
	const d = new Date();
	d.setDate(d.getDate() + diff);
	const dateStr = d.toISOString().split("T")[0];

	try {
		const res = await fetch(`https://gxvchjojub.execute-api.eu-west-1.amazonaws.com/production/getmissafreecontent?lang=es&day=${dateStr}`);
		const data = await res.json();
		readings.value = data;
	} catch (err) {
		console.error("❌ Error al cargar las lecturas:", err);
	}
}

const displayedReadings = computed(() => {
	if (!readings.value) return [];
	if (props.block.readings) {
		return [readings.value["lectura#0"], readings.value["salm"], readings.value["lectura#1"], readings.value["evangeli"]].filter(Boolean);
	} else {
		return [readings.value["evangeli"]].filter(Boolean);
	}
});
</script>

<style scoped>
.prose p {
	margin-bottom: 0.5rem;
}
.prose strong {
	color: #b30838;
}
</style>
