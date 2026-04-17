import { useEffect, useMemo, useRef, useState } from 'react';
import {
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { arrayMove } from '@dnd-kit/sortable';


export function useTree({ items, handleItemReorder }) {
  function getProjection(items, activeId, overId, dragOffset) {
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

  const [activeId, setActiveId] = useState(null);
  const [overId, setOverId] = useState(null);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const flattenedItemsRef = useRef([]);
  const offsetLeftRef = useRef(0);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const orderedItems = useMemo(
    () =>
      [...(Array.isArray(items) ? items : [])]
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
        .map((item) => ({
          ...item,
          depth: Number.isFinite(item.depth) ? Math.max(0, item.depth) : 0,
        })),
    [items]
  );

  const projected = useMemo(
    () =>
      activeId && overId
        ? getProjection(orderedItems, activeId, overId, offsetLeft)
        : null,
    [orderedItems, activeId, overId, offsetLeft]
  );

  const activeItem = useMemo(
    () => orderedItems.find((i) => i._id === activeId),
    [activeId, orderedItems]
  );


  const onDragStart = ({ active }) => {
    setActiveId(active.id);
    setOverId(active.id);
  };
  const onDragMove = ({ delta, over }) => {
    setOffsetLeft(delta.x);
    if (over) setOverId(over.id);
  };
  const onDragOver = ({ over }) => {
    if (over) setOverId(over.id);
  };

  const onDragEnd = async ({ active, over }) => {
    const currentFlat = flattenedItemsRef.current;
    const currentOffset = offsetLeftRef.current;
    try {
      console.debug('[DND] onDragEnd', {
        activeId: active?.id ?? null,
        overId: over?.id ?? null,
      });
      if (!active?.id || !over?.id || active.id === over.id) return;

      const ai = currentFlat.findIndex((i) => i._id === active.id);
      const oi = currentFlat.findIndex((i) => i._id === over.id);
      if (ai < 0 || oi < 0) return;

      const subtreeEnd = getSubtreeEndIndex(currentFlat, ai);
      const subtreeSize = subtreeEnd - ai;
      if (oi >= ai && oi < subtreeEnd) return;

      const proj = getProjection(
        currentFlat,
        active.id,
        over.id,
        currentOffset
      );
      if (!proj) return;

      const movedSubtree = currentFlat.slice(ai, subtreeEnd);
      const remaining = [
        ...currentFlat.slice(0, ai),
        ...currentFlat.slice(subtreeEnd),
      ];

      const insertionIndex = oi > ai ? oi - subtreeSize + 1 : oi;

      const depthDelta =
        Math.max(0, proj.depth) - (movedSubtree[0]?.depth ?? 0);
      const adjustedSubtree = movedSubtree.map((item, index) => ({
        ...item,
        depth:
          index === 0
            ? Math.max(0, proj.depth)
            : Math.max(0, (item.depth ?? 0) + depthDelta),
      }));

      const next = [
        ...remaining.slice(0, insertionIndex),
        ...adjustedSubtree,
        ...remaining.slice(insertionIndex),
      ];

      const nextItems = next.map((item, index) => ({
        ...item,
        position: index + 1,
      }));
      console.debug('[DND] reorder computed', {
        movedFrom: ai,
        movedTo: oi,
        subtreeSize,
        insertionIndex,
        itemsSize: nextItems.length,
      });

      reset();
      await handleItemReorder(nextItems);
    } finally {
      // ensure DnD internal state is always cleaned even if API fails
      reset();
    }
  };

  const onDragCancel = () => reset();

  const reset = () => {
    setActiveId(null);
    setOverId(null);
    setOffsetLeft(0);
  };
  useEffect(() => {
    flattenedItemsRef.current = orderedItems;
  }, [orderedItems]);

  useEffect(() => {
    offsetLeftRef.current = offsetLeft;
  }, [offsetLeft]);


  return { sensors, orderedItems, projected, activeItem, onDragStart, onDragMove, onDragOver, onDragEnd, onDragCancel, flattenedItemsRef, offsetLeftRef, activeId };
}




export const getSubtreeEndIndex = (flatItems, rootIndex) => {
  const rootDepth = flatItems[rootIndex]?.depth ?? 0;
  let endIndex = rootIndex + 1;
  while (
    endIndex < flatItems.length &&
    (flatItems[endIndex]?.depth ?? 0) > rootDepth
  ) {
    endIndex += 1;
  }
  return endIndex;
};;