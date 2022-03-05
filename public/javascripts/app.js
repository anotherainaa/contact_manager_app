import Model from "./model.js"
import { ContactListView, SearchBarView, FormView, HeaderView } from "./view.js";

// ============== Model and View instantiation ==========

const API = new Model();
const searchBarView = new SearchBarView();
const contactListView = new ContactListView();
const formView = new FormView();
const headerView = new HeaderView();

// ================ The app ==========================

document.addEventListener('DOMContentLoaded', () => {
  init();
});

const displayAllContacts = function() {
  API.getAllContacts().then(function(contacts) {
    contactListView.render(contacts);
  }).catch(error => formView.renderServerError(error));
};

const displaySearchResults = function(input) {
  const pattern = new RegExp("(" + input +")", "gi");

  API.getAllContacts().then(contacts => {
    const filteredContacts = contacts.filter(contact => {
      return matchingName(contact, pattern) || matchingTag(contact, pattern);
    });

    if (filteredContacts.length === 0) {
      contactListView.renderError(`Couldn't find any contacts or tags matching ${input}`);
    } else {
      contactListView.render(filteredContacts);
    }
  }).catch(error => formView.renderServerError(error));
}

const handleSearchBarInput = function() {
  const input = searchBarView.getInput();

  if (!input) {
    displayAllContacts(); 
    return;
  } else {
    displaySearchResults(input);
  }
}

const handleAddNewContact = function() {
  const json = formView.getInputInJSON();

  API.addContact(json).then(() => {
    showHomeView();
  }).catch(error => formView.renderServerError(error));
}

const handleEditExistingContact = function(contactID) {
  const json = formView.getInputInJSON();

  API.editContact(contactID, json).then(() => {
    showHomeView();;
  }).catch(error => formView.renderServerError(error));
}

const handleSubmitContactForm = function(contactID) {
  if (contactID) {
    handleEditExistingContact(contactID);
  } else {
    handleAddNewContact();
  }
}

const displayAddContactForm = function() {
  contactListView.clear();
  searchBarView.hide();
  formView.render('');
}

const displayEditContactForm = function(contactID) {
  contactListView.clear();
  searchBarView.hide();
  
  API.getContact(contactID).then((contact) => {
    formView.render(contact);
  }).catch(error => {
    formView.renderServerError(error);
  });
} 

const handleDeleteContact = function(ok, contactID) {
  if (ok) {
    API.deleteContact(contactID).then(() => {
      showHomeView();
    }).catch(error => formView.renderServerError(error));
  }
}

const handleCancelForm = function() {
  showHomeView();
}

const showHomeView = function() {
  displayAllContacts();
  searchBarView.show();
  formView.clear();
}

const matchingName = function(contact, regex) {
  return contact.full_name.match(regex);
}

const matchingTag = function(contact, regex) {
  return (contact.tags ? contact.tags.some(contact => contact.match(regex)) : false);
}

const init = function() {
  showHomeView();
  
  // binding events
  searchBarView.bindSearchInput(handleSearchBarInput);
  searchBarView.bindAddContactButton(displayAddContactForm);
  
  formView.bindSubmitButton(handleSubmitContactForm);
  formView.bindCancelButton(handleCancelForm);
  formView.bindEditContactButton(displayEditContactForm);
  formView.bindDeleteContactButton(handleDeleteContact);

  headerView.bindHeaderClick(showHomeView);
}
