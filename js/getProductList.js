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
export class GetProductList {
  constructor(selector, options) {
    this.$el = document.querySelector(selector);
    this.options = options;
    this.#render();
    this.addProductModal();
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
  addProductModal(){
    document.addEventListener('click', e => {
      const popup = document.querySelector('.overlay');
      let target = e.target;
      if (target.matches('.panel__add-goods')) {
        popup.classList.add('active');
      } if (target.matches('.overlay') || target.closest('.modal__close')) {
        popup.classList.remove('active');
      } if (target.matches('.table__btn_del')) {
        const productList = target.closest('tr');
        const productID = +productList.querySelector('.table__cell-id').parentElement.dataset.id;
        const DBIndex = products.findIndex(goods => goods.id === productID);
        if (DBIndex >= 0) products.splice(DBIndex, 1);
        productList.remove();
        console.table('Storage: ', products);
      }
    });
  }
}
