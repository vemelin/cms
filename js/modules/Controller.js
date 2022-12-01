export class Controller {
  constructor(selector, options) {
    this.selector = selector;
    this.products = options.model.data;
    this.totalAmount();
    this.removeProduct();
  }
  newInc(target){
    let inc = 0;
    const getTd = document.querySelectorAll('.goods__table .inc');
    const newInc = this.products.map((i, index) => {
      i.id = ++inc
      getTd[index].textContent = i.id;
    });
    return newInc;
  }
  totalAmount() {
    const reflectTotalAmount = document.querySelector('.cms__total-price');
    const totalAmount = [...this.products.map(i => i.price * i.count)]
      .reduce((acc, price) => acc + price, 0);
    return reflectTotalAmount.innerText = `$ ${totalAmount}`;
  }
  removeProduct(){
    document.addEventListener('click', e => {
      let target = e.target;
      if (target.matches('.table__btn_del')) {
        const productList = target.closest('tr');
        const productID = +productList.querySelector('.vendor-code__id').parentElement.dataset.id;
        const DBIndex = this.products.findIndex(i => i.id === productID);
        this.products.splice(DBIndex, 1);
        productList.remove();
        console.table('Storage: ', this.products);
        this.totalAmount();
        this.newInc(target);
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
}