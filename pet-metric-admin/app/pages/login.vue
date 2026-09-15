<script setup lang="ts">
const token = ref('')
const error = ref('')
const { login } = useAdminAuth()
function submit() { if (token.value.length < 8) { error.value = '请输入有效的管理员 Token'; return }; login(token.value); navigateTo('/') }
</script>
<template><main class="login-page"><section class="login-card"><div class="admin-mark">PM</div><p class="kicker">PETMETRICUS / OPERATIONS</p><h1>内容管理工作台</h1><p class="muted">管理官网的产品、评测、比较和内容数据。</p><form @submit.prevent="submit"><label>管理员 Token<input v-model="token" type="password" autocomplete="current-password" placeholder="粘贴 ADMIN_TOKEN" /></label><p v-if="error" class="form-error">{{ error }}</p><button class="primary-button" type="submit">进入后台</button></form><small>本地开发默认使用后端 .env 中的 ADMIN_TOKEN。</small></section></main></template>
