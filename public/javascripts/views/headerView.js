class HeaderView {
  constructor() {
    this.parentElement = document.querySelector('header');
  }

  bindHeaderClick(handler) {
    this.parentElement.querySelector('.container').addEventListener('click', (event) => {
      handler();
    })
  }
}

export default new HeaderView();