<script setup lang="ts">
const form = reactive({ type: 'correction', name: '', email: '', url: '', message: '' })
const sent = ref(false)
const error = ref('')
const submitting = ref(false)
const errorSummary = ref<HTMLElement | null>(null)
const types = [{value:'correction',label:'Correction'},{value:'question',label:'Question'},{value:'press',label:'Press / media'},{value:'other',label:'Other'}]
const successCopy = computed(() => ({
  correction: "We'll verify the correction and respond within 5 business days. Thank you for helping us get it right.",
  question: "We'll review your question and respond within 5 business days.",
  press: "We've received your media inquiry and will review the deadline you provided.",
  other: "We've received your message and will respond within 5 business days."
}[form.type] || "We've received your message."))
const info = [
  {icon:'source', title:'Corrections', body:'We verify corrections within 5 business days. Verified changes are applied immediately and noted in the page changelog.'},
  {icon:'search', title:'Research questions', body:"We answer questions about our methodology and sourcing. We can't give personalized pet health advice."},
  {icon:'external', title:'Press & media', body:'For media inquiries, include your publication and deadline. We aim to respond within 24 hours for time-sensitive requests.'}
]
const { data: pageData } = await usePetMetricApi<any>('contact-page', '/pages/contact', null)
const contactIntro = computed(() => pageData.value?.content?.intro || "Found an error? Have a question we haven't answered? We respond to all messages within 5 business days.")
async function submit() {
  error.value = ''; submitting.value = true
  try {
    await $fetch('/api/contact', { method: 'POST', body: form })
    sent.value = true
  } catch (err: any) {
    error.value = err?.data?.error || 'Something went wrong. Please check the fields and try again.'
    await nextTick()
    errorSummary.value?.focus()
  }
  finally { submitting.value = false }
}
function reset() {
  form.type='correction'; form.name=''; form.email=''; form.url=''; form.message=''; sent.value=false
}
useSeoMeta({ title: 'Contact PetMetric', description: 'Submit a correction or contact the PetMetric research desk.' })
</script>

<template>
  <div>
    <DesignHero variant="contact" eyebrow="Get in touch" :title="pageData?.title || 'Corrections, questions & feedback'" :subtitle="contactIntro" :breadcrumb="[{label:'Home',to:'/'},{label:'Contact'}]" />
    <div class="contact-page">
      <div class="contact-design-layout">
        <div>
          <div v-if="sent" class="contact-success" role="status">
            <span>✓</span><h2>Message received</h2>
            <p>{{ successCopy }}</p>
            <button type="button" @click="reset">Send another message</button>
          </div>
          <form v-else class="contact-form" novalidate @submit.prevent="submit">
            <div v-if="error" ref="errorSummary" class="form-error" role="alert" tabindex="-1">{{ error }}</div>
            <fieldset><legend>Message type</legend><div class="contact-type-row"><button v-for="type in types" :key="type.value" type="button" :class="{active:form.type===type.value}" :aria-pressed="form.type===type.value" @click="form.type=type.value">{{ type.label }}</button></div></fieldset>
            <div class="contact-name-row">
              <label>Name<input v-model="form.name" type="text" autocomplete="name" placeholder="Your name" required /></label>
              <label>Email<input v-model="form.email" type="email" autocomplete="email" placeholder="you@example.com" required /></label>
            </div>
            <label v-if="form.type==='correction'">Page URL <small>(which page has the error?)</small><input v-model="form.url" type="url" placeholder="https://petmetric.com/reviews/…" /></label>
            <label>{{ form.type==='correction' ? "What's wrong, and what should it say?" : 'Your message' }}<textarea v-model="form.message" rows="6" required :placeholder="form.type==='correction' ? 'Describe the error and include a source if you have one…' : 'Your message…'" /></label>
            <button class="contact-submit" type="submit" :disabled="submitting">{{ submitting ? 'Sending…' : 'Send message' }}</button>
          </form>
        </div>
        <aside class="contact-info">
          <section v-for="item in info" :key="item.title"><span aria-hidden="true"><AppIcon :name="item.icon as any" :size="22" /></span><div><h2>{{ item.title }}</h2><p>{{ item.body }}</p></div></section>
          <section class="contact-response"><div><span>Response time</span><strong>Within 5 business days</strong><p>We read every message. Corrections get priority.</p></div></section>
        </aside>
      </div>
    </div>
  </div>
</template>
