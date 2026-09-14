<script setup lang="ts">
const props = defineProps<{
  eyebrow: string
  title: string
  subtitle: string
  breadcrumb?: { label: string; to?: string }[]
  stats?: { value: string; label: string }[]
  image?: string
  variant?: 'about' | 'editorial' | 'disclosure' | 'contact'
}>()

const isAutomaticLitterBoxes = computed(() => props.title === 'Automatic Litter Boxes')
const heroImage = computed(() => props.image || (isAutomaticLitterBoxes.value ? 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=1400&h=500&fit=crop&auto=format' : undefined))
</script>

<template>
  <AppBreadcrumbs v-if="breadcrumb?.length" :items="breadcrumb" />
  <section class="design-hero" :class="[{ 'design-hero--image': heroImage }, variant && `design-hero--${variant}`]">
    <img v-if="heroImage" class="design-hero-bg" :src="heroImage" alt="" aria-hidden="true" />
    <div class="container design-hero-container">
      <div class="design-hero-grid" :class="{ 'design-hero-grid--stats': stats?.length }">
        <div>
          <p class="design-eyebrow">{{ eyebrow }}</p>
          <h1 class="display">{{ title }}</h1>
          <p class="design-hero-copy">{{ subtitle }}</p>
        </div>
        <div v-if="stats?.length" class="design-stats">
          <div v-for="stat in stats" :key="stat.label">
            <strong>{{ stat.value }}</strong>
            <span>{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
