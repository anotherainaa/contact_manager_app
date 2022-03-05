export default class View {
  render(data) {
    if (Array.isArray(data) && data.length === 0) {
      this.renderError();
      return;
    }

    this.data = data;
    const markup = this.generateMarkup();
    this.clear();
    this.parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  clear() {
    this.parentElement.innerHTML = '';
  }

  renderServerError(error) {
    alert(`${error.status} ${error.statusText}`);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <p>${message}</p>
      </div>
    `
    this.clear();
    this.parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}