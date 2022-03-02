class View {
  render(data) {
    if (Array.isArray(data) && data.length === 0) {
      this.renderError();
      return;
    }

    console.log(data);
    this.data = data;
    const markup = this._generateMarkup();
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

export class SearchBarView {
  constructor() {
    this.parentElement = document.querySelector('.actionBar');
  }

  resetInput() {
    this.parentElement.querySelector('#searchBox').value = '';
  }

  getInput() {
    const input = this.parentElement.querySelector('#searchBox').value;
    return input;
  }

  addHandlerSearch(handler) {
    this.parentElement.addEventListener('input', function(event) {
      handler();
    })
  }
}


export class ContactListView extends View {
  constructor() {
    super()
    this.parentElement = document.querySelector('#contactsList');
    this._errorMessage = `There are no contacts!`
  }

  // render(data) {
  //   this.data = data;
  //   const markup = this._generateMarkup();
  //   this.clear();
  //   this.parentElement.insertAdjacentHTML('afterbegin', markup);
  // }

  // clear() {
  //   this.parentElement.innerHTML = '';
  // }

  renderNotFound() {
    this.clear();
    const contactsNotFoundTemplate = Handlebars.compile(document.getElementById('contactsNotFound').innerHTML);
    this.parentElement.insertAdjacentHTML("beforeend", contactsNotFoundTemplate());
  }

  _generateMarkup() {
    Handlebars.registerPartial('tag', document.getElementById('tag').innerHTML);
    this.contactsTemplate = Handlebars.compile(document.getElementById('contacts').innerHTML);
    return this.contactsTemplate({ contacts : this.data });
  }
}

export class FormView extends View {
  constructor() {
    super()
    this.parentElement = document.querySelector('#contactForm');
    this._errorMessage = `Something went wrong while trying to get your contact. Please try again!`
  }

  // render(data) {
  //   this.data = data;
  //   const markup = this._generateMarkup();
  //   this.clear();
  //   this.parentElement.insertAdjacentHTML('afterbegin', markup);
  // }

  // clear() {
  //   this.parentElement.innerHTML = '';
  // }

  renderErrorMessage(error) {
    alert(`${error.status} ${error.statusText}`);
  }

  getInput() {
    const form = this.parentElement.querySelector('form');
    const formData = new FormData(form);
    return formData;
  }

  getInputInJSON() {
    const json = this.formDatatoJson(this.getInput());
    return JSON.stringify(json);
  }

  formDatatoJson(formData) {
    const json = {};
  
    for (const pair of formData.entries()) {
      json[pair[0]] = pair[1];
    }
    return json;
  }

  addHandlerForm(handler) {
    this.parentElement.addEventListener('submit', (event) => {
      event.preventDefault();
      let button = event.target.querySelector('[type="submit"]');
      let contactID = event.target.getAttribute('data-id');
      handler(button.id, contactID);
    });
  }

  _generateMarkup() {
    Handlebars.registerHelper('isdefined', value => {
      return value !== undefined;
    });

    this.formTemplate = Handlebars.compile(document.getElementById('form').innerHTML);

    if (this.data) {
      const contact = data;
      return this.formTemplate(contact);
    } else {
      return this.formTemplate();
    }
  }
}

export class ButtonView {
  bindButton(buttonID, handler) {
    document.addEventListener('click', event => {
      if (event.target.id === buttonID) {
        event.preventDefault();
        handler();
      }
    })
  }

  bindEditContactButton(handler) {
    document.addEventListener('click', event => {
      if (event.target.id === 'editBtn') {
        event.preventDefault();
        let contactID = event.target.closest('li').getAttribute('data-id');
        handler(contactID);
      }
    })
  }

  bindDeleteContactButton(handler) {
    document.addEventListener('click', event => {
      if (event.target.id === 'deleteBtn') {
        event.preventDefault();
        let ok = confirm('Are you sure you want to delete?');
        let contactID = event.target.closest('li').getAttribute('data-id');
        handler(ok, contactID);
      }
    })
  }
}
