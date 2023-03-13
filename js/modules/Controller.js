export class Controller {
  constructor(selector, options) {
    this.$el = document.querySelector(selector);
    this.selector = selector;
    this.products = options.model.data;
    this.model = options.model;
    this.removeProduct();
    this.image = new Image();

    // Preview Image
    const fieldset = document.querySelector('.modal__fieldset')
    const postImgView = document.createElement('fieldset');
    postImgView.style.cssText = `text-align: center; display: block;`;
    postImgView.classList.add('modal__fieldset');
    postImgView.classList.add('img_preview');
    fieldset.after(postImgView)

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
  
  newInc(target){
    let inc = 0;
    const getTd = document.querySelectorAll('.goods__table .inc');
    const newInc = this.products.map((i, index) => {
      i.id = ++inc
      getTd[index].textContent = i.id;
    });
    return newInc;
  }
  removeProduct(e, data){
    // const id = e.target.closest('tr')
    //   .querySelector('.table__cell_name').dataset.id

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
  editProductModal(e, data) {
    const id = e.target.closest('tr')
      .querySelector('.table__cell_name').dataset.id

    document.body.scroll = "no"
    const popup = document.querySelector('.overlay');
    const fieldset = document.querySelector('.modal__fieldset')

    const popupAmount = document.querySelector('.modal__total-price');
    // this.clearDiscountField();
    // this.setFormFieldType();
    
    if (e.target.matches('.table__btn_edit')) popup.classList.add('active');

    //Change text from add product to save
    const modalBtn = document.querySelector('.modal__submit');
    modalBtn.textContent = 'Сохранить Товар';

    popup.addEventListener('click', e => {
      // e.preventDefault();
      if (e.target.matches('.table__btn_edit')) {
        popup.classList.add('active');
      } if (e.target.matches('.overlay') || e.target.closest('.modal__close')) {
        popup.classList.remove('active');
      }
    });

    document.addEventListener('keyup', e => (e.key === "Escape") ? popup.classList.remove('active') : 0);

    { // Attach / Render Image
      const file = document.querySelector('.modal__file');
      const preview = document.createElement('img');
      const fieldset = document.querySelector('.modal__fieldset')
      const postImgView = document.createElement('fieldset');
      postImgView.style.cssText = `
        text-align: center;
      `;

      file.addEventListener('change', async () => {
        if(file.files[0].size > 1024 * 1024) {
          const h3 = document.createElement('h3');
          h3.textContent = `Изображение не должно превышать размер 1 Мб`.toUpperCase();
          h3.style.cssText = `color: red; font-weight: bold; text-align: center; padding-top: 10px`;
          return fieldset.append(h3);
        }
        if(file.files.length > 0) {
          postImgView.classList.add('modal__fieldset');
          fieldset.after(postImgView)
          // postImgView.append(preview);
          const currentView = document.querySelector('.img_preview')
          postImgView.remove();
          currentView.innerHTML = ''
          currentView.append(preview)
          const src = URL.createObjectURL(file.files[0]);
          preview.src = src;
          preview.style.display = 'block';
          // const res = await this.toBase64(file.files[0]);
        }
      });
    }

    { // Identify the data by ID and pull up the data into the modal's form fields
      if(data && id) {
        data.map(el => {
          if(el.id === id) {
            fieldset.elements.title.value = el.title;
            fieldset.elements.category.value = el.category;
            fieldset.elements.units.value = el.units;
            if(el.discount > 0) {
              document.querySelector('.modal__checkbox').checked = true;
            } else {
              document.querySelector('.modal__checkbox').checked = false;
            }
            fieldset.elements.discount.value = el.discount;
            fieldset.elements.description.value = el.description;
            fieldset.elements.price.value = el.price;
            fieldset.elements.count.value = el.count;
            this.image.src = this.model.url(el.image);
            document.querySelector('.img_preview').append(this.image);
            document.querySelector('.img_preview img').style.cssText = `width: 50%;`;
            document.querySelector('.vendor-code__wrapper').innerText = `id: ${id}`;
          }
        });
      }
    }
    this.formData(id);
  }

  formData(id) {
    // Submit updates
    const form = document.querySelector('.modal__form');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const renderForm = new FormData(e.target);
      const data = Object.fromEntries(renderForm);
      const popup = document.querySelector('.overlay');
      popup.classList.remove('active');
      
      const file = document.querySelector('.modal__file');
      if(file.files.length > 0) {
        console.log('test', file.files);
        data.image = await this.toBase64(file.files[0]);
      } else {
        return data, location.reload();
      }
      // document.querySelector('.img_preview').remove();
      this.model.update(id, data);
    });
  }
  
  // openModal(id, data) {
  //   const form = document.querySelector('.modal__form');
  //   const popup = document.querySelector('.overlay');
  //   const modal = document.querySelector('.overlay__modal');

  //   document.addEventListener('click', e => {            
  //     const popupAmount = document.querySelector('.modal__total-price');
  //     this.clearDiscountField();
  //     this.setFormFieldType();
  //     if (e.target.matches('.panel__add-goods')) {
  //       popup.classList.add('active');
  //     } if (e.target.matches('.overlay') || e.target.closest('.modal__close')) {
  //       popup.classList.remove('active');
  //     }
  //     if(e.target.type === 'number') {
  //       document.addEventListener('change', () => {
  //         const dis = form.discount;
  //         const qty = form.count;
  //         const price = form.price;
  //         const totalAmount = Math.floor(qty.value * price.value  * (1 - dis.value/100));
  //         popupAmount.textContent = `$ ${totalAmount}.00`;
  //       })
  //     } if (e.target.matches('.modal__submit') && price.value > 0) {
  //       popup.classList.remove('active');
  //     }
  //   });

  //   { // Identify the data by ID and pull up the data
  //     const fieldset = document.querySelector('.modal__fieldset')
  //     if(data && id) {
  //       data.map(el => {
  //         if(el.id === id) {
  //           fieldset.elements.title.value = el.title;
  //           console.log(el);
  //         }
  //       });
  //     }
  //   }


  //   // Attach / Render Image
  //   const file = document.querySelector('.modal__file');
  //   const preview = document.createElement('img');
  //   const fieldset = document.querySelector('.modal__fieldset')
  //   const postImgView = document.createElement('fieldset');
  //   postImgView.style.cssText = `
  //     text-align: center;
  //   `;

  //   file.addEventListener('change', async () => {
  //     if(file.files[0].size > 1024 * 1024) {
  //       const h3 = document.createElement('h3');
  //       h3.textContent = `Изображение не должно превышать размер 1 Мб`.toUpperCase();
  //       h3.style.cssText = `color: red; font-weight: bold; text-align: center; padding-top: 10px`;
  //       return fieldset.append(h3);
  //     }
  //     if(file.files.length > 0) {
  //       postImgView.classList.add('modal__fieldset');
  //       fieldset.after(postImgView)
  //       postImgView.append(preview);
  //       const src = URL.createObjectURL(file.files[0]);
  //       preview.src = src;
  //       preview.style.display = 'block';
  //       // const res = await this.toBase64(file.files[0]);
  //     }
  //   });
    
  // }
  
  // addProduct = async (el, callback) => {
  //   const form = document.querySelector('.modal__form');
  //   const randomID = Math.floor(Math.random(1) * Date.now());
  //   form.addEventListener('submit', async (e) => {
  //     e.preventDefault();      
  //     const formData = new FormData(e.target);
  //     const currentID = this.products.length;
  //     const addNewItem = Object.fromEntries(formData);
  //     addNewItem.id = randomID;
      
  //     // Add Image
  //     addNewItem.image = await this.toBase64(addNewItem.image);
  //     // const img = document.createElement('img');
  //     // img.src = addNewItem.image;
  //     // document.body.append(img);

  //     this.products.push(addNewItem);
  //     console.log(this.products);
      
  //     const inc = this.products.length - 1;
  //     el.insertAdjacentHTML('beforeend',callback(inc, addNewItem))
  //     form.reset();
  //     this.totalAmount();
  //     this.openProductGallery('#previewImage', addNewItem.image);
  //   });
  // }

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