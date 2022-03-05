class Model {
  convertTagsIntoArray(contact) {
    contact.tags = contact.tags ? contact.tags.split(',') : contact.tags;
  }

  getAllContacts() {
    let self = this;
    return new Promise(function(resolve, reject) {
      let request = new XMLHttpRequest();
      request.open('GET', "http://localhost:3000/api/contacts");
      request.responseType = 'json';
    
      request.addEventListener('load', event => {
        if (request.status === 200) {
          let contacts = request.response;
          contacts.forEach(contact => {
            self.convertTagsIntoArray(contact);
          });
          resolve(contacts);
        } else {
          reject({
            status: request.status,
            statusText: request.statusText,
          });
        }
      });
      request.send();
    });
  }

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
  }

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
  }

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
  }

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
  }
}

export default new Model();