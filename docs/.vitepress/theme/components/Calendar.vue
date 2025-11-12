<script setup>
import { ref, onMounted } from "vue";
import { data } from "./../../calendar.data.js";

function time(str) {
  return str?.split("T")[1];
}
function date(str) {
  return str?.split("T")[0];
}
</script>

<template>
  <div class="max-w-3xl mx-auto p-6">
    <!-- Recurrent Events Table -->
    <div>
      <h2 class="text-xl font-semibold mb-2">Recurrent Events</h2>
      <table class="min-w-full border border-gray-200 text-left">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 border">Time</th>
            <th class="px-4 py-2 border">Location</th>
            <th class="px-4 py-2 border">Event</th>
            <th class="px-4 py-2 border">Recurrence</th>
            <th class="px-4 py-2 border">Exceptions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in data.recurrentEvents" :key="e.start" class="border-t">
            <td class="px-4 py-2 border">{{ time(e.start) }}</td>
            <td class="px-4 py-2 border">{{ e.location }}</td>
            <td class="px-4 py-2 border">{{ e.summary }}</td>
            <td class="px-4 py-2 border">{{ e.recurrence }}</td>
            <td class="px-4 py-2 border">
              <span v-for="d in e.exceptions" :key="d" class="text-red-600">{{ new Date(d).toLocaleDateString() }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- One-Off Events Schedule -->
    <div>
      <h2 class="text-xl font-semibold mb-2">Schedule</h2>
      <div class="space-y-4">
        <div v-for="e in data.oneOffEvents" :key="e.start" class="p-4 border rounded-md shadow-sm">
          <strong>{{ e.summary }}</strong
          ><br />
          {{ date(e.start) }} - {{ time(e.start) }}<br />
          {{ e.location }}
        </div>
      </div>
    </div>
  </div>
</template>
