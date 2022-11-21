import products from './goods.json' assert {type: 'json'};
const createRow = (inc, product) => {
  return `<tr>
            <td class="table__cell">${++inc}</td>
            <td class="table__cell table__cell_left table__cell_name" data-id="${product.id}">
              <span class="table__cell-id">id: ${product.id}</span>
            ${product.title}</td>
            <td class="table__cell table__cell_left">${product.description}</td>
            <td class="table__cell">${product.units}</td>
            <td class="table__cell">${product.count}</td>
            <td class="table__cell">$${product.price}</td>
            <td class="table__cell">$${product.count * product.price}</td>
            <td class="table__cell table__cell_btn-wrapper">
              <button class="table__btn table__btn_pic"></button>
              <button class="table__btn table__btn_edit"></button>
              <button class="table__btn table__btn_del"></button>
            </td>
          </tr>`
}
export class getProductList {
  constructor(selector, options) {
    this.$el = document.querySelector(selector);
    this.options = options;
    this.#render();
    this.#popUpSetUp();
  }
  #render() {
    //Hide popup
    const modalOverlay = document.querySelector('.overlay');
      modalOverlay.classList.toggle('active');
    //Rewriting rows and pull them up from the new JSON data
    this.$el.innerText = '';
    products.forEach((product, index) => {
      this.$el.insertAdjacentHTML('beforebegin',createRow(index, product))
    });
  }
  #popUpSetUp(){
    this.clickHanlder = this.clickHanlder.bind(this);
    document.querySelector('body')
    .addEventListener('click', this.clickHanlder);
  }
  clickHanlder(event) {
    const {type} = event.target;
    if(type === 'submit') {
      this.toggle();
    }
    if(event.target.matches('path') ||
        event.target.matches('svg')) {
      const btn = document.querySelector('.overlay')
      .classList.toggle('active');
    }
  }
  get popUpIsOpen() {
    const btn = document.body.classList.contains('active');
    return btn ?? overlay;
  }
  toggle() {
    this.popUpIsOpen ? this.close() : this.open();
  }
  open() {
    document.querySelector('.overlay').classList.add('active');
  }
  close() {
    document.querySelector('.overlay').classList.remove('active');
  }
  clear() {
    document.body.querySelector('.panel__add-goods')
    .removeEventListener('click', this.clickHanlder);
  }
}
