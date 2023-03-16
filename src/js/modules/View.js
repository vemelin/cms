export class View {
  constructor(selector, select) {
    this.$el = document.querySelector(selector);
    this.resetDefaultHtml();
    this.controller = select.controller;
    this.products = select.model.data;
    this.model = select.model;
    this.$el.innerText = '';
    // this.controller.addProduct();
    this.controller.search(this.createRow)
    this.model.list(this.createRow)
  }
  spinner(data) {
    const spinner = document.createElement('div');
    const table = document.querySelector('.goods__table-wrapper');
    spinner.classList.add('spinner');
    spinner.style.cssText = `
      width 100%;
      margin: auto 0;
      padding: 50px 0;
      text-align: center;
    `;
    spinner.innerHTML = `
      <svg width="24" height="24" stroke="#000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_V8m1{transform-origin:center;animation:spinner_zKoa 2s linear infinite}.spinner_V8m1 circle{stroke-linecap:round;animation:spinner_YpZS 1.5s ease-in-out infinite}@keyframes spinner_zKoa{100%{transform:rotate(360deg)}}@keyframes spinner_YpZS{0%{stroke-dasharray:0 150;stroke-dashoffset:0}47.5%{stroke-dasharray:42 150;stroke-dashoffset:-16}95%,100%{stroke-dasharray:42 150;stroke-dashoffset:-59}}</style><g class="spinner_V8m1"><circle cx="12" cy="12" r="9.5" fill="none" stroke-width="3"></circle></g></svg>
    `;
    table.append(spinner);
    const loadinTextPlaceholder = document.createElement('p');
    loadinTextPlaceholder.textContent = `Подождите идет загрузка данных`
    spinner.append(loadinTextPlaceholder)

    if(data !== undefined) {
      return document.querySelector('.spinner').remove();
    }
  }
  resetDefaultHtml() {
    //Re-place html numbers to zero
    const reflectTotalAmount = document.querySelector('.cms__total-price');
    reflectTotalAmount.textContent = '$ 0.00';
    // Hide Modal
    const modalOverlay = document.querySelector('.overlay');
      modalOverlay.classList.toggle('active');
    // Spinner
    this.spinner();
    const addBtn = document.querySelector('.panel__add-goods');
    addBtn.addEventListener('click', e => {
      this.controller.addProduct(e);
    })
  }
  createRow = (arr) => {
    const imgUrl = `https://cms-yyk5.onrender.com/`;
    if(arr.length > 0) this.$el.innerHTML = '';
    const reflectTotalAmount = document.querySelector('.cms__total-price');
    reflectTotalAmount.textContent = '$ 0.00';

    // Calculate total amount of all visible products
    if(arr) {
      const totalAmount = [...arr.map(i => i.price * i.count)]
      .reduce((acc, price) => acc + price, 0);
      reflectTotalAmount.innerText = `$ ${totalAmount}`;
    }

    // Render Rows (table view)
    arr.map(data => {
      this.$el.insertAdjacentHTML('beforeend', `
        <tr>
          <td class="table__cell inc">${data.id}</td>
          <td class="table__cell table__cell_left table__cell_name" data-id="${data.id}">
            <span class="vendor-code__id">${data.title}</span>
          </td>
          <td class="table__cell table__cell_left">${data.category}</td>
          <td class="table__cell">${data.units}</td>
          <td class="table__cell">${data.count}</td>
          <td class="table__cell">$${data.price}</td>
          <td class="table__cell">$${data.count * data.price}</td>
          <td class="table__cell table__cell_btn-wrapper">
            <button id="previewImage" class="table__btn table__btn_pic" data-pic="${imgUrl + data.image}"></button>
            <button class="table__btn table__btn_edit"></button>
            <button class="table__btn table__btn_del"></button>
          </td>
        </tr>` 
      );
    });

    // Edit product
    const cta = document.querySelectorAll('.table__body tr');
    cta.forEach(el => {
      el.addEventListener('click', e => {
        if(e.target.matches('.table__btn_edit')) {
          this.controller.openModal();
          this.controller.editProductModal(e, arr);
          // const imgArr = document.querySelectorAll('.img_preview img');
          const errMsg = document.querySelector('.error_limits_message');
          if (errMsg) errMsg.remove();
          // if (imgArr.length === 2) imgArr[0].remove();
          this.controller.categoryList();
        }
        if(e.target.matches('.table__btn_del')) {
          this.controller.removeProduct(e);
        }
        
      })
    });

    // Click on image icon to preview image in a modal
    this.controller.openProductGallery('#previewImage');

    return arr.length > 0;
  };
}