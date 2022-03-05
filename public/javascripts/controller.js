import model from "./model.js"
import contactListView from './views/contactListView.js';
import formView from './views/formView.js';
import actionBarView from './views/actionBarView.js';
import headerView from './views/headerView.js';

// ================ Controller ================

const displayAllContacts = function() {
  model.getAllContacts().then(function(contacts) {
    contactListView.render(contacts);
  }).catch(error => formView.renderServerError(error));
};

const displaySearchResults = function(input) {
  const pattern = new RegExp("(" + input +")", "gi");

  model.getAllContacts().then(contacts => {
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
  const input = actionBarView.getInput();

  if (!input) {
    displayAllContacts(); 
    return;
  } else {
    displaySearchResults(input);
  }
}

const handleAddNewContact = function() {
  const json = formView.getInputInJSON();

  model.addContact(json).then(() => {
    showHomeView();
  }).catch(error => formView.renderServerError(error));
}

const handleEditExistingContact = function(contactID) {
  const json = formView.getInputInJSON();

  model.editContact(contactID, json).then(() => {
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
  actionBarView.hide();
  formView.render('');
}

const displayEditContactForm = function(contactID) {
  contactListView.clear();
  actionBarView.hide();
  
  model.getContact(contactID).then((contact) => {
    formView.render(contact);
  }).catch(error => {
    formView.renderServerError(error);
  });
} 

const handleDeleteContact = function(ok, contactID) {
  if (ok) {
    model.deleteContact(contactID).then(() => {
      showHomeView();
    }).catch(error => formView.renderServerError(error));
  }
}

const handleCancelForm = function() {
  showHomeView();
}

const showHomeView = function() {
  displayAllContacts();
  actionBarView.show();
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
  actionBarView.bindSearchInput(handleSearchBarInput);
  actionBarView.bindAddContactButton(displayAddContactForm);
  
  formView.bindSubmitButton(handleSubmitContactForm);
  formView.bindCancelButton(handleCancelForm);
  formView.bindEditContactButton(displayEditContactForm);
  formView.bindDeleteContactButton(handleDeleteContact);

  headerView.bindHeaderClick(showHomeView);
}

// ========== initialize app ============

document.addEventListener('DOMContentLoaded', () => {
  init();
});
