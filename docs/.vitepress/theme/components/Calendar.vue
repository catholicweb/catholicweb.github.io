<script setup>
import { ref, onMounted } from "vue";
import { data } from "./../../calendar.data.js";

function groupEvents(events, fields = ["freq", "day", "", "hour", "location"]) {
  if (fields.length === 0) return events;
  const field = fields[0];
  const grouped = events.reduce((acc, event) => {
    const key_array = [event[field]];
    for (var i = 0; i < key_array.length; i++) {
      let key = key_array[i] || "";
      if (!acc[key]) acc[key] = [];
      acc[key].push(event);
    }
    return acc;
  }, {});
  // Se aplica recursivamente con el resto de funciones
  Object.keys(grouped).forEach((key) => {
    grouped[key] = groupEvents(grouped[key], fields.slice(1));
  });
  return grouped;
  // Ordenamos las claves y creamos un nuevo objeto
  const sortedGrouped = {};
  Object.keys(grouped)
    .sort()
    .forEach((key) => {
      sortedGrouped[key] = grouped[key];
    });

  return sortedGrouped;
}

function slugify(str) {
  return str;
}

function tr(str) {
  return str;
}

function time(str) {
  return str;
  return str?.split("T")[1];
}
function date(str) {
  return str;
  return str?.split("T")[0];
}
function formatDate(d) {
  return d;
}
function groupedEvents(d) {
  return d;
}
function getSubKeys(table) {
  const keys = new Set();
  for (const row in table) {
    for (const subKey in table[row]) keys.add(subKey);
  }
  return Array.from(keys);
}
</script>

<template>
  {{ data.recurrentEvents }}
  <br />----<br />
  {{ groupEvents(data.recurrentEvents) }}
  <div class="max-w-3xl mx-auto p-6">
    <!-- Primer grupo -->
    <div v-for="(table, tableKey) in groupEvents(data.recurrentEvents)" style="margin-bottom: 20px" class="col-md-6 col-lg-4" :class="tableKey">
      <h3 :id="slugify(tableKey)" class="text-xl font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">
        {{ formatDate(tableKey).toLowerCase() }}
      </h3>

      <div class="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
        <table class="min-w-full divide-y divide-gray-200 text-sm text-gray-700">
          <thead v-if="getSubKeys(table)[0] != ' '" class="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th class="px-4 py-2 text-left w-36"></th>
              <th v-for="subKey in getSubKeys(table)" class="px-4 py-2 text-left font-medium">
                {{ tr(subKey) }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <!-- Segundo grupo -->
            <tr v-for="(row, rowKey) in table" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                {{ formatDate(rowKey) }}
              </td>
              <td v-for="subKey in getSubKeys(table)" class="px-4 py-3 align-top">
                <!-- Tercer grupo -->
                <p v-for="(line, lineKey) in row[subKey]" style="margin-right: 10px; display: flex" class="flex items-center gap-2 mb-1">
                  {{ tr(lineKey) }}
                  <span v-if="typeof line === 'object' && !Array.isArray(line)" class="flex flex-wrap gap-1 text-gray-500">
                    <i v-for="(item, index) in Object.keys(line)" :key="index" :class="{ 'line-through text-red-400': item.includes('Salbu') }"> ({{ tr(item) }}) </i>
                  </span>
                  <span v-if="Array.isArray(line) && line[0]?.notes" class="relative">
                    <span class="info-tag ml-1 text-blue-500 cursor-pointer hover:text-blue-700" @click="showTooltip($el)"> ⓘ </span>
                    <span class="tooltip absolute left-0 mt-1 bg-white border border-gray-200 rounded shadow text-xs text-gray-600 p-2 hidden" @click="$el.classList.remove('show')">
                      {{ tr(line[0].notes) }}
                    </span>
                  </span>
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

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
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in data.recurrentEvents" :key="e.start" class="border-t">
            <td class="px-4 py-2 border">{{ e.hour }} {{ e.day }}</td>
            <td class="px-4 py-2 border">{{ e.location }}</td>
            <td class="px-4 py-2 border">{{ e.summary }} {{ e.image }}</td>
            <td class="px-4 py-2 border">
              {{ e.recurrence }} <span v-for="d in e.exceptions" :key="d" class="text-red-600">{{ new Date(d).toLocaleDateString() }}</span>
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
          {{ e.location }} {{ e.image }}
        </div>
      </div>
    </div>
  </div>
</template>

<style>
h1:empty,
h3:empty,
td:empty,
th:empty,
tr:empty,
span:empty {
  display: none !important;
}
</style>
