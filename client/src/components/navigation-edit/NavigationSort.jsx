/**
 * Navigation editor item components.
 * Contains sortable row renderer and shared icon components for the editor UI.
 */
import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

import style from '@features/navigation/components/navigation-edit/navigationEdit.module.css';

/**
 * Renders one sortable navigation row with optional child menu management.
 * @param {object} props - Sortable item props.
 * @returns {JSX.Element} Sortable row UI.
 */
function SortableItem({
  item,
  burgerIcon,
  handleDeleteItem,
  handleDeleteChild,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item._id });

  const initialStyle = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  /**
   * Updates child creation form state.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event.
   * @returns {void}
   */

  /**
   * Creates child navigation item and replaces updated parent locally.
   * @returns {Promise<void>}
   */

  return (
    <div ref={setNodeRef} style={initialStyle}>
      <div className={style.navigationEdit_list_item}>
        <div {...attributes} {...listeners} style={{ cursor: 'grab' }}>
          <img src={burgerIcon} alt='Burger-Icon' />
        </div>
        <span className={style.navigationEdit_list_item_name}>{item.name}</span>
        <button
          className={style.navigationEdit__delete_item}
          onClick={handleDeleteItem}
        >
          X
        </button>
      </div>

      {item.childMenu && item.childMenu.length > 0 && (
        <div className={style.navigationEdit_child_list}>
          {item.childMenu.map((child) => (
            <div key={child._id} className={style.navigationEdit_child_item}>
              <span className={style.child_name}>{child.name}</span>
              <button
                className={style.navigationEdit__delete_item}
                onClick={() => handleDeleteChild(item._id, child._id)}
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { SortableItem };
