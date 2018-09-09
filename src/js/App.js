import Yandex from "./yandex";
import Popup from "./Popup";

export default class App {
  constructor() {
    this.map = new Yandex();
    this.popup = new Popup();

    this.handleHash = this.handleHash.bind(this);

    this.init();
    this.addListener();
  }
  
  async init() {
    this.mapApi = await this.map.init();

    this.mapApi.events.add('click', async (e) => {
      let pos = await this.map.getAddress(e);
      this.mapApi.balloon.close();
      this.popup.init({ pos: pos, reviews: [] });
    });
  }

  addListener() {
    document.addEventListener('mousemove', e => {
      this.popup.mouseCoords = { x: e.clientX, y: e.clientY };
    });

    this.popup.updateReview = () => {
      this.map.createPlacemark(this.popup.data);
      this.popup.renderReviews();
    };

    addEventListener('hashchange', this.handleHash);

    this.map.clickPlacemark = async (pos) => {
      let data = await this.map.getAll(pos);
      
      this.popup.init(data);
    }

    this.map.clickCluster = () => {
      this.popup.removeBody();
    }
  }

  async handleHash(e) {
    const { name } = this.getRouteInfo();

    if (name) {
      let d = await this.map.filterPlacemarks(name);
      let pos = d[0].properties.get('pos');
      let data = await this.map.getAll(pos);

      this.mapApi.balloon.close();

      this.popup.init(data);
    }
  }

  getRouteInfo() {
    const hash = location.hash ? location.hash.slice(1) : '';
    const [name, id] = hash.split('/');

    return { name, params: { id } }
  }
}