function renderContactList(contactsList, contact) {
  let li = document.createElement('li');
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

  let editButton = document.createElement('a');
  let editButtonText = document.createTextNode('Edit');
  editButton.appendChild(editButtonText);
  editButton.href = `/api/contacts/${contact.id}`;
  editButton.classList.add('edit-contact');
  editButton.classList.add('btn');
  li.appendChild(editButton);

  let deleteButton = document.createElement('a');
  let deleteButtonText = document.createTextNode('Delete');
  deleteButton.appendChild(deleteButtonText);
  deleteButton.href = `/api/contacts/${contact.id}`;
  deleteButton.classList.add('delete-contact');
  deleteButton.classList.add('btn');
  li.appendChild(deleteButton);

  contactsList.appendChild(li);
};

function renderContactForm(div, contact) {
  let form = document.createElement('form');

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



document.addEventListener('DOMContentLoaded', () => {
  // Display the contacts

  let ul = document.querySelector('ul');

  const displayContacts = ((ul) => {
    [...ul.children].forEach(child => child.remove());
    let request = new XMLHttpRequest();
    request.open('GET', "http://localhost:3000/api/contacts");
    request.responseType = 'json';
  
    request.addEventListener('load', event => {
      let contacts = request.response; // an array of objects representing contacts
      // iterate contacts, for each contact, render the contact as a list
      contacts.forEach(contact => {
        renderContactList(ul, contact);
      });
    });
    request.send();
  })(ul);

  // let ul = document.querySelector('ul');
  // let request = new XMLHttpRequest();
  // request.open('GET', "http://localhost:3000/api/contacts");
  // request.responseType = 'json';

  // request.addEventListener('load', event => {
  //   let contacts = request.response; // an array of objects representing contacts
  //   // iterate contacts, for each contact, render the contact as a list
  //   contacts.forEach(contact => {
  //     renderContactList(ul, contact);
  //   });
  // });
  // request.send();

  // Save a new contact

  let formDiv = document.getElementById('contact_form');
  let button = document.getElementById('add_contact');

  button.addEventListener('click', event => {
    console.log('cancelbutton clicked')
    event.preventDefault();
    // hide the contacts list
    ul.setAttribute('hidden', true);
    // render the form?
    let addContactForm = document.querySelector('form');
    if (!formDiv.contains(addContactForm)) {
      renderContactForm(formDiv);
    }

    // listen for submit form
    let form = document.querySelector('form');
    form.addEventListener('submit', event => {
      event.preventDefault();
      console.log('Add Submit clicked');

      let xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:3000/api/contacts/');
      xhr.setRequestHeader('Content-Type', 'application/json');

      function formDatatoJson(formData) {
        let json = {};
  
        for (const pair of formData.entries()) {
          json[pair[0]] = pair[1];
        }
        return json;
      }

      let data = new FormData(form);
      let json = JSON.stringify(formDatatoJson(data));

      xhr.addEventListener('load', event => {
        // if fail
        if (xhr.status === 400) {
          alert(`Failed: ${xhr.status}. Please try again!`);
        }

        // regardless of fail or success, display contacts
        displayContacts;
        // let ul = document.querySelector('ul');
        // [...ul.children].forEach(child => child.remove());
        
        // let request = new XMLHttpRequest();
        // request.open('GET', "http://localhost:3000/api/contacts");
        // request.responseType = 'json';
      
        // request.addEventListener('load', event => {
        //   let contacts = request.response; // an array of objects representing contacts
        //   // iterate contacts, for each contact, render the contact as a list
        //   contacts.forEach(contact => {
        //     renderContactList(ul, contact);
        //   });
        // });

        ul.removeAttribute('hidden');
        document.querySelector('form').remove();

        request.send(); 
      })

      xhr.send(json);
    })

    // listen for cancel button, display display contact list
    let cancelButton = document.querySelector('#cancelBtn');
    cancelButton.addEventListener('click', event => {
      console.log('Cancel button clicked');
      event.preventDefault();
      ul.removeAttribute('hidden');
      document.querySelector('form').remove();
    })
  });

  // Edit a contact

  ul.addEventListener('click', event => {
    if (event.target.tagName === 'A' && event.target.classList.contains('edit-contact')) {
      event.preventDefault();
      console.log('Edit button clicked');

      let editURL = event.target.href;
      let request = new XMLHttpRequest();
      request.open('GET', event.target.href);
      request.responseType = 'json';
    
      request.addEventListener('load', event => { 
        let contact = request.response;
        // hide the contacts list
        ul.setAttribute('hidden', true);
        // render the form with contact data
        let addContactForm = document.querySelector('form');
        if (!formDiv.contains(addContactForm)) {
          renderContactForm(formDiv, contact);
        }

        let form = document.querySelector('form');
        form.addEventListener('submit', event => {
          event.preventDefault();
          console.log('Submit clicked');

          let xhr = new XMLHttpRequest();
          xhr.open('PUT', editURL);
          xhr.setRequestHeader('Content-Type', 'application/json');

          function formDatatoJson(formData) {
            let json = {};
      
            for (const pair of formData.entries()) {
              json[pair[0]] = pair[1];
            }
            return json;
          }
    
          let data = new FormData(form);
          let json = JSON.stringify(formDatatoJson(data));

          xhr.addEventListener('load', event => {
            // if failed
            if (xhr.status === 400) {
              alert(`Failed: ${xhr.status}. Please try again!`);
            }

            // re-render the contacts list
            let ul = document.querySelector('ul');
            [...ul.children].forEach(child => child.remove());
            
            let request = new XMLHttpRequest();
            request.open('GET', "http://localhost:3000/api/contacts");
            request.responseType = 'json';
          
            request.addEventListener('load', event => {
              let contacts = request.response; // an array of objects representing contacts
              // iterate contacts, for each contact, render the contact as a list
              contacts.forEach(contact => {
                renderContactList(ul, contact);
              });
            });

            ul.removeAttribute('hidden');
            document.querySelector('form').remove();

            request.send();
          })

          xhr.send(json);
        });

        let cancelButton = document.querySelector('#cancelBtn');
        cancelButton.addEventListener('click', event => {
          console.log('Cancel button clicked');
          event.preventDefault();
          ul.removeAttribute('hidden');
          document.querySelector('form').remove();
        });
      })

      request.send();
    }
  })

  // Delete a contact

  ul.addEventListener('click', event => {
    if (event.target.tagName === 'A' && event.target.classList.contains('delete-contact')) {
      event.preventDefault();
      console.log('Delete button clicked');
      // Display a confirmation model with ok and cancel
      alert('Are you sure you want to delete?')

      // if ok clicked 
      // send delete request

      let request = new XMLHttpRequest();
      request.open('DELETE', event.target.href);

      request.addEventListener('load', event => {
        // if failed
        if (request.status === 400) {
          alert(`Failed: ${request.status}. Please try again!`);
        }

        // re-render the contacts list
        let ul = document.querySelector('ul');
        [...ul.children].forEach(child => child.remove());
        
        let xhr = new XMLHttpRequest();
        xhr.open('GET', "http://localhost:3000/api/contacts");
        xhr.responseType = 'json';
      
        xhr.addEventListener('load', event => {
          let contacts = xhr.response; // an array of objects representing contacts
          // iterate contacts, for each contact, render the contact as a list
          contacts.forEach(contact => {
            renderContactList(ul, contact);
          });
        });

        xhr.send();
      })

      request.send();
    }
  })
});


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
