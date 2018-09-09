export default class Scrollbar {
  constructor(container) {
    this.body = container;

    this.bScroll = {
      delta: Math.min(this.body.offsetHeight / 3,
        (this.body.scrollHeight - this.body.offsetHeight) / 4),
      offsetY: 0
    }

    this.onScrollMouseDown = this.onScrollMouseDown.bind(this);
    this.onScrollMouseMove = this.onScrollMouseMove.bind(this);
    this.onScrollMouseUp = this.onScrollMouseUp.bind(this);
    this.onScrollMousewheel = this.onScrollMousewheel.bind(this);

    this.init();
  }

  init() {
    if (!(this.body.scrollHeight - this.body.offsetHeight)) {
      return false;
    }

    this.createScroll();
    this.addListener();
  }

  createScroll() {
    this.scroll = document.createElement('div');
    this.scroll.classList.add('scroll');
    this.scroll.style.height = this.body.scrollHeight + 'px';

    this.scrollTrack = document.createElement('div');
    this.scrollTrack.classList.add('scroll-track');

    this.scroll.appendChild(this.scrollTrack);
    this.body.appendChild(this.scroll);
  }

  addListener() {
    this.body.addEventListener('mousewheel', this.onScrollMousewheel);

    this.scrollTrack.addEventListener('mousedown', this.onScrollMouseDown);
  }

  onScrollMouseDown(e) {
    if (!this.bScroll) return false;

    this.bScroll.offsetY = e.offsetY;

    document.addEventListener("mousemove", this.onScrollMouseMove);
    document.addEventListener("mouseup", this.onScrollMouseUp);
  }

  onScrollMousewheel(e) {
    if (!this.bScroll) return false;

    let fScrollTop = this.body.scrollTop - Math.sign(e.wheelDelta || -e.detail) * this.bScroll.delta;

    // Ограничения
    fScrollTop = Math.max(fScrollTop, 0);
    fScrollTop = Math.min(fScrollTop, this.body.scrollHeight - this.body.offsetHeight);

    // Защита от деления на 0
    if (!(this.body.scrollHeight - this.body.offsetHeight)) return false;

    // Ищем позицию ползунка
    let h = fScrollTop / (this.body.scrollHeight - this.body.offsetHeight);
    let pos = fScrollTop + this.body.offsetHeight * h;
    pos -= this.scrollTrack.offsetHeight * h;

    this.scrollTrack.style.top = pos + 'px';
    this.body.scrollTop = fScrollTop;

    return false;
  }

  onScrollMouseMove(e) {
    if (!this.bScroll) return false;

    // Получили высоту кнопки
    let butH = this.scrollTrack.offsetHeight;

    let top = this.body.getBoundingClientRect().top + document.body.scrollTop;

    // Считаем разницу
    let diff = -(top - e.clientY) - this.bScroll.offsetY;

    // Находим процент прокрутки / 100
    let h = diff / (this.body.offsetHeight - butH);
    h = Math.max(h, 0);
    h = Math.min(h, 1);

    // Новую позицию    
    let fScrollTop = h * (this.body.scrollHeight - this.body.offsetHeight);
    // Находим позицию ползунка
    let scrollPos = fScrollTop + h * (this.body.offsetHeight - butH);

    // Двигаем документ
    this.body.scrollTop = fScrollTop;

    // Двигаем
    this.scrollTrack.style.top = scrollPos + 'px';

    this.removeSelection();

    return false;
  }

  onScrollMouseUp() {
    document.removeEventListener("mousemove", this.onScrollMouseMove);
    document.removeEventListener("mouseup", this.onScrollMouseUp);
  }

  removeSelection(){
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    } else if (document.selection && document.selection.clear) {
      document.selection.clear();
    }
  }
}