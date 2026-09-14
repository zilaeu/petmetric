<script setup lang="ts">
defineProps<{ items: { label: string; to?: string }[] }>()
</script>

<template>
  <nav class="breadcrumb-bar" aria-label="Breadcrumb">
    <div class="container breadcrumbs">
      <template v-for="(item, index) in items" :key="`${item.label}-${index}`">
        <NuxtLink v-if="item.to" :to="item.to">{{ item.label }}</NuxtLink>
        <span v-else aria-current="page">{{ item.label }}</span>
        <span v-if="index < items.length - 1" class="breadcrumb-separator" aria-hidden="true">/</span>
      </template>
    </div>
  </nav>
</template>
