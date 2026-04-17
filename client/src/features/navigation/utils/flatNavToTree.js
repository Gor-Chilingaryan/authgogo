export function flatNavToTree(flatItems) {
  if (!Array.isArray(flatItems) || flatItems.length === 0) return []

  const sorted = [...flatItems].sort(
    (a, b) => (a.position ?? 0) - (b.position ?? 0)
  )

  const roots = []
  const stack = []

  for (const item of sorted) {
    const depth = Number.isFinite(item.depth) ? Math.max(0, item.depth) : 0
    const node = { ...item, children: [] }

    while (stack.length > 0 && stack[stack.length - 1].depth >= depth) {
      stack.pop()
    }

    if (stack.length === 0) {
      roots.push(node)
    } else {
      stack[stack.length - 1].node.children.push(node)
    }

    stack.push({ node, depth })
  }

  return roots
}
