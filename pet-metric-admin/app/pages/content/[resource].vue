<script setup lang="ts">
const route = useRoute()
const resource = computed(() => String(route.params.resource))
const api = useAdminApi()
const search = ref('')
const selected = ref<Record<string, any> | null>(null)
const saving = ref(false)
const notice = ref('')
const { data: resources } = await useAsyncData('admin-resources', () => api<AdminResource[]>('/admin/resources'))
const schema = computed(() => resources.value?.find(item => item.key === resource.value) || { key: resource.value, title: resourceLabels[resource.value] || resource.value, columns: [], json: [], boolean: [] })
const { data: rows, refresh } = await useAsyncData(() => `admin-${resource.value}-${search.value}`, () => api<any[]>(`/admin/${resource.value}?search=${encodeURIComponent(search.value)}`), { watch: [resource, search] })
const { data: options } = await useAsyncData('admin-options', () => api<any>('/admin/options'))
const editableColumns = computed(() => schema.value.columns.filter(column => !['id', 'created_at', 'updated_at'].includes(column)))
const relationFields = ['category_id', 'product_id', 'pick_product_id', 'product_a_id', 'product_b_id', 'comparison_id', 'guide_id', 'metric_definition_id']

function relationOptions(column: string) {
  if (column === 'category_id') return options.value?.categories || []
  if (['product_id', 'pick_product_id', 'product_a_id', 'product_b_id'].includes(column)) return options.value?.products || []
  if (column === 'comparison_id') return options.value?.comparisons || []
  if (column === 'metric_definition_id') return options.value?.comparisonMetrics || []
  return options.value?.troubleshooting || []
}
function edit(row?: Record<string, any>) {
  selected.value = row
    ? Object.fromEntries(Object.entries(row).map(([key, value]) => [key, schema.value.json.includes(key) && typeof value === 'object' ? JSON.stringify(value, null, 2) : value]))
    : Object.fromEntries(editableColumns.value.map(column => [column, schema.value.boolean.includes(column) ? false : '']))
}
function normalize(payload: Record<string, any>) {
  const result: Record<string, any> = {}
  for (const column of editableColumns.value) {
    let value = payload[column]
    if (schema.value.json.includes(column) && typeof value === 'string') {
      try { value = JSON.parse(value) } catch { /* server returns a validation error */ }
    }
    result[column] = value
  }
  return result
}
async function save() {
  if (!selected.value) return
  saving.value = true
  notice.value = ''
  try {
    const body = normalize(selected.value)
    const id = selected.value.id || (resource.value === 'settings' && selected.value.setting_key)
    await api(id ? `/admin/${resource.value}/${id}` : `/admin/${resource.value}`, { method: id ? 'PUT' : 'POST', body })
    selected.value = null
    notice.value = '已保存'
    await refresh()
  } catch {
    notice.value = '保存失败，请检查字段内容。'
  } finally {
    saving.value = false
  }
}
async function archive(row: any) {
  if (!row.id || !confirm('确定要下线这条内容吗？')) return
  await api(`/admin/${resource.value}/${row.id}`, { method: 'DELETE' })
  notice.value = '内容已下线'
  await refresh()
}
function display(value: any) {
  if (value == null || value === '') return '—'
  return typeof value === 'object' ? JSON.stringify(value) : String(value)
}
function fieldType(column: string) {
  if (['research_date', 'price_checked_date'].includes(column)) return 'date'
  if (column.includes('url')) return 'url'
  if (column.includes('email')) return 'email'
  return 'text'
}
useSeoMeta(() => ({ title: `${schema.value.title} — PetMetricus Admin` }))
</script>

<template>
  <div class="admin-shell">
    <AdminSidebar :active="resource" />
    <main class="admin-main">
      <header class="topbar">
        <div><p class="kicker">CONTENT LIBRARY / {{ resource.toUpperCase() }}</p><h1>{{ schema.title }}</h1></div>
        <button class="primary-button" @click="edit()">新建{{ schema.title }}</button>
      </header>
      <div class="toolbar">
        <label class="search-field">⌕<input v-model="search" type="search" placeholder="搜索标题、名称或 slug…" /></label>
        <span class="result-count">{{ rows?.length ?? 0 }} 条记录</span>
        <span v-if="notice" class="save-notice">{{ notice }}</span>
      </div>
      <section class="panel table-panel">
        <div v-if="!rows?.length" class="empty-state">暂无数据。可以点击右上角新建内容。</div>
        <div v-else class="table-scroll">
          <table>
            <thead><tr><th v-for="column in editableColumns.slice(0, 7)" :key="column">{{ labelForField(column) }}</th><th>操作</th></tr></thead>
            <tbody><tr v-for="row in rows" :key="row.id || row.setting_key">
              <td v-for="column in editableColumns.slice(0, 7)" :key="column">
                <span v-if="schema.boolean.includes(column)" class="publish-pill" :class="{ off: !row[column] }">{{ row[column] ? '是' : '否' }}</span>
                <span v-else>{{ display(row[column]).slice(0, 100) }}</span>
              </td>
              <td class="row-actions"><button @click="edit(row)">编辑</button><button v-if="row.is_published" @click="archive(row)">下线</button></td>
            </tr></tbody>
          </table>
        </div>
      </section>
      <div v-if="selected" class="drawer-backdrop" @click.self="selected = null">
        <aside class="edit-drawer">
          <header><div><p class="kicker">EDIT RECORD</p><h2>{{ selected.id ? '编辑内容' : '新建内容' }}</h2></div><button class="close-button" aria-label="关闭" @click="selected = null">×</button></header>
          <form @submit.prevent="save">
            <label v-for="column in editableColumns" :key="column">
              {{ labelForField(column) }}
              <select v-if="relationFields.includes(column)" v-model="selected[column]"><option value="">请选择</option><option v-for="item in relationOptions(column)" :key="item.id" :value="item.id">{{ item.label }}</option></select>
              <input v-else-if="schema.boolean.includes(column)" v-model="selected[column]" type="checkbox" />
              <textarea v-else-if="schema.json.includes(column) || ['description', 'subtitle', 'verdict', 'best_for', 'tradeoff', 'summary', 'body'].some(name => column.includes(name))" v-model="selected[column]" rows="4" :placeholder="schema.json.includes(column) ? '{ } 或 [ ]' : ''" />
              <input v-else v-model="selected[column]" :type="fieldType(column)" />
            </label>
            <footer><button type="button" class="ghost-button" @click="selected = null">取消</button><button class="primary-button" type="submit" :disabled="saving">{{ saving ? '保存中…' : '保存' }}</button></footer>
          </form>
        </aside>
      </div>
    </main>
  </div>
</template>
