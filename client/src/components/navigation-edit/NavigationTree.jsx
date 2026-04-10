import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { buildTree, flattenTree, getProjection } from './useTree';
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
  arrayMove,
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
      onCollapse,
      handleProps,
      style: inlineStyle,
      ...rest
    },
    ref
  ) => {
    const hasChildren = item?.childMenu?.length > 0;

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

          {/* ── Collapse toggle / placeholder ── */}
          {hasChildren && onCollapse ? (
            <button
              className={[
                style.collapseButton,
                item.collapsed ? style.collapsed : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={onCollapse}
              aria-label={item.collapsed ? 'Expand' : 'Collapse'}
            >
              ▶
            </button>
          ) : (
            <span className={style.collapseButton_placeholder} />
          )}

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

function SortableTreeItem({ item, activeId, projected, onDelete, onCollapse }) {
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
      onCollapse={onCollapse ? () => onCollapse(item._id) : undefined}
    />
  );
}

// ─── Main tree ────────────────────────────────────────────────────────────────

function NavigationTree({
  items,
  isLoading,
  handleItemReorder,
  handleDeleteItem,
  handleCollapse,
  collapsed,
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

  // ── Flatten + collapse-filter ──
  const flattenedItems = useMemo(() => {
    const flat = flattenTree(items || []);

    const collapsedIds = new Set(
      flat
        .filter((i) => i.childMenu?.length && collapsed[i._id])
        .map((i) => i._id)
    );

    const isHidden = (parentId) => {
      let pid = parentId;
      while (pid) {
        if (collapsedIds.has(pid)) return true;
        pid = flat.find((i) => i._id === pid)?.parentId ?? null;
      }
      return false;
    };

    return flat
      .filter((item) => item.parentId === null || !isHidden(item.parentId))
      .map((item) => ({ ...item, collapsed: !!collapsed[item._id] }));
  }, [items, collapsed]);

  const projected = useMemo(
    () =>
      activeId && overId
        ? getProjection(flattenedItems, activeId, overId, offsetLeft)
        : null,
    [flattenedItems, activeId, overId, offsetLeft]
  );

  const activeItem = useMemo(
    () => flattenedItems.find((i) => i._id === activeId),
    [activeId, flattenedItems]
  );

  useEffect(() => {
    flattenedItemsRef.current = flattenedItems;
  }, [flattenedItems]);

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

      const proj = getProjection(currentFlat, active.id, over.id, currentOffset);
      if (!proj) return;

      const next = arrayMove(currentFlat, ai, oi).map((item) =>
        item._id === active.id
          ? { ...item, depth: proj.depth, parentId: proj.parentId }
          : item
      );
      const nextTree = buildTree(next);
      console.debug('[DND] reorder computed', {
        movedFrom: ai,
        movedTo: oi,
        treeSize: nextTree.length,
      });

      reset();
      await handleItemReorder(nextTree);
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
          items={flattenedItems.map((i) => i._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className={style.tree_list}>
            {flattenedItems.map((item) => (
              <SortableTreeItem
                key={item._id}
                item={item}
                activeId={activeId}
                projected={projected}
                onDelete={handleDeleteItem}
                onCollapse={handleCollapse}
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
