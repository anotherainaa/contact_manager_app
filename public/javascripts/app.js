import Model from "./model.js"
import { ContactListView, SearchBarView, FormView, ButtonView } from "./view.js";

// ============== Model and View instantiation ==========

const API = new Model();
const searchView = new SearchBarView();
const contactListView = new ContactListView();
const formView = new FormView();
const buttonView = new ButtonView();

// ================ The app ==========================

document.addEventListener('DOMContentLoaded', () => {
  init();
});

// ================== controller ===============================

const displayContacts = () => {
  API.getAllContacts().then(function(contacts) {
    contactListView.render(contacts);
  });
};

const handleSearch = function() {
  // get search query
  const input = searchView.getInput();
  const pattern = new RegExp("(" + input +")", "gi");

  if (!input) {
    displayContacts(); 
    return;
  } else {
    API.getAllContacts().then(contacts => {
      let filteredContacts = contacts.filter(contact => {
        return matchingName(contact, pattern) || matchingTag(contact, pattern);
      });

      if (filteredContacts.length === 0) {
        // render no contacts with that name
        contactListView.renderNotFound();
      } else {
        // renderContacts(filteredContacts);
        contactListView.render(filteredContacts);
      }
    });
  }
}

// ============== form helper function

const handleSubmitContact = function(buttonId, contactID) {
  // get data 
  const json = formView.getInputInJSON();

  // call the right api
  let response;
  if (buttonId === 'addSubmitBtn') {
    response = API.addContact(json);
    // do form validation
  } else if (buttonId === 'editSubmitBtn') {
    response = API.editContact(contactID, json);
    // do form validation
  }

   // render success or catch errors
  response.then(() => {
    displayContacts();
    formView.clear();
  }).catch(error => formView.renderErrorMessage(error));
}; 

const handleAddContactForm = function() {
  contactListView.clear();
  formView.render();
}

const handleEditContactForm = function(contactID) {
  contactListView.clear();
  
  API.getContact(contactID).then((contact) => {
    formView.render(contact);
  });
} 

const handleCancelForm = function() {
  displayContacts();
  formView.clear();
}

const handleDeleteContact = function(ok, contactID) {
  if (ok) {
    API.deleteContact(contactID).then(() => {
      displayContacts();
    }).catch(error => formView.renderErrorMessage(error));

  }
}


// ============ Search bar query helper function ================

function matchingName(contact, regex) {
  return contact.full_name.match(regex);
}

function matchingTag(contact, regex) {
  return (contact.tags ? contact.tags.some(contact => contact.match(regex)) : false);
}

// =========== Controller Init and Binding Event Handlers ========================

const init = function() {
  // display contacts
  displayContacts();
  
  // binding events
  searchView.addHandlerSearch(handleSearch);
  formView.addHandlerForm(handleSubmitContact);

  // bind button events
  buttonView.bindButton('addBtn', handleAddContactForm);
  buttonView.bindButton('cancelBtn', handleCancelForm);
  buttonView.bindEditContactButton(handleEditContactForm);
  buttonView.bindDeleteContactButton(handleDeleteContact);
}


