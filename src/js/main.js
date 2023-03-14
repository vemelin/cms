import '../css/index.css';
// import '../fonts/fonts.css';

import {Model} from './modules/Model';
const model = new Model('model', {});

import {Controller} from './modules/Controller';
const controller = new Controller('.table__body', {
  model,
});

import {View} from './modules/View';
const renderView = new View('.table__body', {
  model,
  controller,
})