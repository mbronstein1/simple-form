const formEl = document.getElementById('form-control');
const firstNameInputEl = document.getElementById('first-name-input');
const lastNameInputEl = document.getElementById('last-name-input');
const commentsTextEl = document.getElementById('comments');
const newsletterCheckboxEl = document.getElementById('newsletter__checkbox');
const emailContainerEl = document.querySelector('.email');
const emailInputEl = document.getElementById('email-input');
const submitBtnEl = document.getElementById('submit-btn');

let firstNameVal;
let lastNameVal;

const inputValidationHandler = e => {
  if (e.target.name === 'first-name') {
    firstNameVal = e.target.value;
  }
  if (e.target.name === 'last-name') {
    lastNameVal = e.target.value;
  }

  if (firstNameVal?.length > 0 && lastNameVal?.length > 0) {
    submitBtnEl.removeAttribute('disabled');
  } else {
    submitBtnEl.setAttribute('disabled', 'true');
  }

  if (newsletterCheckboxEl.checked) {
    emailContainerEl.style.display = 'block';
  } else {
    emailContainerEl.style.display = 'none';
  }
};

const formValidationHandler = () => {
  let isSubscribed = false;
  let isValidEmail = false;
  if (newsletterCheckboxEl.checked) {
    isSubscribed = true;
  }

  if (emailInputEl.value.match(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/)) {
    isValidEmail = true;
  }

  return firstNameVal.trim() !== '' && lastNameVal.trim() !== '' && commentsTextEl.value.trim() !== '' && (!isSubscribed || (isSubscribed && isValidEmail));
};

const sendData = async data => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application.json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Oops something went wrong');
  }

  const resData = await response.json();
  return resData;
};

const submitFormHandler = async e => {
  e.preventDefault();
  const formData = {
    firstName: firstNameVal,
    lastName: lastNameVal,
    isSubscribed: newsletterCheckboxEl.checked,
    comment: commentsTextEl.value,
  };

  if (formData.isSubscribed) {
    formData.email = emailInputEl.value;
  }

  const pElement = document.createElement('p');

  if (formValidationHandler()) {
    try {
      await sendData(formData);
      console.log(formData);
      pElement.innerHTML = `Thanks for your submission ${formData.firstName}`;
      pElement.style.color = 'green';
      formData.firstName = '';
      formData.lastName = '';
      formData.isSubscribed = false;
      formData.comment = '';
      delete formData.email;
      formEl.reset();
    } catch (err) {
      pElement.innerHTML = err.message;
      pElement.style.color = 'red';
    }
  } else {
    pElement.innerHTML = 'Please fill out all form fields with valid information';
    pElement.style.color = 'red';
  }

  formEl.appendChild(pElement);
  setTimeout(() => {
    formEl.removeChild(pElement);
  }, 2000);
};

formEl.addEventListener('submit', submitFormHandler);
firstNameInputEl.addEventListener('keyup', inputValidationHandler);
lastNameInputEl.addEventListener('keyup', inputValidationHandler);
newsletterCheckboxEl.addEventListener('change', inputValidationHandler);
