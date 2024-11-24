
// function for email validation
function isValidEmail(email){
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailPattern.test(email)
}

// function for password validation
const isValidPassword = (password) =>{
    return password.length >= 8
}
// Register
const registerForm = document.getElementById('registerForm')
const registerError = document.getElementById('registerError')

if(registerForm){
    registerForm.addEventListener('submit', (event) => {
        event.preventDefault()
   

    const fullname = document.getElementById('full-name').value.trim()
    const email = document.getElementById('email').value.trim()
    const password = document.getElementById('password').value
    const confirmPassword = document.getElementById('confirmPassword').value
 
    // Basic Validation for Sign up

    if( !fullname || !email || !password || !confirmPassword){
        registerError.textContent = 'All fields are required'
        return
    }
    if(!isValidEmail){
        registerError.textContent ='Please enter a valid email address'
        return
    }
    if(!isValidPassword){
        registerError.textContent = 'Password must be at least 8 charcters long'
        return
    }
    if(password !== confirmPassword){
        registerError.textContent = 'Password do not match'
        return
    }

    const user = {fullname, email, password}                    //gets the data from the user as an object
    localStorage.setItem('registeredUser', JSON.stringify(user))    //stores the data on a local storage  
    
    alert('Registration successful Login')
    window.location.href = 'login.html'

})
}

// Login
const loginForm = document.getElementById('loginForm')
const loginError = document.getElementById('loginError')

if(loginForm){
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault()
        
        const email = document.getElementById('loginEmail').value.trim()
        const password = document.getElementById('loginPassword').value.trim()

        //Basic Validation
        if(!email || !password){
            loginError.textContent = 'All fields are required'
            return
        }

        if(!isValidEmail){
            loginError.textContent = 'Please enter a valid email address'
            return
        }
        const registeredUser = JSON.parse(localStorage.getItem('registeredUser'))
        if(!registeredUser || registeredUser.email !== email || registeredUser.password !==password){
            loginError.textContent = 'Invalid email or password'
            return
        }
        localStorage.setItem('authenticatedUser', 'true')
        window.location.href = 'home.html'
    })
}

