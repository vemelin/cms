import {Model} from './modules/Model.js';
const model = new Model('model', {});

import {Controller} from './modules/Controller.js';
const controller = new Controller('.table__body', {
  model,
});

import {View} from './modules/View.js';
const renderView = new View('.table__body', {
  model,
  controller,
})