export class View {
  constructor(selector, select) {
    this.$el = document.querySelector(selector);
    this.controller = select.controller;
    this.products = select.model.data;
    this.model = select.model;
    this.render();
    this.controller.openProductGallery('#previewImage');
    this.controller.search(this.createRow);
    // this.controller.openModal();
    // this.openModal();
    // this.controller.addProduct(this.$el, this.createRow);
  }
  render() {
    // this.search(this.createRow(null, data));
    const modalOverlay = document.querySelector('.overlay');
      modalOverlay.classList.toggle('active');
    //Rewriting rows and pull them up from the new JSON data
    this.$el.innerText = '';

    // Spinner
    const spinner = document.createElement('div');
    const table = document.querySelector('.goods__table-wrapper');
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

    // Pull data from the CMS github project
    this.model.list().then(data => {

      if (data.length > 0) spinner.remove();

      data.map((el, i) => {
        this.$el.insertAdjacentHTML('beforeend',this.createRow(i, el))
      });

      // Render Rows Controls
      const cta = document.querySelectorAll('.table__body tr');
      cta.forEach(el => {
        el.addEventListener('click', e => {
          if(e.target.closest('tr')) {
            // console.log(e.target.classList);
            // .classList('vendor-code__id')
          }
          if(e.target.matches('.table__btn_edit')) {
            this.controller.editProduct(e);
          }
        })
      });

      }).catch(err => console.warn(`Grid Data Error: `, err));
    // this.products.forEach((product, index) => {
    //   const inc = this.products.length - 1;
    //   this.$el.insertAdjacentHTML('beforeend',this.createRow(index, product))
    // });
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
        <button id="previewImage" class="table__btn table__btn_pic" data-pic="=${product.image}"></button>
        <button class="table__btn table__btn_edit"></button>
        <button class="table__btn table__btn_del"></button>
      </td>
    </tr>`
  }
}