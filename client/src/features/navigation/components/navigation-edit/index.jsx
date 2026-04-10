import React from 'react';
import style from './navigationEdit.module.css';
import { useNavigate } from 'react-router-dom';

import { useNavigationEdit } from '@features/navigation/hook/useNavigationEdit';
import { NavigationTree } from '@components/navigation-edit/NavigationTree';
import InputWithLabel from '@components/input-label/InputWithLabel';

import arrowLeft from '@assets/icons/arrow-left.svg';
import chevronRight from '@assets/icons/chevron-right.svg';

function NavigationEdit() {
  const navigate = useNavigate();
  const {
    handleChange,
    handleCreateItem,
    handleItemReorder,
    handleDeleteItem,
    items,
    error,
    formData,
    isLoading,
  } = useNavigationEdit();

  if (isLoading) return <span className={style.loader} />;
  if (error) return <div className={style.error}>{error}</div>;

  return (
    <div className={style.navigationEdit_container}>
      {/* ── LEFT: form ── */}
      <div className={style.navigationEdit_creating}>
        <button
          onClick={() => navigate('/home')}
          className={style.navigationEdit_creating_back_button}
        >
          <img src={arrowLeft} alt='back' /> Back
        </button>

        <div className={style.navigationEdit_creating_input_container}>
          <InputWithLabel
            inputStyle={style.navigationEdit_creating_input}
            type='text'
            name='title'
            labelText='Name'
            changeValue={handleChange}
            value={formData?.title}
          />
          <InputWithLabel
            inputStyle={style.navigationEdit_creating_input}
            type='text'
            name='path'
            labelText='Path'
            changeValue={handleChange}
            value={formData?.path}
          />
        </div>

        <button
          className={style.navigationEdit_creating_add_button}
          onClick={handleCreateItem}
        >
          Add
          <img className={style.chevron} src={chevronRight} alt='' />
        </button>
      </div>

      {/* ── RIGHT: list ── */}
      <div className={style.navigationEdit_list}>
        {/* Static items */}
        <div className={style.navigationEdit_list_item}>
          <span className={style.navigationEdit_list_item_name}>Home</span>
        </div>
        <div className={style.navigationEdit_list_item}>
          <span className={style.navigationEdit_list_item_name}>Messenger</span>
        </div>

        {/* Sortable tree */}
        <NavigationTree
          items={items}
          isLoading={isLoading}
          handleItemReorder={handleItemReorder}
          handleDeleteItem={handleDeleteItem}
        />
      </div>
    </div>
  );
}

export { NavigationEdit };
