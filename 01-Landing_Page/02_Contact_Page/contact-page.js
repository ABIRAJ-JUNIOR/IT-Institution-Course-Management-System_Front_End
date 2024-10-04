const ContactUsDetails = JSON.parse(localStorage.getItem('ContactUs')) || [];

document.getElementById('contactUsForm').addEventListener("submit" , (event)=>{
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const today = new Date();
    let id = Number(Math.floor(Math.random()*1000000))

    const ContactUsDetails = {
        id,
        name,
        email,
        message,
        submitDate:today
    }

    ContactUsDetails.push(ContactUsDetails);
    localStorage.setItem('ContactUs', JSON.stringify(ContactUsDetails));
    
    event.target.reset();
})