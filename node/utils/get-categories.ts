export function getCategory(rawCategories: string[]) {
  if (!rawCategories || !rawCategories.length) {
    return
  }

  return removeStartAndEndSlash(rawCategories[0])
}

function removeStartAndEndSlash(category?: string) {
  return category?.replace(/^\/|\/$/g, '')
}
