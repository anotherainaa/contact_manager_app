import Model from "./model.js"
import { ContactListView, SearchView } from "./view.js";

// ============== API CALLS ============================

const API = new Model();
const searchView = new SearchView();
const contactListView = new ContactListView();

// ================== RENDERING STUFF ===================

function renderContacts(contacts) {
  Handlebars.registerPartial('tag', document.getElementById('tag').innerHTML);
  let contactsTemplate = Handlebars.compile(document.getElementById('contacts').innerHTML);
  // $('contactList').append(contactsTemplate( { contacts: contacts }));
  document.querySelector('#contactsList').insertAdjacentHTML("beforeend", contactsTemplate( { contacts: contacts }));
}

function renderContactForm(div, contact) {
  let formTemplate = Handlebars.compile(document.getElementById('form').innerHTML);

  Handlebars.registerHelper('isdefined', value => {
    return value !== undefined;
  });

  if (contact) {
    $(div).append(formTemplate(contact));
  } else {
    $(div).append(formTemplate());
  }
}

function renderContactNotFound() {
  let contactsNotFoundTemplate = Handlebars.compile(document.getElementById('contactsNotFound').innerHTML);
  $('#contactsList').append(contactsNotFoundTemplate);
}

// ========== RENDERING UI ==================

const displayContacts = (list) => {
  // if (list) {
  //   [...list.children].forEach(child => child.remove());
  // }
  // API.getAllContacts().then(contacts => renderContacts(contacts)); 
  API.getAllContacts().then(function(contacts) {
    contactListView.render(contacts);
  });
};

function hideContacts(ul) {
  ul.setAttribute('hidden', true);
}

// ========== HELPER FUNCTIONS : DATA SERIALIZER =================


function formDatatoJson(formData) {
  let json = {};

  for (const pair of formData.entries()) {
    json[pair[0]] = pair[1];
  }
  return json;
}

// ============== HANDLEBARS =============================

Handlebars.registerHelper('isdefined', value => {
  return value !== undefined;
});


// ================ The app ============================

document.addEventListener('DOMContentLoaded', () => {
  // Display the contacts

  let ul = document.querySelector('#contactsList');
  displayContacts(ul);
  
  // Add a contact vs edit a contact - Rendering the form
  let formDiv = document.getElementById('contactForm');
  document.addEventListener('click', event => {
    if (event.target.id === 'addBtn') {
      event.preventDefault();
      hideContacts(ul);
      if (!formDiv.contains(document.querySelector('form'))) {
        renderContactForm(formDiv);
      }
    } else if (event.target.id === 'editBtn') {
      event.preventDefault();
      hideContacts(ul);

      let contactID = event.target.closest('li').getAttribute('data-id');
      API.getContact(contactID).then((contact) => {
        console.log(contact);
        if (!formDiv.contains(document.querySelector('form'))) {
          renderContactForm(formDiv, contact);
        }
      });
    }
  });

  // listen for form cancel button, display display contact list - delegate to body
  document.addEventListener('click', event => {
    if (event.target.id === 'cancelBtn') {
      let ul = document.querySelector('#contactsList');
      console.log('Cancel button clicked');
      event.preventDefault();
      ul.removeAttribute('hidden');
      document.querySelector('form').remove();
    }
  })

  // listen for submit form - delegate event
  document.addEventListener('submit', event => {
    event.preventDefault();
    let ul = document.querySelector('#contactsList');
    let form = event.target;
    let button = event.target.querySelector('[type="submit"]');
    let data = new FormData(form);
    let json = JSON.stringify(formDatatoJson(data));

    if (button.id === 'addSubmitBtn') {
      API.addContact(json).catch(error => alert(`${error.status} ${error.statusText}`)); 
    } else if (button.id === 'editSubmitBtn') {
      let contactID = form.getAttribute('data-id');
      API.editContact(contactID, json).catch(error => alert(`${error.status} ${error.statusText}`));
    }

    displayContacts(ul);
    ul.removeAttribute('hidden');
    form.remove();
  })

  // Delete a contact - delegate event to document
  document.addEventListener('click', event => {
    if (event.target.id === 'deleteBtn') {
      event.preventDefault();
      let ok = confirm('Are you sure you want to delete?');
      if (ok) {
        API.deleteContact(event.target.closest('li').getAttribute('data-id'));
        displayContacts(ul);
      }
    }
  })

  handleSearch(document.querySelector('#contactsList'));
  // Search form
  // let searchBox = document.querySelector('#searchBox');
  // // Search form - if empty, render empty contact, else render the search result
  // searchBox.addEventListener('input', event => {
  //   let input = searchBox.value;
  //   let pattern = new RegExp("(" + input +")", "gi");

  //   if (input === '') {
  //     displayContacts(ul);
  //   } else {
  //     API.getAllContacts().then(contacts => {
  //       let filteredContacts = contacts.filter(contact => {

  //         return matchingName(contact, pattern) || matchingTag(contact, pattern);
  //       });
  
  //       [...ul.children].forEach(child => child.remove());
  //       if (filteredContacts.length === 0) {
  //         // render no contacts with that name
  //         renderContactNotFound();
  //       } else {
  //         renderContacts(filteredContacts);
  //       }
  //     });
  //   }
  // })
});

const handleSearch = function(ul) {
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
        // renderContactNotFound();
        contactListView.renderNotFound();
      } else {
        // renderContacts(filteredContacts);
        contactListView.render(filteredContacts);
      }
    });
  }
}

const init = function() {
  searchView.addHandlerSearch(handleSearch);
}

init();

  // load search results

  // render results

function matchingName(contact, regex) {
  return contact.full_name.match(regex);
}

function matchingTag(contact, regex) {
  return (contact.tags ? contact.tags.some(contact => contact.match(regex)) : false);
}
