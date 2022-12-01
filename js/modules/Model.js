import data from '../goods.json' assert {type: 'json'};
export class Model {
  constructor(selector) {
    this.model = selector;
    this.data = data;
  }
}