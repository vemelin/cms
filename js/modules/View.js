export class View {
  constructor(selector, select) {
    this.$el = document.querySelector(selector);
    this.controller = select.controller;
    this.products = select.model.data;
    this.render();
    this.openModal();
    this.addProduct();
    this.openProductGallery();
  }
  render() {
    const modalOverlay = document.querySelector('.overlay');
      modalOverlay.classList.toggle('active');
    //Rewriting rows and pull them up from the new JSON data
    this.$el.innerText = '';
    this.products.forEach((product, index) => {
      const inc = this.products.length - 1;
      this.$el.insertAdjacentHTML('beforeend',this.createRow(index, product))
    });
  }
  createRow = (inc, product) => {
    return `<tr>
      <td class="table__cell inc">${++inc}</td>
      <td class="table__cell table__cell_left table__cell_name" data-id="${product.id}">
        <span class="vendor-code__id">id: ${product.id}</span>
      ${product.title}</td>
      <td class="table__cell table__cell_left">${product.description}</td>
      <td class="table__cell">${product.units}</td>
      <td class="table__cell">${product.count}</td>
      <td class="table__cell">$${product.price}</td>
      <td class="table__cell">$${product.count * product.price}</td>
      <td class="table__cell table__cell_btn-wrapper">
        <button id="previewImage" class="table__btn table__btn_pic" data-pic="/img/photo_2022-03-30_14-57-05.jpg"></button>
        <button class="table__btn table__btn_edit"></button>
        <button class="table__btn table__btn_del"></button>
      </td>
    </tr>`
  }
  openModal() {
    const form = document.querySelector('.modal__form');
    const popup = document.querySelector('.overlay');
    document.addEventListener('click', e => {            
      const popupAmount = document.querySelector('.modal__total-price');
      this.controller.clearDiscountField();
      this.controller.setFormFieldType();
      if (e.target.matches('.panel__add-goods')) {
        popup.classList.add('active');
      } if (e.target.matches('.overlay') || e.target.closest('.modal__close')) {
        popup.classList.remove('active');
      }
      if(e.target.type === 'number') {
        document.addEventListener('change', () => {
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
    form.addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const currentID = this.products.length;
      const addNewItem = Object.fromEntries(formData);
      // console.log(addNewItem.image.name);
      addNewItem.id = randomID;
      this.products.push(addNewItem);
      console.log(this.products);
      const inc = this.products.length - 1;
      this.$el.insertAdjacentHTML('beforeend',this.createRow(inc, addNewItem))
      form.reset();
      this.controller.totalAmount();
    });
  }
  openProductGallery() {
    const previewImage = document.querySelectorAll('#previewImage');
    previewImage.forEach(el => {
      el.addEventListener('click', e => {
      
        const url = e.target.dataset.pic;
        const title = document.querySelector('.table__cell_name').textContent;
  
        const popupWindow = (url, title, width, height) => {
          const left = (screen.width/2)-(width/2);
          const top = (screen.height/2)-(height/2);
          return open(url, title, 'width='+width+', height='+height+', top='+top+', left='+left);
        };
  
        const newWindow = popupWindow(url, title, 800, 600);
        newWindow.document.body.innerHTML = `
          <img src="${url}" alt="image alt text goes here">
        `;
      })
    });
  }
}