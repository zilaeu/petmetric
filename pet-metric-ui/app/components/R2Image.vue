<script setup lang="ts">
const props = defineProps<{ imageKey?: string | null; fallback?: string | null; alt: string; eager?: boolean }>()
const r2src = props.imageKey ? `/api/media/${encodeURIComponent(props.imageKey)}` : ''
const src = ref(r2src || props.fallback || '')
const source = ref<'r2' | 'fallback'>(r2src ? 'r2' : 'fallback')
const retryCount = ref(0)
const failed = ref(!src.value)

function handleError() {
  if (source.value === 'r2' && props.fallback) {
    source.value = 'fallback'
    retryCount.value = 0
    src.value = props.fallback
    return
  }
  if (source.value === 'fallback' && props.fallback && retryCount.value < 2) {
    retryCount.value += 1
    const separator = props.fallback.includes('?') ? '&' : '?'
    src.value = `${props.fallback}${separator}petmetric_retry=${retryCount.value}`
    return
  }
  failed.value = true
}
</script>
<template>
  <img v-if="!failed" :src="src" :alt="alt" :loading="eager ? 'eager' : 'lazy'" width="900" height="620" referrerpolicy="no-referrer" @load="failed = false" @error="handleError" />
  <div v-else class="r2-image-placeholder" role="img" :aria-label="`Image unavailable for ${alt}`">
    <svg aria-hidden="true" viewBox="0 0 48 48"><path d="M7 10h34v28H7z"/><circle cx="17" cy="19" r="4"/><path d="m10 34 9-9 7 7 5-5 7 7"/></svg>
    <span>Image temporarily unavailable</span>
  </div>
</template>

<style scoped>
.r2-image-placeholder { display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 10px; width: 100%; height: 100%; min-height: 180px; padding: 20px; color: var(--muted-foreground); background: linear-gradient(135deg,#f7f5f0,#eceae4); text-align: center; }
.r2-image-placeholder svg { width: 42px; height: 42px; fill: none; stroke: currentColor; stroke-width: 2; }
.r2-image-placeholder span { font: 500 12px var(--font-mono); }
</style>
