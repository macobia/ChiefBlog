document.getElementById('contactForm1').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission
  
    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
  
    // Store form data in localStorage
    const contactData = { name, email, message };
    localStorage.setItem('contactFormData', JSON.stringify(contactData));
  
    // Alert user and reset form
    alert('Thank you for reaching out! Your message has been saved.');
    this.reset();
  });

  // Footer Script to handle form data and success message
 
function saveData(event) {
  event.preventDefault();

  // Get user input values
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const interest = document.getElementById('interest').value;

  // Create an object to store the data
  const subscriber = {
      name: name,
      email: email,
      interest: interest
  };

  // Retrieve existing subscribers from local storage or initialize an empty array
  const subscribers = JSON.parse(localStorage.getItem('subscribers')) || [];

  // Add the new subscriber to the array
  subscribers.push(subscriber);

  // Save updated array to local storage
  localStorage.setItem('subscribers', JSON.stringify(subscribers));

  // Display success message
  document.getElementById('successMessage').style.display = 'block';

  // Clear form
  document.getElementById('newsletterForm').reset();
}