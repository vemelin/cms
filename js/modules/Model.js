import data from "../goods.json" assert { type: "json" };

export class Model {
  constructor(selector) {
    this.model = selector;
    this.data = data;
  }

  list = async () =>
    await (await fetch(`https://cms-yyk5.onrender.com/api/goods`)).json();

  // dataList() {
  //   const url = `https://cms-yyk5.onrender.com/api/goods`;
  //   const data = fetch(url)
  //     .then(res => res.json())
  //     .then(data => data.map(i => console.log(i)))
  //     .catch(err => console.warn(err));
  // }
}
