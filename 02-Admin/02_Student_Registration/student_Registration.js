// Side NaveBar
const toggle = document.querySelector(".fa-bars")
const toggleClose = document.querySelector(".fa-xmark")
const sideNavebar = document.querySelector(".side-navebar")

toggle.addEventListener("click" ,function(){
    sideNavebar.style.right = "0"
})

toggleClose.addEventListener("click" , function(){
    sideNavebar.style.right = "-60%"
})

let students = [];
const GetAllStudentsURL = 'http://localhost:5251/api/Student/Get-All-Students';
async function GetAllStudents(){
    //Fetch Students Data from Database
    fetch(GetAllStudentsURL).then((response) => {
        return response.json();
    }).then((data) => {
        students = data;
        ShowTable();
    })
};
GetAllStudents()

//password Encryption
function encryption(password){
    return btoa(password)
}

// NIC validation function
function validateNic(nic) {
    const nicPattern1 = /^[0-9]{9}[Vv]$/; // 9 numbers and one letter (V or v) at the end
    const nicPattern2 = /^[0-9]{12}$/;    // 12 numbers only
    return nicPattern1.test(nic) || nicPattern2.test(nic);
}

// Phone number validation function
function validatePhone(phone) {
    const phonePattern = /^[0-9]{10}$/;   // 10 digit numbers only
    return phonePattern.test(phone);
}

function validatePassword(password) {
    // Define the rules
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // Check password length
    if (password.length < minLength) {
        return "Password must be at least 8 characters long.";
    }

    // Check for uppercase letters
    if (!hasUpperCase) {
        return "Password must contain at least one uppercase letter.";
    }

    // Check for lowercase letters
    if (!hasLowerCase) {
        return "Password must contain at least one lowercase letter.";
    }

    // Check for numbers
    if (!hasNumbers) {
        return "Password must contain at least one number.";
    }

    // Check for special characters
    if (!hasSpecialChars) {
        return "Password must contain at least one special character.";
    }

    return "Password is valid!";
}

//Form Submit Function
document.getElementById("registration-form").addEventListener("submit" , function(event){
    
    event.preventDefault();

    const nic = document.getElementById('nic').value.trim(); 
    const fullName = document.getElementById('fullname').value.trim(); 
    const email = document.getElementById("email").value.trim(); 
    const phone = document.getElementById('phone').value.trim(); 
    const password = encryption(document.getElementById('password').value.trim());
    const fileInput = document.getElementById('profilepic').files; 
    const registrationFee = 2500;

    // Validate Nic, phone, and password before Registration
    if(validateNic(nic) != true) {
        document.getElementById("user-registration-message").style.color = "Red";
        document.getElementById("user-registration-message").textContent = "Invalid NIC format. Should be 9 numbers followed by a letter V or 12 numbers only.";
        return;
    }

    if(validatePhone(phone) != true) {
        document.getElementById("user-registration-message").style.color = "Red";
        document.getElementById("user-registration-message").textContent = "Invalid phone number. Must be 10 digits long.";
        return;
    }

    if(validatePassword(document.getElementById('password').value.trim()) != true) {
        const error = validatePassword(document.getElementById('password').value.trim());
        if(error == "Password is valid!"){
            document.getElementById('password').style.border = "2px solid Green"
            document.getElementById("user-registration-message").style.color = "Green";
            document.getElementById("user-registration-message").textContent = error;
        }else{
            document.getElementById('password').style.border = "2px solid Red"
            document.getElementById("user-registration-message").style.color = "Red";
            document.getElementById("user-registration-message").textContent = error;
            return;
        }
    }

    const users = students.find(user => user.nic == nic)
    if(users){
        document.getElementById('user-registration-message').style.color = "Red";
        document.getElementById('user-registration-message').textContent = "User already exist"
    }else{
            const formData = new FormData();
            formData.append("nic", nic);
            formData.append("fullName", fullName);
            formData.append("email", email);
            formData.append("phone", phone);
            formData.append("password", password);
            formData.append("registrationFee", registrationFee);
            formData.append("imageFile", fileInput[0]);

            AddStudent(formData);
    
            document.getElementById('user-registration-message').style.color = "Green";
            document.getElementById('user-registration-message').textContent = "Register Successfuly";
            document.getElementById('nic').style.border = "none"
            document.getElementById('password').style.border = "none"
            document.getElementById('fullname').style.border = "none"
            document.getElementById('email').style.border = "none"
            document.getElementById('phone').style.border = "none"
            event.target.reset();
    }

    setTimeout(()=>{
        document.getElementById('user-registration-message').textContent = ""
    }, 3000);
    ShowTable();
});



//This is for find Student already Exists
document.getElementById('nic').addEventListener("keyup" , () =>{
    const nic = document.getElementById('nic').value.trim();
    const student = students.find((student) => student.nic == nic);
    if (nic.length != 0) {
        if(!validateNic(nic)){
            document.getElementById('nic').style.border = "2px solid Red"
            document.getElementById("user-registration-message").style.color = "Red";
            document.getElementById("user-registration-message").textContent = "Invalid NIC format. Should be 9 numbers followed by a letter V or 12 numbers only.";
        }else{
            if(student){
                document.getElementById('user-registration-message').style.color = "Red";
                document.getElementById('user-registration-message').textContent = "Student Already Exists";
                document.getElementById('nic').style.border = "2px solid Red"
        
            }else{
                document.getElementById('user-registration-message').style.color = "Green";
                document.getElementById('user-registration-message').textContent = "New Student";
                document.getElementById('nic').style.border = "2px solid green"
            } 
        }
    }else{
        document.getElementById('nic').style.border = "none"
        document.getElementById('user-registration-message').textContent = ""
    }
   
});

document.getElementById('fullname').addEventListener("keyup" ,()=>{
    const FullName = document.getElementById('fullname').value;

    if(FullName.length > 0){
        document.getElementById('fullname').style.border = "2px solid green"
    }else{
        document.getElementById('fullname').style.border = "none"
    }
});

document.getElementById('email').addEventListener("keyup" ,()=>{
    const Email = document.getElementById('email').value;

    if(Email.length > 0){
        document.getElementById('email').style.border = "2px solid green"
    }else{
        document.getElementById('email').style.border = "none"
    }
});

document.getElementById('phone').addEventListener("keyup" ,()=>{
    const phone = document.getElementById('phone').value;

    if(phone.length > 0){
        if(validatePhone(phone) != true) {
            document.getElementById('phone').style.border = "2px solid Red"
            document.getElementById("user-registration-message").style.color = "Red";
            document.getElementById("user-registration-message").textContent = "Invalid phone number. Must be 10 digits long.";
        }else{
            document.getElementById('phone').style.border = "2px solid green"
            document.getElementById("user-registration-message").textContent = ""
        }
    }else{
        document.getElementById('phone').style.border = "none"
        document.getElementById("user-registration-message").textContent = ""
    }
});

document.getElementById('password').addEventListener("keyup" , () =>{
    const password = document.getElementById('password').value.trim();

    if (password.length != 0) {
        
        if(validatePassword(password) != true){
            const error = validatePassword(password);
            if(error == "Password is valid!"){
                document.getElementById('password').style.border = "2px solid Green"
                document.getElementById("user-registration-message").style.color = "Green";
                document.getElementById("user-registration-message").textContent = error;
            }else{
                document.getElementById('password').style.border = "2px solid Red"
                document.getElementById("user-registration-message").style.color = "Red";
                document.getElementById("user-registration-message").textContent = error;
            }
        }
        
        else{
            document.getElementById('user-registration-message').style.color = "Green";
            document.getElementById('user-registration-message').textContent = "Valid! password";
            document.getElementById('password').style.border = "2px solid Green"
        }
        
    }else{
        document.getElementById('password').style.border = "none"
        document.getElementById('user-registration-message').textContent = ""
    }
})

//Pop up box For Student details
document.getElementById("view-students-btn").addEventListener("click" , ()=>{
    document.getElementById("overlay").style.display ="block"
    document.getElementById("popupbox").style.display ="block"
});

document.getElementById("overlay").addEventListener("click" , ()=>{
    document.getElementById("overlay").style.display ="none"
    document.getElementById("popupbox").style.display ="none"
});


//Show Table

function ShowTable(){
    const table = document.getElementById('student-details-table');
    table.innerHTML = ""
    if(table){
        students.forEach((student) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input class="table-input" type="text" id="popup-nic-${student.nic}"  value="${student.nic}" required disabled></td>
                <td><input class="table-input" type="text" id="popup-fullname-${student.nic}" value="${student.fullName}" required  disabled></td>
                <td><input class="table-input" type="tel" id="popup-phone-${student.nic}" value="${student.phone}" required disabled></td>
                <td><input class="table-input" type="email" id="popup-email-${student.nic}" value="${student.email}" required  disabled>
                <td><button class="btn update-btn" id="update-${student.nic}" onclick="updateStudent('popup-fullname-${student.nic}','popup-email-${student.nic}','popup-phone-${student.nic}','update-${student.nic}','save-${student.nic}')">Update</button>
                <button class="btn save-btn" id="save-${student.nic}" style="display: none;" onclick="saveStudent('popup-fullname-${student.nic}','popup-email-${student.nic}','popup-phone-${student.nic}','update-${student.nic}','save-${student.nic}','${student.nic}')">Save</button>
                <button class="btn remove-btn" onclick="removeStudentByNicNumber(event,'${student.nic}')">Remove</button></td>
            `;
            table.appendChild(row);
        });
    }
}
ShowTable();  


//update Student

function updateStudent(fullName,email,phone,UpdateButton,SaveButton){
    document.getElementById(fullName).disabled = false
    document.getElementById(email).disabled = false
    document.getElementById(phone).disabled = false

    document.getElementById(fullName).style.border = "2px solid black"
    document.getElementById(email).style.border = "2px solid black"
    document.getElementById(phone).style.border = "2px solid black"

    document.getElementById(UpdateButton).style.display = "none"
    document.getElementById(SaveButton).style.display = "inline-block"
}

//Save Student
function saveStudent(fullName,email,phone,UpdateButton,SaveButton,studentNIC){
    document.getElementById(fullName).disabled = true
    document.getElementById(email).disabled = true
    document.getElementById(phone).disabled = true

    document.getElementById(fullName).style.border = "none"
    document.getElementById(email).style.border =  "none"
    document.getElementById(phone).style.border =  "none"

    document.getElementById(UpdateButton).style.display = "inline-block"
    document.getElementById(SaveButton).style.display = "none"

    const newName = document.getElementById(fullName).value.trim();
    const newEmail = document.getElementById(email).value.trim();
    const newPhone = document.getElementById(phone).value.trim();


    if(fullName != "" && email != "" && phone != ""){
        const StudentUpdateData = {
            fullName:newName,
            email:newEmail,
            phone:newPhone
        }
        UpdateStudent(studentNIC , StudentUpdateData)

        document.getElementById('user-registration-message-2').style.display = "inline-block"
        document.getElementById('user-registration-message-2').style.color = "green"
        document.getElementById('user-registration-message-2').textContent = "Student Update Sucessfully.."
    }else{
        document.getElementById('user-registration-message-2').style.display = "inline-block"
        document.getElementById('user-registration-message-2').style.color = "red"
        document.getElementById('user-registration-message-2').textContent = "Please fill all fields"
    }

    setTimeout(()=>{
            document.getElementById('user-registration-message-2').style.display = "none"
        }, 2000);
}

//Remove Student 
function removeStudentByNicNumber(event,StudentNicToRemove) {
    if(confirm("Do you want to Delete This Student ?")){
        const row = event.target.parentElement.parentElement;
        row.remove();

        let indexToRemove = students.findIndex(obj => obj.nic.toString() === StudentNicToRemove.toString());

        if (indexToRemove !== -1) {

            DeleteStudent(StudentNicToRemove)

            document.getElementById('user-registration-message-2').style.display = "inline-block"
            document.getElementById('user-registration-message-2').style.color = "Green";
            document.getElementById('user-registration-message-2').textContent = "Student Removed Successfully..."
        }

        setTimeout(()=>{
            document.getElementById('user-registration-message-2').textContent = "";
        }, 2000);
    }
}





//Logout function

function logout() {
    location.href = "../01_Admin_Login/admin_login.html";
}

const logoutButton = document.getElementById('logoutButton');
if(logoutButton){
    logoutButton.addEventListener('click', function() {
        logout();
    });
}
