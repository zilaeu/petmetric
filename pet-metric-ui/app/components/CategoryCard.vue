<script setup lang="ts">
import type { Category } from '~/composables/usePetMetricData'
defineProps<{ category: Category }>()
const colors: Record<string, string> = { orange: '#d97c2a', blue: '#315d8f', green: '#397356', purple: '#625486' }
</script>

<template>
  <NuxtLink class="category-card" :style="{ '--tile': colors[category.color] }" :to="`/products/${category.slug}/`">
    <span class="category-icon"><AppIcon :name="category.icon" :size="24" /></span>
    <div><p class="eyebrow">{{ category.eyebrow }}</p><h3>{{ category.name }}</h3><p>{{ category.description }}</p></div>
    <div class="category-meta"><span>{{ category.count }} products tracked</span><span aria-hidden="true">→</span></div>
  </NuxtLink>
</template>
