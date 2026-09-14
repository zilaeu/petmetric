<script setup lang="ts">
import type { IconName } from '~/composables/usePetMetricData'

defineProps<{ name: IconName; size?: number }>()
</script>

<template>
  <svg
    class="app-icon"
    :width="size || 24"
    :height="size || 24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="name === 'arrow' ? 2.5 : name === 'search' || name === 'external' ? 2 : 1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-if="name === 'search'"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></template>
    <template v-else-if="name === 'menu'"><path d="M4 7h16M4 12h16M4 17h16"/></template>
    <template v-else-if="name === 'close'"><path d="m6 6 12 12M18 6 6 18"/></template>
    <template v-else-if="name === 'arrow'"><path d="M5 12h14M12 5l7 7-7 7"/></template>
    <template v-else-if="name === 'external'"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14 21 3"/></template>
    <template v-else-if="name === 'check'"><path d="m5 12 4 4L19 6"/></template>
    <template v-else-if="name === 'shield'"><path d="M12 3 5 6v5c0 4.4 2.9 8.4 7 10 4.1-1.6 7-5.6 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-5"/></template>
    <template v-else-if="name === 'source'"><path d="M5 4h11l3 3v13H5z"/><path d="M8 10h8M8 14h8M8 18h5M15 4v4h4"/></template>
    <template v-else-if="name === 'refresh'"><path d="M20 7v5h-5M4 17v-5h5"/><path d="M18.5 9a7 7 0 0 0-12-2L4 12m16 0-2.5 5a7 7 0 0 1-12-2"/></template>
    <template v-else-if="name === 'wrench'"><path d="M14 6a4 4 0 0 0-5 5L3 17l4 4 6-6a4 4 0 0 0 5-5l-3 2-3-3 2-3Z"/></template>
    <template v-else-if="name === 'scale'"><path d="M12 3v18M6 6h12M6 6 3 12h6L6 6Zm12 0-3 6h6l-3-6ZM8 21h8"/></template>
    <template v-else-if="name === 'clock'"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></template>
    <template v-else-if="name === 'mail'"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></template>
    <template v-else-if="name === 'litter'"><path d="M5 9h14l-1 11H6L5 9Z"/><path d="M8 9c.5-3 2-5 4-5s3.5 2 4 5M9 14h6"/></template>
    <template v-else-if="name === 'feeder'"><path d="M7 4h10l1 10H6L7 4Z"/><path d="M5 20c0-3 2.5-5 7-5s7 2 7 5H5ZM10 8h4"/></template>
    <template v-else-if="name === 'tracker'"><path d="M12 21s7-5 7-11a7 7 0 1 0-14 0c0 6 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></template>
    <template v-else-if="name === 'camera'"><rect x="3" y="6" width="18" height="13" rx="3"/><circle cx="12" cy="12.5" r="3.5"/><path d="M8 6l1-2h6l1 2"/></template>
    <template v-else-if="name === 'target'"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></template>
  </svg>
</template>
