import data from "../goods.json" assert { type: "json" };

export class Model {
  constructor(selector) {
    this.model = selector;
    this.data = data;
  }

  url = (path, id, search) => 
    (path) ? `https://cms-yyk5.onrender.com/${path}` :
    (id) ? `https://cms-yyk5.onrender.com/api/goods/${id}` :
    `https://cms-yyk5.onrender.com/api/goods`;

  list = async () =>
    await (await fetch(this.url())).json();

  update = async (id, data, path) => {
    fetch (this.url(null, id), {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }

  // fetchRequest = async (postfix, {
  //   method = 'get',
  //   callback,
  //   body,
  //   headers,
  // }) => {
  //   try {
  //     const options = {
  //       method,
  //       headers: {
  //         'X-Api-Key': '61e6d0e89cb240c8b1137b5e2cfa16be',
  //       },
  //     };
  //     if (body) options.body = JSON.stringify(body);
  //     // if (headers) options.headers = headers;
  //     if (headers) options.headers = headers;
  //     let response = await fetch(defaultURL, options);
  //     if(postfix) {
  //       response = await fetch(`${URL}${postfix}`, options);
  //     }
  //     if (response.ok) {
  //       const data = await response.json();
  //       if (callback) return callback(null, data);
  //       return;
  //     }
  //     throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
  //   } catch (err) {
  //     return callback(err);
  //   }
  // }

  // dataList() {
  //   const url = `https://cms-yyk5.onrender.com/api/goods`;
  //   const data = fetch(url)
  //     .then(res => res.json())
  //     .then(data => data.map(i => console.log(i)))
  //     .catch(err => console.warn(err));
  // }
}