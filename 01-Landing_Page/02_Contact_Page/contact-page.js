const ContactUsURL = 'http://localhost:5251/api/ContactUs/Add-ContactUs-Details';

async function AddContactUs(ContactUsDetails){
    await fetch((ContactUsURL),{
        method:'POST',
        headers:{
           "Content-Type": "application/json"
        },
        body:JSON.stringify(ContactUsDetails)
    });
}


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

    AddContactUs(ContactUsDetails)
    event.target.reset();
})