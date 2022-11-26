import products from './goods.json' assert {type: 'json'};
const createRow = (inc, product) => {
  return `<tr>
            <td class="table__cell">${++inc}</td>
            <td class="table__cell table__cell_left table__cell_name" data-id="${product.id}">
              <span class="vendor-code__id">id: ${product.id}</span>
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
    this.productDB = products;
    this.options = options;
    this.#render();
    this.openModal();
    this.addProduct();
    this.removeProduct();
    this.totalAmount();
  }
  totalAmount() {
    const reflectTotalAmount = document.querySelector('.cms__total-price');
    const totalAmount = [...products.map(i => i.price * i.count)]
      .reduce((acc, price) => acc + price, 0);
    return reflectTotalAmount.innerText = `$ ${totalAmount}`;
  }  
  #render() {
    // const lastElement = + Object.keys(products)[Object.keys(products).length-1] + 1;
    // console.log(this.productDB[3].id = 'test');
    // console.log(this.productDB);
    // console.log(lastElement);
    // const { id } = this.productDB;
    // this.productDB.push({id: 'test'});
    // console.log(this.productDB);
    // console.log(id);

    //Hide popup
    const modalOverlay = document.querySelector('.overlay');
      modalOverlay.classList.toggle('active');
    //Rewriting rows and pull them up from the new JSON data
    this.$el.innerText = '';
    products.forEach((product, index) => {
      this.$el.insertAdjacentHTML('beforebegin',createRow(index, product))
    });
  }
  removeProduct(){
    document.addEventListener('click', e => {
      let target = e.target;
      if (target.matches('.table__btn_del')) {
        const productList = target.closest('tr');
        const productID = +productList.querySelector('.vendor-code__id').parentElement.dataset.id;
        const DBIndex = products.findIndex(i => i.id === productID);
        products.splice(DBIndex, 1);
        productList.remove();
        console.table('Storage: ', products);
        this.totalAmount();
      }
    });
  }
  clearDiscountField(){
    const checkbox = document.querySelector('.modal__checkbox');
    const discount = document.querySelector('.modal__input_discount');
    discount.disabled = !checkbox.checked;
    if (!discount.disabled) {
    } if (!checkbox.checked) {
      discount.value = '';
    }
  }
  setFormFieldType() {
    const form = document.querySelector('.modal__form');
    for (const option of Array(...form)) {
      if (option.type !== 'checkbox' && option.type !== 'file') {
        option.required = true;
      }
    }
    form.discount.type = 'number';
    form.elements.count.type = 'number';
    form.elements.price.type = 'number';
  }
  openModal() {
    const form = document.querySelector('.modal__form');
    const popup = document.querySelector('.overlay');
    document.addEventListener('click', e => {            
      const popupAmount = document.querySelector('.modal__total-price');
      this.clearDiscountField();
      this.setFormFieldType();
      if (e.target.matches('.panel__add-goods')) {
        popup.classList.add('active');
      } if (e.target.matches('.overlay') || e.target.closest('.modal__close')) {
        popup.classList.remove('active');
      }
      if(e.target.type === 'number') {
        document.addEventListener('mouseup', () => {
          const dis = form.discount;
          const qty = form.count;
          const price = form.price;
          const totalAmount = Math.floor(qty.value * price.value  * (1 - dis.value/100));
          popupAmount.textContent = `$ ${totalAmount}.00`;
        })
      } if (e.target.matches('.modal__submit') && price.value > 0) {
        popup.classList.remove('active');
      }
    });
  }
  addProduct() {
    const form = document.querySelector('.modal__form');
    const randomID = Math.floor(Math.random(1) * Date.now());
    // const idElem = document.querySelector('.vendor-code__id');
    // idElem.textContent = randomID;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const currentID = this.productDB.length;
      const addNewItem = Object.fromEntries(formData);
      addNewItem.id = randomID;
      this.productDB.push(addNewItem);
      console.log(this.productDB);
      const inc = products.length - 1;
      this.$el.insertAdjacentHTML('beforebegin',createRow(inc, addNewItem))
      form.reset();
      this.totalAmount();
    });
  }
}
