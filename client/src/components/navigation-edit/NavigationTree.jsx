import React from 'react';
import { createPortal } from 'react-dom';
import { useTree } from './useTree';
import burgerIcon from '@assets/icons/burger.svg?url';
import style from '@features/navigation/components/navigation-edit/navigationEdit.module.css';
import {
  DndContext,
  closestCenter,
  DragOverlay,
  defaultDropAnimationSideEffects,
  MeasuringStrategy,
} from '@dnd-kit/core';
import {
  SortableContext,
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
            <img src={burgerIcon} alt='grab' />
          </button>


          {/* ── title ── */}
          <span className={style.treeItem_label}>{item?.title}</span>

          {/* ── Delete (hidden on clone/overlay) ── */}
          {!clone && onDelete && (
            <button
              className={style.deleteButton}
              onClick={() => onDelete(item._id)}
              aria-label='Delete'
            >
              x
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
  const {
    sensors,
    orderedItems,
    projected,
    activeItem,
    onDragStart,
    onDragMove,
    onDragOver,
    onDragEnd,
    onDragCancel,
    activeId,
  } = useTree({ items, handleItemReorder });

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
