<script setup lang="ts">
import type { DesignProduct } from '~/composables/designData'

defineProps<{ product: DesignProduct; generic?: boolean; rank?: number }>()

function reviewCount(value?: number | null) {
  return value == null ? '' : new Intl.NumberFormat('en-US').format(value)
}
</script>

<template>
  <article v-if="generic" class="generic-product-card">
    <div class="generic-product-grid">
      <div class="generic-product-image">
        <R2Image :image-key="product.imageKey" :fallback="product.img" :alt="product.alt" />
        <span>#{{ rank }}</span>
      </div>
      <div class="generic-product-content">
        <div class="generic-product-topline">
          <span>{{ product.brand }}</span>
          <div><b v-for="tag in product.tags" :key="tag">{{ tag }}</b></div>
          <span>Updated {{ product.updated }}</span>
        </div>
        <h3>{{ product.name }}</h3>
        <p class="generic-product-verdict">{{ product.verdict }}</p>
        <div class="spec-chips"><span v-for="spec in product.specs" :key="spec">{{ spec }}</span></div>
        <p class="generic-product-best"><strong>Best for:</strong> {{ product.bestFor }}</p>
      </div>
      <div class="generic-product-buy">
        <div>
          <div class="generic-score">
            <div><strong>{{ product.score != null ? product.score.toFixed(1) : product.amazonRating?.toFixed(1) || '—' }}</strong><span v-if="product.score != null || product.amazonRating != null">/5</span></div>
            <p><small>{{ product.score != null ? 'PetMetric' : 'Amazon' }}</small><b>{{ product.score != null ? 'Score' : 'Rating' }}</b><small v-if="product.score == null && product.amazonReviewCount">{{ reviewCount(product.amazonReviewCount) }} reviews</small></p>
          </div>
        </div>
        <div>
          <NuxtLink class="btn btn--dark" :to="`/reviews/${product.slug}/`">Read review <AppIcon name="arrow" :size="12" /></NuxtLink>
          <a class="btn btn--accent" :href="product.merchantUrl" target="_blank" rel="sponsored nofollow noopener" :aria-label="`Check ${product.name} price at ${product.merchantName} (opens in a new tab)`">Check price <AppIcon name="external" :size="12" /></a>
        </div>
      </div>
    </div>
  </article>

  <article v-else class="design-product-card">
    <div class="design-product-image">
      <R2Image :image-key="product.imageKey" :fallback="product.img" :alt="product.alt" />
    </div>
    <div class="design-product-content">
      <div class="product-card-topline"><span>{{ product.brand }}</span><span>Updated {{ product.updated }}</span></div>
      <div class="design-product-heading">
        <div><h3>{{ product.name }}</h3><p class="product-best-for">Best for: {{ product.bestFor }}</p></div>
        <div class="design-score"><strong>{{ product.score != null ? product.score.toFixed(1) : product.amazonRating?.toFixed(1) || '—' }}</strong><span v-if="product.score != null || product.amazonRating != null">/ 5</span></div>
      </div>
      <p class="design-product-verdict">{{ product.verdict }}</p>
      <div class="spec-chips"><span v-for="spec in product.specs" :key="spec">{{ spec }}</span></div>
      <div class="design-product-footer">
        <div class="design-product-actions"><NuxtLink class="btn btn--dark" :to="`/reviews/${product.slug}/`">Read review <AppIcon name="arrow" :size="13" /></NuxtLink><a class="btn btn--accent" :href="product.merchantUrl" target="_blank" rel="sponsored nofollow noopener" :aria-label="`Check ${product.name} price at ${product.merchantName} (opens in a new tab)`">Check price <AppIcon name="external" :size="13" /></a></div>
      </div>
    </div>
  </article>
</template>
