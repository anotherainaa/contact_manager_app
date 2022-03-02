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


export class ContactListView {
  constructor() {
    this.parentElement = document.querySelector('#contactsList');
    this.generateTemplate();
  }

  render(data) {
    this.clear();
    this.parentElement.insertAdjacentHTML("beforeend", this.contactsTemplate( { contacts: data }))
  }

  renderNotFound() {
    this.clear();
    const contactsNotFoundTemplate = Handlebars.compile(document.getElementById('contactsNotFound').innerHTML);
    this.parentElement.insertAdjacentHTML("beforeend", contactsNotFoundTemplate());
  }

  clear() {
    this.parentElement.innerHTML = '';
  }

  generateTemplate() {
    Handlebars.registerPartial('tag', document.getElementById('tag').innerHTML);
    this.contactsTemplate = Handlebars.compile(document.getElementById('contacts').innerHTML);
  }
}

export class FormView {
  constructor() {
    this.parentElement = document.querySelector('#contactForm');
    this.generateTemplate();
  }

  render(data) {
    this.clear();
    if (data) {
      const contact = data;
      this.parentElement.insertAdjacentHTML("beforeend", this.formTemplate(contact));
    } else {
      this.parentElement.insertAdjacentHTML("beforeend", this.formTemplate());
    }
  }

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

  clear() {
    this.parentElement.innerHTML = '';
  }

  addHandlerForm(handler) {
    this.parentElement.addEventListener('submit', (event) => {
      event.preventDefault();
      let button = event.target.querySelector('[type="submit"]');
      let contactID = event.target.getAttribute('data-id');
      handler(button.id, contactID);
    });
  }

  generateTemplate() {
    Handlebars.registerHelper('isdefined', value => {
      return value !== undefined;
    });

    this.formTemplate = Handlebars.compile(document.getElementById('form').innerHTML);
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
