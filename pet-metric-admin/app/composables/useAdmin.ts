export type AdminResource = {
  key: string
  title: string
  columns: string[]
  json: string[]
  boolean: string[]
}

export const resourceLabels: Record<string, string> = {
  categories: '分类', 'category-criteria':'分类评估标准', products: '产品', 'product-specs':'产品规格', reviews: '产品评测', comparisons: '产品比较',
  'comparison-audiences':'比较适用人群', 'comparison-criteria':'比较维度',
  'best-picks': '最佳选择', guides: '购买指南', troubleshooting: '故障指南', 'troubleshooting-steps':'故障处理步骤', pages: '页面内容', settings: '网站设置'
}

export function useAdminAuth() {
  const token = useState<string>('admin-token', () => '')
  if (import.meta.client && !token.value) token.value = localStorage.getItem('petmetric-admin-token') || ''
  const login = (value: string) => { token.value = value; if (import.meta.client) localStorage.setItem('petmetric-admin-token', value) }
  const logout = () => { token.value = ''; if (import.meta.client) localStorage.removeItem('petmetric-admin-token'); navigateTo('/login') }
  return { token, login, logout }
}

export function useAdminApi() {
  const config = useRuntimeConfig()
  const { token } = useAdminAuth()
  return async function adminFetch<T>(path: string, options: Record<string, unknown> = {}) {
    return await $fetch<{ data: T }>(path, {
      baseURL: config.public.apiBase,
      ...options,
      headers: { Authorization: `Bearer ${token.value}`, ...((options.headers as Record<string,string>) || {}) }
    }).then(response => response.data)
  }
}

export function labelForField(field: string) {
  const labels: Record<string, string> = {
    category_id:'分类', product_id:'产品', pick_product_id:'推荐产品', product_a_id:'产品 A', product_b_id:'产品 B',
    is_published:'已发布', is_featured:'首页推荐', sort_order:'排序', updated_label:'更新时间标签', image_url:'图片地址',
    image_key:'R2 图片 Key', alt_text:'图片说明', merchant_name:'商家名称', merchant_url:'购买链接', marketplace_domain:'亚马逊站点', delivery_country_code:'配送国家代码', price_display:'价格展示',
    best_for:'适合人群', home_verdict:'首页结论', views_count:'浏览量', read_time:'阅读时长', content_json:'内容 JSON',
    setting_key:'设置名称', setting_value:'设置内容', estimated_time:'预计耗时', source_count:'来源数量', research_date:'研究日期',
    price_checked_date:'价格核验日期', next_review_label:'下次复核', quick_specs_json:'快速规格 JSON', strengths_json:'优点 JSON',
    limitations_json:'局限 JSON', sections_json:'正文段落 JSON', gallery_json:'图片组 JSON'
  }
  return labels[field] || field.replaceAll('_', ' ').replace(/\b\w/g, char => char.toUpperCase())
}
