/**
 * Navigation editor page component.
 * Displays create form and sortable navigation list for custom menu management.
 */
import React from 'react';
import style from './navigationEdit.module.css';
import { useNavigate } from 'react-router-dom';

import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DndContext, closestCenter } from '@dnd-kit/core';

import { useNavigationEdit } from '@features/navigation/hook/useNavigationEdit';
import { SortableItem } from '@components/navigation-edit/NavigationSort';
import InputWithLabel from '@components/input-label/InputWithLabel';

import arrowLeft from '@assets/icons/arrow-left.svg';
import burgerIcon from '@assets/icons/burger.svg?url';
import chevronRight from '@assets/icons/chevron-right.svg';
/**
 * Renders drag-and-drop navigation management UI.
 * @returns {JSX.Element} Navigation editor screen.
 */
function NavigationEdit() {
  const navigate = useNavigate();
  const {
    handleDragEnd,
    handleDeleteItem,
    handleChange,
    handleCreateItem,
    handleDeleteChild,
    sensors,

    items,
    error,
    formData,
    isLoading,
  } = useNavigationEdit();

  if (isLoading) return <span className={style.loader} />;
  if (error) return <div className={style.error}>{error}</div>;

  return (
    <div className={style.navigationEdit_container}>
      <div className={style.navigationEdit_creating}>
        <button
          onClick={() => navigate('/home')}
          className={style.navigationEdit_creating_back_button}
        >
          <img src={arrowLeft} alt='Arrow-Left' /> Back
        </button>
        <div className={style.navigationEdit_creating_input_container}>
          <InputWithLabel
            inputStyle={style.navigationEdit_creating_input}
            type='text'
            name='name'
            labelText='Name'
            changeValue={handleChange}
            value={formData?.name}
          />
          <InputWithLabel
            inputStyle={style.navigationEdit_creating_input}
            type='text'
            name='path'
            labelText='path'
            changeValue={handleChange}
            value={formData?.path}
          />
        </div>
        <button
          className={style.navigationEdit_creating_add_button}
          onClick={handleCreateItem}
        >
          Add{' '}
          <img
            className={style.chevron}
            src={chevronRight}
            alt='Chevron-Right'
          />
        </button>
      </div>

      <div className={style.navigationEdit_list}>
        <div className={style.navigationEdit_list_item}>
          <span className={style.navigationEdit_list_item_name}>Home</span>
        </div>

        <div className={style.navigationEdit_list_item}>
          <span className={style.navigationEdit_list_item_name}>Messenger</span>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((item) => item._id)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item) => (
              <SortableItem
                key={item._id}
                item={item}
                handleDeleteItem={() => handleDeleteItem(item._id)}
                handleDeleteChild={handleDeleteChild}
                burgerIcon={burgerIcon}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

export { NavigationEdit };
