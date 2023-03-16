export class Controller {
  constructor(selector, options) {
    this.$el = document.querySelector(selector);
    this.selector = selector;
    this.products = options.model.data;
    this.model = options.model;
    this.image = new Image();

    // Preview Image
    this.fieldset = document.querySelector('.modal__fieldset')
    this.imgPreview = document.createElement('div');
    this.imgPreview.style.cssText = `text-align: center; display: block;`;
    this.imgPreview.classList.add('modal__fieldset');
    this.imgPreview.classList.add('img_preview');
    this.fieldset.after(this.imgPreview)
  }

  openModal() {
    const popup = document.querySelector('.overlay');
    popup.addEventListener('click', e => {
      if (e.target.matches('.table__btn_edit')) {
        popup.classList.add('active');
      } if (e.target.matches('.overlay') || e.target.closest('.modal__close')) {
        popup.classList.remove('active');
      }
    });
  }
  
  updateImage () {
    // Attach / Render Image
    const file = document.querySelector('.modal__file');
    const preview = document.createElement('img');
    const fieldset = document.querySelector('.modal__fieldset')
    const postImgView = document.createElement('fieldset');
    postImgView.style.cssText = `
      text-align: center;
      display: block;
    `;

    file.addEventListener('change', (e) => {
      const errMsg = document.querySelector('.error_limits_message');
      if(errMsg) errMsg.remove();

      if (file.files.length > 0) {
        postImgView.classList.add('modal__fieldset');
        fieldset.after(postImgView)
        const currentView = document.querySelector('.img_preview')
        postImgView.remove();
        currentView.innerHTML = ''
        currentView.append(preview)
        preview.src = URL.createObjectURL(file.files[0])
      }

      if(file.files[0].size > 1024 * 1024) {
        const h3 = document.createElement('h3');
        h3.textContent = `Изображение не должно превышать размер 1 Мб`.toUpperCase();
        h3.style.cssText = `color: red; font-weight: bold; text-align: center; padding-top: 10px`;
        h3.classList.add('error_limits_message');
        this.fieldset.append(h3);
        return;
      }
    });
  }

  debounceSearch = (callback, msec) => {
    let lastCall = 0, lastCallTimer = NaN;
    return (...args) => {
      const prevCall = lastCall;
      lastCall = Date.now();
      if(prevCall && ((lastCall - prevCall) <= msec)) clearTimeout(lastCallTimer)
      lastCallTimer = setTimeout(() => callback(...args), msec)
    }
  };
  search(callback) {
    const input = document.querySelector('.panel__input');
    input.addEventListener('input', async e => {
      // const rx = new RegExp(input.value, 'i');
      this.model.search(input.value, {
        method: 'get',
        callback: this.debounceSearch(callback, 300),
      })
    })
  }  
  categoryList (data) {
    const block = document.querySelector('.modal__label_category');
    block.children[1].setAttribute('list', 'category-list');
    const datalist = document.createElement('datalist');
    datalist.setAttribute('id', 'category-list');

    this.model.category().then(data => {
      data.map(i => {
        const option = document.createElement('option');
        option.setAttribute('value', `${i}`);
        datalist.append(option)
      });
    })
    block.after(datalist)
  }

  removeProduct(e, data){
    const id = e.target.closest('tr')
      .querySelector('.table__cell_name').dataset.id

    this.model.modalPreview().then(data => data.map(el => {
      if(el.id === id) {
        const msg = confirm(`Вы хотите удалить "${el.title}"?`);
        if (msg) this.model.update(id, false, 'DELETE');
      }
    }));
  }

  editProductModal(e, data) {
    
    const id = e.target.closest('tr')
      .querySelector('.table__cell_name').dataset.id

    // Prepoluate Categories
    this.categoryList();

    // Empty Image Text placeholder
    document.querySelector('.img_preview').textContent = '';

    const popup = document.querySelector('.overlay');
    
    if (e.target.matches('.table__btn_edit')) {
      popup.classList.add('active');
    }

    //Change text from add product to save
    const modalBtn = document.querySelector('.modal__submit');
    modalBtn.textContent = 'Сохранить Товар';

    document.addEventListener('keyup', e => (e.key === "Escape") ? popup.classList.remove('active') : 0);

    { // Identify the data by ID and pull up the data into the modal's form fields
      if(data && id) {
        data.map(el => {
          if(el.id === id) {
            this.fieldset.elements.title.value = el.title;
            this.fieldset.elements.category.value = el.category;
            this.fieldset.elements.units.value = el.units;
            if(el.discount > 0) {
              document.querySelector('.modal__checkbox').checked = true;
            } else {
              document.querySelector('.modal__checkbox').checked = false;
            }
            this.fieldset.elements.discount.value = el.discount;
            this.fieldset.elements.description.value = el.description;
            this.fieldset.elements.price.value = el.price;
            this.fieldset.elements.count.value = el.count;
            this.image.src = this.model.url(el.image);
            document.querySelector('.img_preview').append(this.image);
            document.querySelector('.img_preview img').style.cssText = `width: 50%;`;
            document.querySelector('.vendor-code__wrapper').innerText = `id: ${id}`;
          }
        });
      }
    }

    // Attach / Render Image
    this.updateImage()

    // Submit updates
    const form = document.querySelector('.modal__form');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const renderForm = new FormData(e.target);
      const data = Object.fromEntries(renderForm);
      const popup = document.querySelector('.overlay');
      popup.classList.remove('active');
      const file = document.querySelector('.modal__file');
      if (file.files.length > 0) {
        data.image = await this.toBase64(file.files[0]);
        if(file.files[0].size > 1024 * 1024) {
          console.log('oversize');
          return
        } else if (file.files[0].size === undefined) return data, console.log('oversize');
      } else {
        data.image = `image/${id}.jpg`
        return this.model.update(id, data, 'PATCH');
      }
      this.model.update(id, data, 'PATCH');
    });

    const popupAmount = document.querySelector('.modal__total-price');
    const dis = form.discount;
    const qty = form.count;
    const price = form.price;
    const totalAmount = Math.floor(qty.value * price.value  * (1 - dis.value/100));
    popupAmount.textContent = `$ ${totalAmount}.00`;

  }
  
  addProduct(e) {
    const popup = document.querySelector('.overlay');
    const form = document.querySelector('.modal__form');

    // Prepoluate Categories
    this.categoryList();

    document.addEventListener('keyup', e => (e.key === "Escape") ? 
      popup.classList.remove('active') : 0);

    document.addEventListener('click', e => {
      const popupAmount = document.querySelector('.modal__total-price');

      this.clearDiscountField();
      this.setFormFieldType();
      
      if (e.target.matches('.panel__add-goods')) {
        form.reset()
        //Change text from add product to save
        const modalBtn = document.querySelector('.modal__submit');
        modalBtn.textContent = 'Добавить Товар';
        const imgPreview = document.querySelector('.img_preview');
        imgPreview.innerHTML = '<h3>Картинка</h3>'
        const errMsg = document.querySelector('.error_limits_message');
        if(errMsg) errMsg.remove();
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
    })

    // Attach / Render Image
    this.updateImage()

    // Submit updates
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const renderForm = new FormData(e.target);
      const data = Object.fromEntries(renderForm);
      const popup = document.querySelector('.overlay');
      popup.classList.remove('active');
      const file = document.querySelector('.modal__file');
      if(file.files[0].size > 1024 * 1024) return;
      if (file.files.length > 0) {
        data.image = await this.toBase64(file.files[0]);
      }
      this.model.update(false, data, 'POST');
    });
    form.reset();
  }

  openProductGallery(selector) {
    const previewImage = document.querySelectorAll(selector);
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
        return newWindow.document.body.innerHTML = `
          <img src="${url}" alt="image alt text goes here">
        `;
      })
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

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('loadend', () => {
      resolve(reader.result);
    });
    reader.addEventListener('error', err => {
      reject(err);
    });
    reader.readAsDataURL(file);
  })
}