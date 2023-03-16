export class Model {
  constructor(selector) {
    this.model = selector;
    // this.action = action.
  }

  url = (path, id) => 
    (path) ? `https://cms-yyk5.onrender.com/${path}` :
    (id) ? `https://cms-yyk5.onrender.com/api/goods/${id}` :
    `https://cms-yyk5.onrender.com/api/goods`;

  list = async (callback) => {
    const response = await fetch(this.url());
    if(response.ok) {
      const data = await response.json();
      if(callback) callback(data);
      if(callback(data)) {
        document.querySelector('.spinner').innerHTML = '';
        document.querySelector('.spinner').style = '';
      };
      return;
    };
  };

  modalPreview = async () => await (await fetch(this.url())).json();

  category = async () =>
    await (await fetch('https://cms-yyk5.onrender.com/api/category')).json();

  search = async (postfix, {callback}) => {
    try {
      const response = await fetch(`${this.url()}?search=${postfix}`, {
        method: 'get',
        headers: {'Content-Type': 'application/json'}
      });
      if(response.ok) {
        const data = await response.json();
        if(callback) callback(data);
        if(callback(data)) {
          document.querySelector('.spinner').innerHTML = '';
          document.querySelector('.spinner').style = '';
        };
        if(data.length === 0) {
          const table = document.querySelector('.table__body')
          table.innerHTML = `<div class="search__results"><h3>По вашему запросу ничего не найдено</h3></div>`;
          document.querySelector('.search__results').style.cssText = `
            margin: auto 0px; padding: 50px 0px; text-align: center;
          `;
        }
        return;
      }
    } catch(err) {
      console.warn(err);
      if(err) console.warn(err);
    }
    return
  }

  update = async (id, data, action) => {
    try { 
      const response = await fetch(this.url(false, id), {
        method: action, 
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          },
        });
      // if(response.ok) location.reload();
      if(response.ok) {
        const data = await response.json();
        return data, location.reload();
      }
    } catch(err) {
      console.warn(err);
      if(err) console.warn(err);
    }
    return
  }

}