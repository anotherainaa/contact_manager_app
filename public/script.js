// ============== API CALLS ============================

const API = {
  getAllContacts() {
    return new Promise(function(resolve, reject) {
      let request = new XMLHttpRequest();
      request.open('GET', "http://localhost:3000/api/contacts");
      request.responseType = 'json';
    
      request.addEventListener('load', event => {
        if (request.status === 200) {
          resolve(request.response);
        } else {
          reject({
            status: request.status,
            statusText: request.statusText,
          });
        }
      });
      request.send();
    });
    
    // # Async / await way
    // let contacts = await fetch("/api/contacts").then(res => res.json());
    // return contacts;
    // Question, can I use responseType with async/await, if so how?
  },
  addContact(contact) {
    return new Promise(function(resolve, reject) {
      let request = new XMLHttpRequest();
      request.open('POST', '/api/contacts/');
      request.setRequestHeader('Content-Type', 'application/json');

      request.addEventListener('load', event => {
        if (request.status === 201) {
          resolve(JSON.parse(request.response));
        }
        else if (request.status === 400) {
          reject({
            status: request.status,
            statusText: request.statusText,
          });
        }
      })

      request.send(contact);
    })
  },

  deleteContact(contactID) {
    return new Promise(function(resolve, reject) {
      let request = new XMLHttpRequest();
      request.open('DELETE', `/api/contacts/${contactID}`);

      request.addEventListener('load', event => {
        if (request.status === 204) {
          resolve({
            status: request.status,
            statusText: request.statusText,
          });
        } else if (request.status === 400) {
          reject({
            status: request.status,
            statusText: request.statusText,
          });
        }
      });
      
      request.send();
    })
  },

  editContact(contactID, updatedData) {
    return new Promise(function(resolve, reject) {
      let request = new XMLHttpRequest();
      request.open('PUT', `/api/contacts/${contactID}`);
      request.setRequestHeader('Content-Type', 'application/json');

      request.addEventListener('load', event => {
        if (request.status === 201) {
          resolve({
            status: request.status,
            statusText: request.statusText,
          })
        } else if (request.status === 400) {
          reject({
            status: request.status,
            statusText: request.statusText,
          });
        }
      });

      request.send(updatedData);
    });
  },

  getContact(contactId) {
    return new Promise(function(resolve, reject) {
      let request = new XMLHttpRequest();
      request.open('GET', `/api/contacts/${contactId}`);
      request.addEventListener('load', event => {
        if (request.status === 200) {
          resolve(JSON.parse(request.response));
        } else {
          reject({
            status: request.status,
            statusText: request.statusText,
          });
        }
      });

      request.send();
    })
  },
}
// ================== RENDERING STUFF ===================

function renderContactList(contactsList, contact) {
  let li = document.createElement('li');
  li.id = contact.id;

  let h3 = document.createElement('h3');
  let nameH3 = document.createTextNode(contact.full_name);
  h3.appendChild(nameH3);
  li.appendChild(h3);

  let detailsDL = document.createElement('dl');

  let phoneNumberDt = document.createElement('dt');
  let phoneNumberDtText = document.createTextNode('Phone Number:');
  phoneNumberDt.appendChild(phoneNumberDtText);

  let phoneNumberDd = document.createElement('dd');
  let phoneNumberDdText = document.createTextNode(contact.phone_number);
  phoneNumberDd.appendChild(phoneNumberDdText);

  let emailDt = document.createElement('dt');
  let emailDtText = document.createTextNode('Email:');
  emailDt.appendChild(emailDtText);

  let emailDd = document.createElement('dd');
  let emailDdText = document.createTextNode(contact.email); 
  emailDd.appendChild(emailDdText);

  detailsDL.appendChild(phoneNumberDt);
  detailsDL.appendChild(phoneNumberDd);
  detailsDL.appendChild(emailDt);
  detailsDL.appendChild(emailDd);
  li.appendChild(detailsDL);

  let editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.id = 'edit-contact';
  editButton.classList.add('btn');
  li.appendChild(editButton);

  let deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.id = 'delete-contact';
  deleteButton.classList.add('btn');
  li.appendChild(deleteButton);

  contactsList.appendChild(li);
};

function renderContactForm(div, contact) {
  let form = document.createElement('form');
  form.id = contact ? contact.id : '';

  let nameLabel = document.createElement('label');
  let nameLabelText = document.createTextNode('Full name:');
  nameLabel.setAttribute('for', 'full_name');
  nameLabel.appendChild(nameLabelText);
  
  let nameInput = document.createElement('input');
  nameInput.setAttribute('type', 'text');
  nameInput.setAttribute('name', 'full_name');
  nameInput.value = contact ? contact.full_name : '';
  
  let emailLabel = document.createElement('label');
  let emailLabelText = document.createTextNode('Email:');
  emailLabel.setAttribute('for', 'email');
  emailLabel.appendChild(emailLabelText);
  
  let emailInput = document.createElement('input');
  emailInput.setAttribute('type', 'email');
  emailInput.setAttribute('name', 'email');
  emailInput.value = contact ? contact.email : '';

  let phoneNumberLabel = document.createElement('label');
  let phoneNumberLabelText = document.createTextNode('Phone Number:');
  phoneNumberLabel.setAttribute('for', 'phone_number');
  phoneNumberLabel.appendChild(phoneNumberLabelText);
  
  let phoneNumberInput = document.createElement('input');
  phoneNumberInput.setAttribute('type', 'tel');
  phoneNumberInput.setAttribute('name', 'phone_number');
  phoneNumberInput.value = contact ? contact.phone_number : '';

  let submitButton = document.createElement('input');
  submitButton.setAttribute('type', 'submit');
  submitButton.id = contact ? 'editSubmitBtn'  : 'addSubmitBtn';

  let cancelButton = document.createElement('button');
  cancelButton.id = 'cancelBtn';
  cancelButton.textContent = 'Cancel';

  form.appendChild(nameLabel);
  form.appendChild(nameInput);
  
  form.appendChild(emailLabel);
  form.appendChild(emailInput);

  form.appendChild(phoneNumberLabel);
  form.appendChild(phoneNumberInput);

  form.appendChild(submitButton);
  form.appendChild(cancelButton);

  div.appendChild(form);
}

// ========== RENDERING UI ==================

const displayContacts = (ul) => {
  [...ul.children].forEach(child => child.remove());
  API.getAllContacts().then(contacts => contacts.forEach(contact => renderContactList(ul, contact))); 
  // Learn how to handle promise error
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

document.addEventListener('DOMContentLoaded', () => {
  // Display the contacts
  let ul = document.querySelector('ul');
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
    } else if (event.target.id === 'edit-contact') {
      event.preventDefault();
      hideContacts(ul);

      let contactID = event.target.closest('li').id;
      API.getContact(contactID).then((contact) => {
        if (!formDiv.contains(document.querySelector('form'))) {
          renderContactForm(formDiv, contact);
        }
      });
    }
  });

    // listen for form cancel button, display display contact list - delegate to body
    document.addEventListener('click', event => {
      if (event.target.id === 'cancelBtn') {
        console.log('Cancel button clicked');
        event.preventDefault();
        ul.removeAttribute('hidden');
        document.querySelector('form').remove();
      }
    })

  // listen for submit form - delegate event
  document.addEventListener('submit', event => {
    event.preventDefault();
    let form = event.target;
    let button = event.target.querySelector('[type="submit"]');
    let data = new FormData(form);
    let json = JSON.stringify(formDatatoJson(data));

    if (button.id === 'addSubmitBtn') {
      API.addContact(json).catch(error => alert(`${error.status} ${error.statusText}`)); 
    } else if (button.id === 'editSubmitBtn') {
      let contactID = form.id;
      API.editContact(contactID, json).catch(error => alert(`${error.status} ${error.statusText}`));
    }

    displayContacts(ul);
    ul.removeAttribute('hidden');
    form.remove();
  })

  // Delete a contact - delegate event to document
  document.addEventListener('click', event => {
    if (event.target.id === 'delete-contact') {
      event.preventDefault();
      let ok = confirm('Are you sure you want to delete?');
      if (ok) {
        API.deleteContact(event.target.closest('li').id).then(() => displayContacts(ul));
      }
    }
  })

  // Search form
  let searchBox = document.querySelector('#searchBox');
  searchBox.addEventListener('keyup', event => {
    let input = searchBox.value;
    let pattern = new RegExp("(" + input +")", "gi");

    API.getAllContacts().then(contacts => {
      let filteredContacts = contacts.filter(contact => {
        return contact.full_name.match(pattern);
      });

      [...ul.children].forEach(child => child.remove());
      if (filteredContacts.length === 0) {
        // render no contacts with that name
        console.log('no contact with that name')
      } else {
        filteredContacts.forEach(contact => {
          renderContactList(ul, contact);
        })
      }
    });
  });

  // Empty search box
  
  searchBox.addEventListener('input', event => {
    if (searchBox.value === '') {
      displayContacts(ul);
    }
  })
});

const Form = {
  createUI() {
    let form = document.createElement('form');
  },

  init(contact) {
    this.state = contact;
    this.createUI();
  }
}

  // [x] Display the contacts
    // [x] make a request to get all contacts
    // [x] iterate through contacts, for each contact render the form. 

// Save a new contact
  // display the form
    // when user clicks on add contact, hide the contacts lists ul
    // render the form
  // when the user submits on the form
    // display validation errors if any
    // display the full contacts list ul again

// Edit a contact
  // when edit button is clicked
  // display the form with selected contact data
    // get the individual contact data
    // render the form with the contact data
  // if submit button clicked, 
    // make a put request 
    // send the new data serialized as json
    // display updated contact list

// Delete a contact
  // when delete button is clicked
  // display a confirmation modal 
  // if ok clicked, send delete request
    // if error, display error
    // re-render contacts

// Search for a contact
  // as soon as a value is input
  // for each time a key is input or deleted
  // if the search box is empty
    // re-render with all contacts 
  // else 
    // send a request to find contacts with the letter 
      // if contacts are empty, display "There is no contacts starting with ss"
      // else if contacts are not empty, re-render the ul with the results
