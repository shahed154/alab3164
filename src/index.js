
// registration 
const registrationForm = document.getElementById("registration")

const registerUsername = document.getElementsByName("username")[0];
const email = document.getElementsByName("email")[0];
const password = document.getElementsByName("password")[0];
const passwordCheck = document.getElementsByName("passwordCheck")[0];
const termsCheckbox = document.getElementsByName("terms")[0]
//login 

const loginForm = document.getElementById("login")

const loginUsername = document.getElementsByName("username")[1];
const loginPassword = document.getElementsByName("password")[1];
const loggedinCheckbox = document.getElementsByName("persist")[0];

const errorDisplay = document.getElementById('errorDisplay');

// button listener

registrationForm.addEventListener('submit', checkRegistration);
loginForm.addEventListener('submit', checkLogin);

//


////// ======== PART 3 ========= ///////

function checkRegistration(event)
 {
    event.preventDefault()
    
    // Get form field values
    const username = registerUsername.value
    const emailValue = email.value
    const passwordValue = password.value
    const repeatPassword = passwordCheck.value
    const termsAccepted = termsCheckbox.checked
    

    if (!validateUsername(username, registerUsername)) {
        return false
    }
    //

    if (!validateEmail(emailValue, email)) {
        return false
    }
    

    if (!validatePassword(passwordValue, username, password)) {
        return false;
    }
    

    if (passwordValue !== repeatPassword) {
        displayError('passwords need to match!', passwordCheck);
        return false;
    }
    
//


    if (termsAccepted) 
        {}
    else{
        displayError('you have to agree to terms of use!', termsCheckbox)
        return false;
    }

    

    storeUserData(username.toLowerCase(), emailValue.toLowerCase(), passwordValue);
    
    
    registrationForm.reset();
    
   
    displaySuccess('Registration successful! You can now log in.');
    
    return true;
}
//1

// Registration Form - Username Validation:
// The username cannot be blank.
// The username must be at least four characters long.
// The username must contain at least two unique characters.
// The username cannot contain any special characters or whitespace.

function validateUsername(username, inputElement) 

{
    if (!username) {
        displayError('The username cannot be blank.', inputElement);
        return false;
    }
 
    if (username.length < 4)
         {
        displayError(' The username must be at least four characters long.', inputElement);
    
        return false;
    }
    
 

    const uniqueChars = new Set(username.split('')).size;
    if (uniqueChars < 2) {
        displayError('The username must contain at least two unique characters.', inputElement);
        return false;
    }

    
    if (!/^[a-z-0-9]+$/.test(username)) {
        displayError('The username cannot contain any special characters or whitespace.', inputElement);
        return false;
    }
  
    if (isUsernameTaken(username)) 
        {
        displayError('That username is already taken.', inputElement);
        return false;
    }

    
    return true;
}
//2
// Registration Form - Email Validation:
// The email must be a valid email address.
// The email must not be from the domain "example.com."

function validateEmail(email, inputElement) {
//https://uibakery.io/regex-library/email  i just took regex from this website idk if this allowed but i gaveup

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {

        displayError('The email must be a valid email address.', inputElement);
        return false;
    }
    

    
    if (email.toLowerCase().endsWith('@example.com')) {
        displayError('The email must not be from the domain "example.com."', inputElement);
        
        return false;
    }
    
    return true;
}
//3
// Registration Form - Password Validation:
// Passwords must be at least 12 characters long.
// Passwords must have at least one uppercase and one lowercase letter.
// Passwords must contain at least one number.
// Passwords must contain at least one special character.
// Passwords cannot contain the word "password" (uppercase, lowercase, or mixed).
// Passwords cannot contain the username.
// Both passwords must match.
//
function validatePassword(password, username, inputElement) 

{
  
    if (password.length < 12) {
        displayError(' Passwords must be at least 12 characters long.', inputElement)
        return false;
    }



    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) 
        {
        displayError('Passwords must have at least one uppercase and one lowercase letter.', inputElement);
      
        return false;
    }
 

    if (!/\d/.test(password))
         {
        displayError('Passwords must contain at least one number.', inputElement);
        return false;
    }
    
    // https://stackoverflow.com/questions/32311081/check-for-special-characters-in-string i just used this
    if (! /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) {
       
        displayError(' Passwords must contain at least one special character.', inputElement);
        return false;
    }
    
    if (password.toLowerCase().includes('password')) {
        displayError('Passwords cannot contain the word "password".', inputElement);
        return false;
    }
    
    if (username && password.toLowerCase().includes(username.toLowerCase())) {
       
        displayError('Passwords cannot contain the username.', inputElement);
        return false;
    }
    
    return true;



}

// 5 //i  didnt really undferstand this i just copied a youtube video
function storeUserData(username, email, password) {
    const users = getUsersFromStorage();
    
    
    users.push({
        username,
        email,
        password
    });
    
    localStorage.setItem('users', JSON.stringify(users));
}

function getUsersFromStorage() {

    const usersJSON = localStorage.getItem('users');
    return usersJSON ? JSON.parse(usersJSON) : [];
}

function isUsernameTaken(username) {
    const users = getUsersFromStorage();
    return users.some(user => user.username === username.toLowerCase());
}

////////// =====PART 4 ========= ///////

function checkLogin(event) {
    event.preventDefault();
 
    const username = loginUsername.value;

    const passwordValue = loginPassword.value;

    const keepLoggedIn = loggedinCheckbox.checked;
    

    if (!username) {
        displayError('The username cannot be blank.', loginUsername)
        return false;
    }
    
    if (!passwordValue) {
        displayError('The password cannot be blank.', loginPassword);
        return false;
    }
    
    
    const usersArray = getUsersFromStorage();

    const user = usersArray.find(u => u.username === username.toLowerCase());
    
    if (!user) {
        displayError('The username must exist.', loginUsername);
        return false;
    }
    
    if (user.password !== passwordValue) {
        displayError('The password must be correct.', loginPassword);
        return false;
    }
    
    //
    loginForm.reset();
    
    let successMessage;
    if (keepLoggedIn) {
        successMessage = 'Login successful! You will stay logged in.';
        
    } else 
    {
        successMessage = 'Login successful!';
    }
    
    displaySuccess(successMessage);
    
    return true;
}


// error/sucess displays


function displayError(message, inputElement) {
    errorDisplay.textContent = message;
    errorDisplay.style.display = 'block'

    errorDisplay.style.backgroundColor = '#fcc';
    errorDisplay.style.color = 'red';
    
    if (inputElement) {
        inputElement.focus();
    }
}

function displaySuccess(message) {
    errorDisplay.textContent = message;
    errorDisplay.style.display = 'block'

    errorDisplay.style.backgroundColor = '#cfc';
    errorDisplay.style.color = 'green';
}