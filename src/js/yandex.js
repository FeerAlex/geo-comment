export default class Yandex {
  constructor() {}

  init() {
    return new Promise((resolve, reject) => ymaps.ready(resolve))
    .then(() => {
      this.map = new ymaps.Map('map', {
        center: [55.76, 37.64],
        zoom: 7
      });

      this.cluster = new ymaps.Clusterer({
        preset: 'islands#invertedVioletClusterIcons',
        clusterDisableClickZoom: true,
        openBalloonOnClick: false
      });

      this.map.geoObjects.add(this.cluster);

      return this.map;
    });
  }

  async getAddress(e) {
    const coords = e.get('coords');
    const geocode = await ymaps.geocode(coords);
    const address = geocode.geoObjects.get(0).properties.get('text');

    return { address, coords};
  }

  createPlacemark(pos) {
    const placemark = new ymaps.Placemark(pos.coords, {
      hintContent: pos.address,
      balloonContent: `Мы кликнули на адресс: ${pos.address}`
    }, { preset: 'islands#blueHomeCircleIcon' });
    
    this.cluster.add(placemark);
  }
}