<!-- .vitepress/theme/blocks/HeroBlock.vue -->
<template>
  <div v-if="block.image" class="hero min-h-[50vh]" :style="heroBgStyle(block.image)">
    <div class="hero-overlay"></div>
    <div class="hero-content text-white text-center">
      <div class="max-w-md">
        <h1 v-if="block.title" class="mb-5 text-5xl font-bold">
          {{ block.title }}
        </h1>
        <p v-if="block.subtitle" class="mb-5">{{ block.subtitle }}</p>
        <div class="flex flex-wrap gap-4 justify-center">
          <a v-for="(elem, idx) in block.elements" :key="idx" :href="elem.link" class="btn btn-primary">
            {{ elem.title }}
          </a>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="container mx-auto px-4 pt-16">
    <h2 v-if="block.title" class="text-4xl font-bold text-center mb-4">{{ block.title }}</h2>
  </div>
  <div class="container mx-auto px-4 py-16">
    <div v-if="block.body" class="prose text-lg mb-12 max-w-2xl mx-auto" v-html="block.bodyHtml"></div>
  </div>
</template>

<script setup>
function heroBgStyle(imageUrl) {
  const src720 = imageUrl.replace("480", "720");
  const src1080 = imageUrl.replace("480", "1080");

  return {
    backgroundImage: `image-set(
      url('${imageUrl}') 1x,
      url('${src720}') 2x,
      url('${src1080}') 3x
    )`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

// --- Effects lists ---
const scrollEffects = {
  fadeInUp: "opacity-0 translate-y-6 transition-all",
  fadeInDown: "opacity-0 -translate-y-6",
  fadeInLeft: "opacity-0 -translate-x-6",
  fadeInRight: "opacity-0 translate-x-6",
  popIn: "opacity-0 scale-75 transition-all duration-500",
  popOut: "opacity-0 scale-125 transition-all duration-500",
  zoomIn: "opacity-0 scale-50",
  zoomOut: "opacity-0 scale-150",
  tiltLeft: "opacity-0 rotate-6",
  tiltRight: "opacity-0 -rotate-6",
  slideInLeft: "opacity-0 -translate-x-full",
  slideInRight: "opacity-0 translate-x-full",
  slideInUp: "opacity-0 translate-y-full",
  slideInDown: "opacity-0 -translate-y-full",
  spinIn: "opacity-0 rotate-180",
  bounceIn: "opacity-0 scale-90",
  shadowPop: "opacity-0 scale-95 shadow-lg transition-all duration-500",
  blurIn: "opacity-0 blur-sm",
  fadeInScaleRotate: "opacity-0 scale-75 rotate-12",
  flipInX: "opacity-0 rotate-x-180",
  flipInY: "opacity-0 rotate-y-180",
  jiggle: "opacity-0 translate-x-[-5px] translate-y-[5px] transition-all duration-500 ease-in-out",
  sway: "opacity-0 translate-x-2 ease-in-out",
  rise: "opacity-0 translate-y-10",
  fall: "opacity-0 -translate-y-10",
  spinBounce: "opacity-0 rotate-45 scale-90",
  floatUp: "opacity-0 translate-y-8 transition-all duration-900",
  floatDown: "opacity-0 -translate-y-8 transition-all duration-900",
  swing: "opacity-0 rotate-3 ease-in-out",
  tiltForward: "opacity-0 rotate-x-6",
  tiltBack: "opacity-0 -rotate-x-6",
  zoomRotate: "opacity-0 scale-50 rotate-12",
  popTilt: "opacity-0 scale-75 rotate-3",
  fadeSlide: "opacity-0 translate-y-6 transition-all duration-900",
  fadeSpin: "opacity-0 rotate-90",
  scaleUp: "opacity-0 scale-25",
  scaleDown: "opacity-0 scale-125",
  slideFadeLeft: "opacity-0 -translate-x-10",
  slideFadeRight: "opacity-0 translate-x-10",
  floatTilt: "opacity-0 translate-y-6 rotate-3 transition-all",
  bounceTilt: "opacity-0 scale-90 rotate-2",
  fadeTilt: "opacity-0 rotate-4",
  swingTilt: "opacity-0 rotate-3 translate-x-2",
  rollIn: "opacity-0 -translate-x-full rotate-45",
  rollOut: "opacity-0 translate-x-full rotate-45",
  flyIn: "opacity-0 translate-y-20 transition-all duration-900",
  flyOut: "opacity-0 -translate-y-20 transition-all duration-900",
  popSpin: "opacity-0 scale-80 rotate-12",
  tiltPop: "opacity-0 scale-90 rotate-6",
  fadeInGlow: "opacity-0",
};

// =========================
// 2️⃣ Hover/focus-triggered effects
const hoverEffects = {
  hoverPop: "hover:scale-105 hover:shadow-lg focus:scale-105 focus:shadow-lg",
  hoverTilt: "hover:-rotate-6 hover:scale-105 focus:-rotate-6 focus:scale-105",
  hoverGlow: "hover:shadow-xl hover:ring-2 hover:ring-indigo-400 focus:shadow-xl focus:ring-2 focus:ring-indigo-400",
  hoverBounce: "hover:translate-y-[-4px] hover:scale-105 focus:translate-y-[-4px] focus:scale-105",
  hoverFloat: "hover:-translate-y-2 hover:shadow-md focus:-translate-y-2 focus:shadow-md",
  hoverRotate: "hover:rotate-6 hover:scale-105 focus:rotate-6 focus:scale-105",
  hoverTiltForward: "hover:rotate-x-6 hover:scale-105 focus:rotate-x-6 focus:scale-105",
  hoverTiltBack: "hover:-rotate-x-6 hover:scale-105 focus:-rotate-x-6 focus:scale-105",
  hoverSpin: "hover:rotate-12 hover:scale-105 focus:rotate-12 focus:scale-105",
  hoverShadowPop: "hover:shadow-2xl hover:scale-105 focus:shadow-2xl focus:scale-105",
  hoverGlowTilt: "hover:shadow-lg hover:rotate-3 focus:shadow-lg focus:rotate-3",
  hoverPopSpin: "hover:scale-110 hover:rotate-6 focus:scale-110 focus:rotate-6",
  hoverFloatTilt: "hover:-translate-y-2 hover:rotate-3 focus:-translate-y-2 focus:rotate-3",
  hoverJiggle: "hover:translate-x-1 hover:rotate-1 focus:translate-x-1 focus:rotate-1",
  hoverSway: "hover:translate-x-2 hover:rotate-2 focus:translate-x-2 focus:rotate-2",
  hoverBounceTilt: "hover:translate-y-[-2px] hover:scale-105 hover:rotate-2 focus:translate-y-[-2px] focus:scale-105 focus:rotate-2",
  hoverFloatSpin: "hover:-translate-y-2 hover:rotate-6 focus:-translate-y-2 focus:rotate-6",
  hoverGlowBounce: "hover:shadow-xl hover:translate-y-[-2px] focus:shadow-xl focus:translate-y-[-2px]",
  hoverScaleUp: "hover:scale-110 focus:scale-110",
  hoverScaleDown: "hover:scale-95 focus:scale-95",
  hoverSlideLeft: "hover:-translate-x-2 focus:-translate-x-2",
  hoverSlideRight: "hover:translate-x-2 focus:translate-x-2",
  hoverSlideUp: "hover:-translate-y-2 focus:-translate-y-2",
  hoverSlideDown: "hover:translate-y-2 focus:translate-y-2",
  hoverRoll: "hover:rotate-6 focus:rotate-6",
  hoverFly: "hover:-translate-y-2 hover:scale-105 focus:-translate-y-2 focus:scale-105",
  hoverPopGlow: "hover:scale-110 hover:shadow-indigo-400 focus:scale-110 focus:shadow-indigo-400",
  hoverTiltPop: "hover:rotate-3 hover:scale-105 focus:rotate-3 focus:scale-105",
  hoverSpinGlow: "hover:rotate-12 hover:shadow-lg focus:rotate-12 focus:shadow-lg",
  hoverSwing: "hover:rotate-3 hover:translate-x-2 focus:rotate-3 focus:translate-x-2",
  hoverTiltForwardPop: "hover:rotate-x-6 hover:scale-105 focus:rotate-x-6 focus:scale-105",
  hoverTiltBackPop: "hover:-rotate-x-6 hover:scale-105 focus:-rotate-x-6 focus:scale-105",
  hoverSpinPop: "hover:rotate-12 hover:scale-110 focus:rotate-12 focus:scale-110",
  hoverFloatPop: "hover:-translate-y-2 hover:scale-105 focus:-translate-y-2 focus:scale-105",
  hoverGlowTiltPop: "hover:shadow-lg hover:rotate-3 hover:scale-105 focus:shadow-lg focus:rotate-3 focus:scale-105",
  hoverPopTiltSpin: "hover:scale-110 hover:rotate-6 hover:shadow-lg focus:scale-110 focus:rotate-6 focus:shadow-lg",
  hoverBounceSpin: "hover:translate-y-[-2px] hover:rotate-6 focus:translate-y-[-2px] focus:rotate-6",
  hoverFloatTiltSpin: "hover:-translate-y-2 hover:rotate-3 hover:scale-105 focus:-translate-y-2 focus:rotate-3 focus:scale-105",
};

import { onMounted, ref } from "vue";

onMounted(() => {
  runEffects();
});

// --- Function to apply effects ---
function applyEffectsByType(selectorList) {
  Object.entries(selectorList).forEach(([selector, effectName]) => {
    const elements = document.querySelectorAll(selector);
    console.log(elements, effectName);
    elements.forEach((el) => {
      if (scrollEffects[effectName]) {
        let effect = scrollEffects[effectName];
        el.classList.add(...effect.split(" "));
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              el.classList.remove(...effect.split(" "));
              el.classList.add("opacity-100", "translate-y-0", "scale-100", "rotate-0", "transition-all", "duration-900", "easy-out");
              observer.unobserve(el);
            }
          },
          { threshold: 0.4, rootMargin: "0px 0px -150px 0px" },
        );
        observer.observe(el);
      } else if (hoverEffects[effectName]) {
        const effect = hoverEffects[effectName];
        console.log(el, effect);
        el.classList.add(...effect.split(" "));
      }
    });
  });
}

// --- Function to run effects on page ---
const runEffects = () => {
  applyEffectsByType({
    "li, ul, blockquote": "bounceIn",
    blockquote: "hoverTilt",
  });
};

defineProps({
  block: {
    type: Object,
    required: true,
  },
});
</script>
