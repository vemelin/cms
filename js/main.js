'use strict';
import {GetProductList} from './GetProductList.js';
const products = new GetProductList('.table__body', {
});

{
  const modalHeader = document.querySelectorAll('.modal__title'),
    modalForm = document.querySelectorAll('.modal__fieldset'),
    modalCheckbox = document.querySelectorAll('.modal__checkbox'),
    modalInputDiscount = document.querySelectorAll('.modal__input_discount');
}