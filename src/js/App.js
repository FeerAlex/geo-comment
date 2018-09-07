import Yandex from "./yandex";

export default class App {
  constructor() {
    this.map = new Yandex();

    this.init();
  }

  async init() {
    this.mapApi = await this.map.init();

    this.mapApi.events.add('click', async (e) => {
      const pos = await this.map.getAddress(e);
      this.map.createPlacemark(pos);
    });
  }
}