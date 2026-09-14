<script setup lang="ts">
const fallbackSections = [
  { title: 'Contact forms', body: 'When you submit a correction, we store your name, email, optional page URL and message so we can review and respond.' },
  { title: 'Media', body: 'Research media is stored securely. Do not upload personal or sensitive files.' }
]
const { data: pageData } = await usePetMetricApi<any>('privacy-page', '/pages/privacy', null)
const sections = computed(() => pageData.value?.content?.sections?.length ? pageData.value.content.sections : fallbackSections)
useSeoMeta({ title: 'Privacy — PetMetric', description: 'PetMetric privacy overview.' })
</script>
<template><div><AppBreadcrumbs :items="[{ label: 'Home', to: '/' }, { label: 'Privacy' }]" /><section class="page-hero"><div class="container"><span class="eyebrow">Privacy</span><h1 class="display">A short, readable privacy overview.</h1><p>We collect only what we need to operate the research desk and respond to you.</p></div></section><section class="section"><div class="container article-page"><template v-for="section in sections" :key="section.title"><h2>{{ section.title }}</h2><p>{{ section.body }}</p></template><h2>Questions</h2><p>For privacy questions, use our <NuxtLink to="/contact/">contact form</NuxtLink>.</p></div></section></div></template>
