import Model from "./model.js"
// ============== API CALLS ============================

const API = new Model();

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

function renderContactForm(div, contact = undefined) {
  let formTemplate = Handlebars.compile(document.getElementById('form').innerHTML);

  Handlebars.registerHelper('isdefined', value => {
    return value !== undefined;
  });

  $('body').append(formTemplate(contact));
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

// ============== HANDLEBARS =============================

Handlebars.registerHelper('isdefined', value => {
  return value !== undefined;
});

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
      let contactID = form.getAttribute('data-id');
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