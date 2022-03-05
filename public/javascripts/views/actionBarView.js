class ActionBarView {
  constructor() {
    this.parentElement = document.querySelector('.actionBar');
  }

  resetInput() {
    this.parentElement.querySelector('#searchBox').value = '';
  }

  hide() {
    this.parentElement.classList.add('hide');
  }

  show() {
    this.parentElement.classList.remove('hide');
  }

  getInput() {
    const input = this.parentElement.querySelector('#searchBox').value;
    return input;
  }

  bindSearchInput(handler) {
    this.parentElement.addEventListener('input', function(event) {
      handler();
    })
  }

  bindAddContactButton(handler) {
    this.parentElement.addEventListener('click', event => {
      if (event.target.id === 'addBtn') {
        event.preventDefault();
        handler();
      }
    });
  }
}

export default new ActionBarView();