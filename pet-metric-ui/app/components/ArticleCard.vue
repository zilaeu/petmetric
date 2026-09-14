<script setup lang="ts">
import type { ResearchItem } from '~/composables/usePetMetricData'
const props = defineProps<{ item: ResearchItem }>()
const href = articleHref(props.item)
const visual = computed(() => ({
  orange: '#b85c26', green: '#397356', blue: '#315d8f', purple: '#625486'
}[props.item.accent] || '#315d8f'))
const icon = computed(() => props.item.type === 'Troubleshooting' ? 'wrench' : props.item.type === 'Comparison' ? 'scale' : props.item.type === 'Best pick' ? 'check' : 'source')
</script>

<template>
  <NuxtLink class="article-card" :to="href">
    <div v-if="item.imageKey" class="article-visual article-visual--image"><img :src="`/api/media/${encodeURIComponent(item.imageKey)}`" :alt="item.title" loading="lazy" width="600" height="360" /></div>
    <div v-else class="article-visual" :style="{ '--visual': visual }"><span class="visual-glyph"><AppIcon :name="icon as any" :size="34" /></span></div>
    <div class="article-body">
      <div class="article-type"><span>{{ item.type }}</span><span>{{ item.category }}</span></div>
      <h3>{{ item.title }}</h3>
      <p>{{ item.excerpt }}</p>
      <div class="article-foot"><span>{{ item.readTime }} · Checked {{ item.checkedAt }}</span><span aria-hidden="true">→</span></div>
    </div>
  </NuxtLink>
</template>
