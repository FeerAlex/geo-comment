export default class Yandex {
  constructor() {
    this.clickCluster = this.clickCluster.bind(this);
  }

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
          clusterBalloonContentLayout: "cluster#balloonCarousel",
        });

        this.map.geoObjects.add(this.cluster);

        return this.map;
      });
  }

  async getAll(pos) {
    let reviews = [];
    let filtered = await this.filterPlacemarks(pos.coords.join(''));
    
    filtered.map(obj => reviews.push(obj.properties.get('review')));
    
    return { pos, reviews };
  }

  async filterPlacemarks(placeId) {
    let geoObjects = await this.cluster.getGeoObjects();

    return geoObjects.filter(obj => obj.properties.get('data-place-id') === placeId);
  }

  async getAddress(e) {
    const coords = e.get('coords');
    const geocode = await ymaps.geocode(coords);
    const address = geocode.geoObjects.get(0).properties.get('text');

    return { address, coords };
  }

  createPlacemark(data) {
    let { pos, reviews } = data;
    let review = reviews[reviews.length - 1];

    const placemark = new ymaps.Placemark(pos.coords, {
      hintContent: pos.address,
      balloonContentHeader: `${review.place}`,
      balloonContentBody: `<a href="#${pos.coords.join('')}" class="cluster-link">${pos.address}</a><div class="cluster-content">${review.text}</div>`,
      balloonContentFooter: `${review.date}`,
    }, {
      preset: 'islands#blueHomeCircleIcon',
      hasBalloon: false
    });

    placemark.properties.set('review', review);
    placemark.properties.set('data-place-id', pos.coords.join(''));
    placemark.properties.set('pos', pos);

    placemark.events.add('click', () => {
      this.clickPlacemark(pos);
    });

    this.cluster.events.add('click', () => {
      this.clickCluster(); // при клике на группу меток, вызывается несколько раз
    });

    this.cluster.add(placemark);
  }

  clickPlacemark() {}

  clickCluster() {}
}