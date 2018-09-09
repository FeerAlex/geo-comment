import { createFrag } from "./utils";
import Scrollbar from './Scrollbar';


export default class Popup {
  constructor() {
    this.data = {};
    this.mouseCoords = { x: 0, y: 0 };

    this.addReview = this.addReview.bind(this);
    this.removeBody = this.removeBody.bind(this);
  }

  init(data) {
    this.data = data;

    this.createPopup();
    this.addListeners();
  }

  addListeners() {
    this.addBtn.addEventListener('click', this.addReview);
    this.close.addEventListener('click', this.removeBody);
  }

  addReview(e) {
    e.preventDefault();

    let user = this.form.elements.user.value;
    let place = this.form.elements.place.value;
    let text = this.form.elements.text.value;
    let date = new Date().toLocaleString().split(',').join('');

    if (!user || !place || !text) {
      alert('Заполните все поля!');
      return;
    }

    this.data.reviews.push({ user, place, text, date });

    this.updateReview();
  }

  updateReview() {}

  createPopup() {
    this.removeBody();

    this.popup = document.createElement('div');
    this.popup.classList.add('popup');
    this.popup.appendChild(createFrag('#popup', this.data));

    this.addBtn = this.popup.querySelector('.js-add');
    this.form = this.popup.querySelector('.form');
    this.close = this.popup.querySelector('.js-close');
    this.rBody = this.popup.querySelector('.popup-review');
    this.rList = this.popup.querySelector('.review-list');

    this.renderReviews();

    let body = document.querySelector('body');

    body.insertBefore(this.popup, body.firstChild);

    this.popup.style.left = this.getPos().x + 'px';
    this.popup.style.top = this.getPos().y + 'px';
  }

  renderReviews() {
    let rList = this.rList.cloneNode();
    let data = this.data;

    let reviews = createFrag('#reviews', data);

    rList.appendChild(reviews);

    this.rBody.replaceChild(rList, this.rList);
    this.rList = rList;

    new Scrollbar(this.rList);
  }

  removeBody() {
    if (!this.popup) return;

    let body = document.querySelector('body');
    
    body.removeChild(this.popup);
    this.popup = null;
    location.hash = '';
  }

  getPos() {
    if (this.mouseCoords.y + this.popup.offsetHeight > window.innerHeight + document.body.scrollTop) {
      this.mouseCoords.y = window.innerHeight - this.popup.offsetHeight;
    }

    if (this.mouseCoords.x + this.popup.offsetWidth > window.innerWidth + document.body.scrollLeft) {
      this.mouseCoords.x = window.innerWidth - this.popup.offsetWidth;
    }

    return this.mouseCoords;
  }
}