const fallbackCategories = [
  { slug: 'automatic-litter-boxes', title: 'Automatic Litter Boxes' },
  { slug: 'smart-pet-feeders', title: 'Smart Pet Feeders' },
  { slug: 'gps-pet-trackers', title: 'GPS Pet Trackers' },
  { slug: 'pet-cameras', title: 'Pet Cameras' },
  { slug: 'smart-water-fountains', title: 'Smart Water Fountains' },
  { slug: 'pet-grooming-tools', title: 'Pet Grooming Tools' },
  { slug: 'pet-waste-cleanup', title: 'Pet Waste Cleanup' },
  { slug: 'pet-walking-safety', title: 'Pet Walking & Safety' }
]

export async function useCategoryOptions(key = 'shared-categories') {
  const { data } = await usePetMetricApi<any[]>(key, '/categories', [])
  return computed(() => (data.value?.length ? data.value : fallbackCategories).slice(0, 20).map(category => ({
    slug: category.slug,
    label: category.title || category.name || category.slug
  })))
}
