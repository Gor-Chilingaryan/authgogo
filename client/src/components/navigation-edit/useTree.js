import { arrayMove } from '@dnd-kit/sortable';


export function flattenTree(items, parentId = null, depth = 0) {
  return items.reduce((acc, item) => {
    const id = typeof item?._id === 'string' ? item._id : String(item?._id ?? '');
    return [
      ...acc,
      { ...item, _id: id, parentId, depth },
      ...flattenTree(item.childMenu || [], id, depth + 1),
    ];
  }, []);
}


export function getProjection(items, activeId, overId, dragOffset) {
  const indentationWidth = 30;
  const activeItemIndex = items.findIndex((i) => i._id === activeId);
  const overItemIndex = items.findIndex((i) => i._id === overId);

  if (activeItemIndex === -1 || overItemIndex === -1) return null;

  const activeItem = items[activeItemIndex];
  const newItems = arrayMove(items, activeItemIndex, overItemIndex);

  const previousItem = newItems[overItemIndex - 1];

  // Рассчитываем глубину более стабильно
  let depth = activeItem.depth;
  if (dragOffset > indentationWidth && previousItem) {
    // Не даем вложенность больше чем "глубина соседа + 1"
    depth = Math.min(previousItem.depth + 1, 3);
  } else if (dragOffset < -indentationWidth) {
    depth = Math.max(0, depth - 1);
  }

  // КРИТИЧНО: Если мы в самом верху (overItemIndex === 0), глубина ВСЕГДА 0, parentId - null
  if (overItemIndex === 0) {
    return { depth: 0, parentId: null };
  }

  // Поиск родителя: ближайший элемент выше с depth = depth - 1
  let parentId = null;
  if (depth > 0) {
    for (let i = overItemIndex - 1; i >= 0; i--) {
      if (newItems[i].depth === depth - 1) {
        parentId = newItems[i]._id;
        break;
      }
    }
  }

  return { depth, parentId };
}

export function buildTree(flattenedItems) {
  const root = [];
  const map = {};

  // 1. Создаем карту объектов
  flattenedItems.forEach((item) => {
    map[item._id] = { ...item, childMenu: [] };
  });

  // 2. Сборка дерева
  flattenedItems.forEach((item) => {
    const node = map[item._id];
    // Удаляем технические поля перед отправкой на бэкенд
    const { parentId, depth, ...cleanNode } = node;

    if (item.parentId === null) {
      root.push(node);
    } else {
      const parent = map[item.parentId];
      if (parent) {
        parent.childMenu.push(node);
      } else {
        // Если родитель не найден (страховка от удаления), делаем корнем
        root.push(node);
      }
    }
  });

  // 3. Рекурсивная очистка от parentId/depth во всем дереве
  const finalize = (nodes) => {
    return nodes.map((node, idx) => {
      const { parentId, depth, ...rest } = node;
      return {
        ...rest,
        index: idx + 1,
        childMenu: finalize(node.childMenu || [])
      };
    });
  };

  return finalize(root);
}