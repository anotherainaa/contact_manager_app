import View from './view.js'

class ContactListView extends View {
  constructor() {
    super()
    this.parentElement = document.querySelector('#contactsList');
    this._errorMessage = `There are no contacts!`
  }

  renderNotFound() {
    this.clear();
    const contactsNotFoundTemplate = Handlebars.compile(document.getElementById('contactsNotFound').innerHTML);
    this.parentElement.insertAdjacentHTML("beforeend", contactsNotFoundTemplate());
  }

  generateMarkup() {
    Handlebars.registerPartial('tag', document.getElementById('tag').innerHTML);
    this.contactsTemplate = Handlebars.compile(document.getElementById('contacts').innerHTML);
    return this.contactsTemplate({ contacts : this.data });
  }
}

export default new ContactListView()