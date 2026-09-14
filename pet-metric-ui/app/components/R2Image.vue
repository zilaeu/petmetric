<script setup lang="ts">
const props = defineProps<{ imageKey?: string; fallback: string; alt: string; eager?: boolean }>()
const r2src = props.imageKey ? `/api/media/${encodeURIComponent(props.imageKey)}` : ''
const src = ref(props.fallback)
const failed = ref(false)

onMounted(async () => {
  if (!r2src) return
  try {
    const response = await fetch(r2src, { method: 'HEAD' })
    if (response.ok) src.value = r2src
  } catch { /* The design fallback remains available during local development. */ }
})

function handleError() {
  if (src.value === r2src) src.value = props.fallback
  else failed.value = true
}
</script>
<template><img v-if="!failed" :src="src" :alt="alt" :loading="eager ? 'eager' : 'lazy'" width="900" height="620" @error="handleError" /></template>
