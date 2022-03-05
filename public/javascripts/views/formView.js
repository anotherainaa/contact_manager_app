import View from './view.js'

class FormView extends View {
  constructor() {
    super()
    this.parentElement = document.querySelector('#contactForm');
    this._errorMessage = `Something went wrong while trying to get your contact. Please try again!`
  }

  bindCancelButton(handler) {
    this.parentElement.addEventListener('click', event => {
      if (event.target.id === 'cancelBtn') {
        event.preventDefault();
        handler();
      }
    });
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

  validName(input) {
    return input.trim() !== '';
  }

  validPhone(input) {
    return input.trim() !== '';
  }

  validEmail(input) {
    return input.trim() !== '';
  }

  displayValidations(validations) {
    validations.forEach((valid, index) => {
      if (valid) {
        this.validationTexts[index].classList.add('hide');
        this.inputs[index].classList.remove('has-error');
      } else {
        this.validationTexts[index].classList.remove('hide');
        this.inputs[index].classList.add('has-error');
      }
    })
  }

  validateForm() {
    this.inputs = [...this.parentElement.querySelectorAll('.form-input')].slice(0, 3);
    this.validationTexts = this.parentElement.querySelectorAll('.validation-text');

    const validations = this.inputs.map(input => {
      if (input.name === "full_name") {
        return this.validName(input.value);
      } else if (input.name === 'phone_number') {
        return this.validPhone(input.value);
      } else if (input.name === 'email') {
        return this.validEmail(input.value); 
      }
    })

    this.displayValidations(validations);
    this.validForm = validations.every(validation => validation);
  }

  resetForm() {
    this.validationTexts.forEach(text => text.classList.remove('hide'));
    this.inputs.forEach(input => input.classList.add('has-error'));
    this.validForm = false;
  }

  // allValuesValid() {
  //   const inputs = [...this.parentElement.querySelectorAll('.form-input')].slice(0, 3);
  //   const validationTexts = this.parentElement.querySelectorAll('.validation-text');

  //   let validations = inputs.map(input => {
  //     if (input.name === "full_name") {
  //       return this.validName(input.value);
  //     } else if (input.name === 'phone_number') {
  //       return this.validPhone(input.value);
  //     } else if (input.name === 'email') {
  //       return this.validEmail(input.value); 
  //     }
  //   })
    
  //   validations.forEach((valid, index) => {
  //     if (valid) {
  //       validationTexts[index].classList.add('hide');
  //       inputs[index].classList.remove('has-error');
  //     } else {
  //       validationTexts[index].classList.remove('hide');
  //       inputs[index].classList.add('has-error');
  //     }
  //   })

  //   return validations.every(validation => validation);
  // }

  formDatatoJson(formData) {
    const json = {};
  
    for (const pair of formData.entries()) {
      json[pair[0]] = pair[1];
    }
    return json;
  }

  bindSubmitButton(handler) {
    this.parentElement.addEventListener('submit', (event) => {
      event.preventDefault();
      this.validateForm();

      const button = event.target.querySelector('[type="submit"]');
      if (button.id === 'addSubmitBtn') {
        if (this.validForm) {
          handler();
          this.resetForm();
        }
      } else if (button.id === 'editSubmitBtn') {
        if (this.validForm) {
          let contactID = event.target.getAttribute('data-id');
          handler(contactID);
          this.resetForm();
        }
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
        let ok = confirm('Are you sure you want to delete this contact?');
        let contactID = event.target.closest('li').getAttribute('data-id');
        handler(ok, contactID);
      }
    })
  }

  generateMarkup() {
    Handlebars.registerHelper('isdefined', value => {
      return value !== undefined;
    });

    this.formTemplate = Handlebars.compile(document.getElementById('form').innerHTML);

    if (this.data) {
      const contact = this.data;
      return this.formTemplate(contact);
    } else {
      return this.formTemplate();
    }
  }
}

export default new FormView();