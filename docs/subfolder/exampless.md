---
title: Examples
---
# Component Examples

## DaisyUI Components

### Buttons

<div class="flex gap-2 flex-wrap my-4">
  <button class="btn">Default</button>
  <button class="btn btn-primary">Primary</button>
  <button class="btn btn-secondary">Secondary</button>
  <button class="btn btn-accent">Accent</button>
  <button class="btn btn-ghost">Ghost</button>
  <button class="btn btn-link">Link</button>
</div>

### Cards

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">Card title!</h2>
      <p>If a dog chews shoes whose shoes does he choose?</p>
      <div class="card-actions justify-end">
        <button class="btn btn-primary">Buy Now</button>
      </div>
    </div>
  </div>
  
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">Another Card!</h2>
      <p>Some description here with more content</p>
      <div class="card-actions justify-end">
        <button class="btn btn-secondary">Action</button>
      </div>
    </div>
  </div>
</div>

### Alerts

<div class="alert alert-info my-4">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
  <span>Info alert!</span>
</div>

<div class="alert alert-success my-4">
  <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  <span>Success alert!</span>
</div>

<div class="alert alert-warning my-4">
  <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
  <span>Warning alert!</span>
</div>

<div class="alert alert-error my-4">
  <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  <span>Error alert!</span>
</div>

### Badges

<div class="flex gap-2 flex-wrap my-4">
  <div class="badge">default</div>
  <div class="badge badge-primary">primary</div>
  <div class="badge badge-secondary">secondary</div>
  <div class="badge badge-accent">accent</div>
  <div class="badge badge-ghost">ghost</div>
</div>

## Tailwind Utilities

<div class="prose max-w-none my-4">
  <h3 class="text-3xl font-bold text-blue-600">Styled with Tailwind</h3>
  <p class="text-gray-600">This paragraph uses Tailwind utility classes for styling.</p>
</div>

<div class="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white p-8 rounded-lg my-4">
  Beautiful gradient background with Tailwind!
</div>

<div class="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
  <div class="bg-red-200 p-4 rounded hover:bg-red-300 transition">Hover me</div>
  <div class="bg-blue-200 p-4 rounded hover:bg-blue-300 transition">Hover me</div>
  <div class="bg-green-200 p-4 rounded hover:bg-green-300 transition">Hover me</div>
  <div class="bg-yellow-200 p-4 rounded hover:bg-yellow-300 transition">Hover me</div>
</div>
