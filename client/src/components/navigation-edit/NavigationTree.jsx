import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { getProjection } from './useTree';
import style from '@features/navigation/components/navigation-edit/navigationEdit.module.css';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  MeasuringStrategy,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const INDENTATION_WIDTH = 30;

const dropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: { active: { opacity: '0.4' } },
  }),
};

const getSubtreeEndIndex = (flatItems, rootIndex) => {
  const rootDepth = flatItems[rootIndex]?.depth ?? 0;
  let endIndex = rootIndex + 1;
  while (
    endIndex < flatItems.length &&
    (flatItems[endIndex]?.depth ?? 0) > rootDepth
  ) {
    endIndex += 1;
  }
  return endIndex;
};

// ─── Pure presentational row ─────────────────────────────────────────────────

const TreeItem = React.forwardRef(
  (
    {
      item,
      depth = 0,
      ghost,
      clone,
      dragOverlay,
      onDelete,
      handleProps,
      style: inlineStyle,
      ...rest
    },
    ref
  ) => {
    const wrapperClass = [
      style.treeItem_wrapper,
      ghost ? style.ghost : '',
      dragOverlay ? style.dragOverlay : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        className={wrapperClass}
        style={{
          '--spacing': `${INDENTATION_WIDTH * depth}px`,
          ...inlineStyle,
        }}
        {...rest}
      >
        <div className={style.treeItem_root}>
          {/* ── Drag handle ── */}
          <button
            className={style.dragHandle}
            {...handleProps}
            tabIndex={-1}
            aria-label='Drag to reorder'
          >
            ⠿
          </button>

          <span className={style.collapseButton_placeholder} />

          {/* ── title ── */}
          <span className={style.treeItem_label}>{item?.title}</span>

          {/* ── Delete (hidden on clone/overlay) ── */}
          {!clone && onDelete && (
            <button
              className={style.deleteButton}
              onClick={() => onDelete(item._id)}
              aria-label='Delete'
            >
              ×
            </button>
          )}
        </div>
      </div>
    );
  }
);
TreeItem.displayName = 'TreeItem';

// ─── Sortable row ─────────────────────────────────────────────────────────────

function SortableTreeItem({ item, activeId, projected, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item._id,
    animateLayoutChanges: () => false,
  });

  const depth =
    item._id === activeId && projected ? projected.depth : item.depth;

  return (
    <TreeItem
      ref={setNodeRef}
      item={item}
      depth={depth}
      ghost={isDragging}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      handleProps={{ ...attributes, ...listeners }}
      onDelete={onDelete}
    />
  );
}

// ─── Main tree ────────────────────────────────────────────────────────────────

function NavigationTree({
  items,
  isLoading,
  handleItemReorder,
  handleDeleteItem,
}) {

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

  useEffect(() => {
    flattenedItemsRef.current = orderedItems;
  }, [orderedItems]);

  useEffect(() => {
    offsetLeftRef.current = offsetLeft;
  }, [offsetLeft]);

  // ── Drag handlers ──
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

      const proj = getProjection(currentFlat, active.id, over.id, currentOffset);
      if (!proj) return;

      const movedSubtree = currentFlat.slice(ai, subtreeEnd);
      const remaining = [
        ...currentFlat.slice(0, ai),
        ...currentFlat.slice(subtreeEnd),
      ];

      const insertionIndex = oi > ai ? oi - subtreeSize + 1 : oi;

      const depthDelta = Math.max(0, proj.depth) - (movedSubtree[0]?.depth ?? 0);
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

  if (isLoading) return <span className={style.loader} />;

  return (
    <div className={style.navigationTree_container}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
        onDragStart={onDragStart}
        onDragMove={onDragMove}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
      >
        <SortableContext
          items={orderedItems.map((i) => i._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className={style.tree_list}>
            {orderedItems.map((item) => (
              <SortableTreeItem
                key={item._id}
                item={item}
                activeId={activeId}
                projected={projected}
                onDelete={handleDeleteItem}
              />
            ))}
          </div>
        </SortableContext>

        {createPortal(
          <DragOverlay dropAnimation={dropAnimation}>
            {activeId && activeItem ? (
              <TreeItem
                item={activeItem}
                depth={projected ? projected.depth : activeItem.depth}
                clone
                dragOverlay
              />
            ) : null}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}

export { NavigationTree };
