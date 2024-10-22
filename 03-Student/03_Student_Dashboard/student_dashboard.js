// Session Storage
const nic = JSON.parse(sessionStorage.getItem('NIC'));

if(nic == null){
    alert("You need to login again !!")
    window.location.href = "../01_student_Login/student_login.html";
}

//Logout function
function logout() {
    sessionStorage.removeItem('NIC')
    window.location.href = "../01_student_Login/student_login.html";
}

const logoutButton = document.getElementById('logoutButton');
logoutButton.addEventListener('click', function() {
  logout();
});

let students  = [];
let courses = [];
let courseEnrollData = [];
let installments  = [];
let FUllpaymentDetails  = [];
let Notifications = [];


const GetAllStudentsURL = 'https://localhost:7069/api/Student/Get-All-Students';
//Fetch Students Data from Database
async function GetAllStudents(){
    fetch(GetAllStudentsURL).then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    }).then((data) => {
        students = data;

        ProfilePicLoading();
        UpdatePersonalInformation();
        PasswordChange();

        const GetAllCoursesURL = 'https://localhost:7069/api/Course/Get-All-Courses';
        //Fetch Students Data from Database
        async function GetAllCourses(){
            fetch(GetAllCoursesURL).then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            }).then((data) => {
                courses = data;

                const GetAllCourseEnrollURL = 'https://localhost:7069/api/CourseEnroll/Get-All-Enroll-Data';
                //Fetch CourseEnrollData Data from Database
                async function GetAllCourseEnrollData(){
                    fetch(GetAllCourseEnrollURL).then((response) => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok ' + response.statusText);
                        }
                        return response.json();
                    }).then((data) => {
                        courseEnrollData = data;
                        HistoryCourseTable();

                        const GetAllInstallmentsURL = 'https://localhost:7069/api/Installment/Get-All-Installments';
                        //Fetch Installments Data from Database
                        async function GetAllInstallments(){
                            fetch(GetAllInstallmentsURL).then((response) => {
                                if (!response.ok) {
                                    throw new Error('Network response was not ok ' + response.statusText);
                                }
                                return response.json();
                            }).then((data) => {
                                installments = data;

                                const GetAllFullPaymentURL = 'https://localhost:7069/api/FullPayment/Get-All-FullPayments';
                                //Fetch Fullpayments Data from Database
                                async function GetAllFullPayments(){
                                    fetch(GetAllFullPaymentURL).then((response) => {
                                        if (!response.ok) {
                                            throw new Error('Network response was not ok ' + response.statusText);
                                        }
                                        return response.json();
                                    }).then((data) => {
                                        FUllpaymentDetails = data;

                                        PageLoadingDetails();
                                        UpdateCourseInActive();
                                        HistoryPaymentTable();

                                        const GetAllNotificationsURL = "https://localhost:7069/api/Notification/Get-All-Notifications";
                                        // Fetch All Notification Data From Database
                                        async function GetAllNotifications(){
                                            fetch(GetAllNotificationsURL).then((response) => {
                                                if (!response.ok) {
                                                    throw new Error('Network response was not ok ' + response.statusText);
                                                }
                                                return response.json();
                                            }).then((data)=> {
                                                Notifications = data
                                                RedDot();
                                                NotificationsTable();
                                                ReminderNotification();

                                            }).catch(error => {
                                                console.error('There was a problem with the fetch operation:', error);
                                            });

                                        }
                                        GetAllNotifications();

                                    }).catch(error => {
                                        console.error('There was a problem with the fetch operation:', error);
                                    });

                                };
                                GetAllFullPayments();

                            }).catch(error => {
                                console.error('There was a problem with the fetch operation:', error);
                            });

                        };
                        GetAllInstallments();

                    }).catch(error => {
                        console.error('There was a problem with the fetch operation:', error);
                    });

                };
                GetAllCourseEnrollData();

            }).catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        };
        GetAllCourses();

    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
};
GetAllStudents();



const UpdateStudentURL = 'https://localhost:7069/api/Student/Update-Student';
//Update Student Contact Details
async function UpdateStudent(StudentNic , StudentUpdateData){

    await fetch(`${UpdateStudentURL}/${StudentNic}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(StudentUpdateData)
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

};

const PasswordChangeURL = 'https://localhost:7069/api/Student/Password-Change';
//Update Student Password
async function UpdatePassword(StudentNic , NewPassword){
    await fetch(`${PasswordChangeURL}/${StudentNic}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(NewPassword)
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

const UpdateStatusURL = 'https://localhost:7069/api/CourseEnroll/Update-Status';
//Update CourseEnroll Status
async function UpdateStatus(CourseEnrollId , Status){
    await fetch(`${UpdateStatusURL}/${CourseEnrollId}/${Status}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}


const GetAllNotificationsURL = "https://localhost:7069/api/Notification/Get-All-Notifications";
// Fetch All Notification Data From Database
async function GetAllNotifications(){
    fetch(GetAllNotificationsURL).then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    }).then((data)=> {
        Notifications = data
        RedDot();
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}
GetAllNotifications();

const AddNotificationURL = 'https://localhost:7069/api/Notification/Add-Notification';
// Add Notifications
async function AddNotification(NotificationData){
    await fetch(AddNotificationURL,{
        method:'Post',
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(NotificationData)

    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
    GetAllNotifications();
}

const DeleteNotificationURL = 'https://localhost:7069/api/Notification/Delete-Notification';
async function DeleteNotification(Id){
    await fetch(`${DeleteNotificationURL}/${Id}`,{
        method:'DELETE'
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
    GetAllNotifications();
}

//Fetch Students Data from Database
async function GetAllStudentsDetails(){
    fetch(GetAllStudentsURL).then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    }).then((data) => {
        students = data;
        ProfilePicLoading();
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
};
GetAllStudentsDetails();

const UpdateProfilePicURL = 'https://localhost:7069/api/Student/Update-Profile-Picture';
async function UpdateProfilePic(formdata){
    await fetch(UpdateProfilePicURL, {
        method:'PUT',
        body:formdata
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
    GetAllStudentsDetails();
}





document.getElementById('profile-button').addEventListener("click" , () =>{
    document.getElementById("home-container").style.display = "none"
    document.getElementById("history-container").style.display = "none"
    document.getElementById("password-container").style.display = "none"
    document.getElementById("profile-container").style.display = "block"

})
document.getElementById('home-button').addEventListener("click" , () =>{
    document.getElementById("profile-container").style.display = "none"
    document.getElementById("history-container").style.display = "none"
    document.getElementById("password-container").style.display = "none"
    document.getElementById("home-container").style.display = "block"
})
document.getElementById('history-button').addEventListener("click" , () =>{
    document.getElementById("home-container").style.display = "none"
    document.getElementById("profile-container").style.display = "none"
    document.getElementById("password-container").style.display = "none"
    document.getElementById("history-container").style.display = "block"
})
document.getElementById('settings-button').addEventListener("click" , () =>{
    document.getElementById("home-container").style.display = "none"
    document.getElementById("profile-container").style.display = "none"
    document.getElementById("history-container").style.display = "none"
    document.getElementById("password-container").style.display = "block"
})

function ProfilePicLoading(){
    const student = students.find(s => s.nic == nic);
    const imagePath = student.imagePath
    const imageFullPath = `https://localhost:7069${imagePath}`.trim();

    const ProfilePicContainer = document.getElementById('profilepic-container');
    ProfilePicContainer.innerHTML = `
        <img src="${imageFullPath}" alt="${student.fullName}"  id="profile-picture" class="profile-picture">
    `;
    
}


// Home Page
function PageLoadingDetails(){

    const student = students.find(s => s.nic == nic);
    const CourseEnroll = courseEnrollData.find(c => c.id == student.courseEnrollId)
    const coursedetails = courses.find(c => c.id == CourseEnroll.courseId)
    
    let installment ;
    if(CourseEnroll.installmentId != null ){
        installment = installments.find(i => i.id == CourseEnroll.installmentId);
    }
    
    let fullPayment ;
    if(CourseEnroll.fullPaymentId != null){
        fullPayment = FUllpaymentDetails.find(f => f.id == CourseEnroll.fullPaymentId)
    }
    

    if(student){
        document.getElementById("courseName").textContent = coursedetails.courseName
        document.getElementById("greeting").textContent = student.fullName
        document.getElementById("proficiencyLevels").textContent = coursedetails.level
        

        if(fullPayment || installment){
            document.getElementById("status").textContent = `Active`
            document.getElementById("status").style.color = "Green"
        }else{
            document.getElementById("status").textContent = `Inactive`
            document.getElementById("status").style.color = "Red"
        }


        if(fullPayment){
            document.getElementById("p1").textContent = `Course Fee   : ${fullPayment.fullPayment}`
            document.getElementById("p2").textContent = `Payment Plan : Full Payment`
            document.getElementById("p3").textContent = `Full Payment Done`
            document.getElementById("p4").textContent = `Payment Date : ${new Date(fullPayment.paymentDate).toDateString()}`
        }else if(installment){
            document.getElementById("p1").textContent = `Course Fee   : ${installment.totalAmount}`
            document.getElementById("p2").textContent = `Payment Plan : Installment`
            document.getElementById("p3").textContent = `Payment Paid : ${installment.paymentPaid}`
            document.getElementById("p4").textContent = `Payment Due : ${installment.paymentDue}`
            document.getElementById("p5").textContent = `Payment Date : ${new Date(installment.paymentDate).toDateString()}`
        }else{
            document.getElementById("p1").textContent = `Payment Pending .....`
        }
    }
}


// Profile page
// Personal Information Update and View
function UpdatePersonalInformation(){
    const student = students.find(s => s.nic == nic);
    if(student){
        document.getElementById("nic").value = student.nic
        document.getElementById("fullname").value = student.fullName
        document.getElementById("email").value = student.email
        document.getElementById("phone").value = student.phone
    }
    
    
    document.getElementById('update-button').addEventListener("click",()=>{
        document.getElementById("fullname").disabled = false
        document.getElementById("email").disabled = false
        document.getElementById("phone").disabled = false
    
        document.getElementById("fullname").style.border = "2px solid black"
        document.getElementById("email").style.border = "2px solid black"
        document.getElementById("phone").style.border = "2px solid black"
    
        document.getElementById('update-button').style.display = 'none'
        document.getElementById('save-button').style.display = 'block'
        document.getElementById('Cancel-button').style.display = 'block'
    })
    
    document.getElementById('save-button').addEventListener('click' , ()=>{
        const FullName = document.getElementById("fullname").value.trim();
        const Email = document.getElementById("email").value.trim();
        const Phone = document.getElementById("phone").value.trim();
    
        const StudentUpdateData = {
            fullName:FullName,
            email:Email,
            phone:Phone
        }
    
        UpdateStudent(student.nic , StudentUpdateData)
    
        document.getElementById("fullname").style.border = "none"
        document.getElementById("email").style.border = "none"
        document.getElementById("phone").style.border = "none"
    
        document.getElementById("fullname").disabled = true
        document.getElementById("email").disabled = true
        document.getElementById("phone").disabled = true
    
        document.getElementById('update-button').style.display = 'block'
        document.getElementById('save-button').style.display = 'none'
        document.getElementById('Cancel-button').style.display = 'none'
    
        alert("Information Update Successfully .....")
    })
    
    document.getElementById('Cancel-button').addEventListener('click',()=>{
        document.getElementById("fullname").disabled = true
        document.getElementById("email").disabled = true
        document.getElementById("phone").disabled = true
    
        document.getElementById("fullname").style.border = "none"
        document.getElementById("email").style.border = "none"
        document.getElementById("phone").style.border = "none"
    
        document.getElementById('update-button').style.display = 'block'
        document.getElementById('save-button').style.display = 'none'
        document.getElementById('Cancel-button').style.display = 'none'
    })
    
}


// Password Change

function Encryption(password){
    return btoa(password)
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

function PasswordChange(){
    const student = students.find(s => s.nic == nic);

    document.getElementById('update-password').addEventListener('click' , ()=>{
        const oldPassword = Encryption(document.getElementById('oldPassword').value.trim());
        const newPassword = Encryption(document.getElementById('newPassword').value.trim());
        const confirmPassword = Encryption(document.getElementById('confirmPassword').value.trim());

        if(validatePassword(document.getElementById('newPassword').value.trim()) != true) {
            const error = validatePassword(document.getElementById('newPassword').value.trim());
            if(error != "Password is valid!"){
                alert(error);
                return;
            }
        }

        if(student){
            if(student.password == oldPassword){
                if(newPassword == confirmPassword){

                    const NewPassword = {
                        newPassword
                    }

                    UpdatePassword(student.nic , NewPassword)

                    alert('Password Changed Successfully')
                }else{
                    alert('Password does not match')
                }
            }else{
                alert("Old Password is incorrect")
            }
        }

        document.getElementById('oldPassword').value = ""
        document.getElementById('newPassword').value = ""
        document.getElementById('confirmPassword').value = ""
    })
}
 


//Notification

document.getElementById('notification').addEventListener('click' , ()=>{
    document.getElementById('overlay').style.display = 'block'
    document.getElementById('popupbox').style.display = 'block'
})

document.getElementById('overlay').addEventListener('click' , ()=>{
    document.getElementById('overlay').style.display = 'none'
    document.getElementById('popupbox').style.display = 'none'
})


function ReminderNotification(){
    const student = students.find(s => s.nic == nic);
    const CourseEnroll = courseEnrollData.find(c => c.id == student.courseEnrollId)
    const InstallmentDetails = installments.find(i => i.id == CourseEnroll.installmentId);
    const notify = Notifications.find(n => n.nic == nic && n.type == "Reminder" && new Date(n.date).getMonth() == new Date().getMonth());

    if(InstallmentDetails){
        const notification = Notifications.find(n => n.sourceId == InstallmentDetails.id)
        if(InstallmentDetails.paymentDue != 0){
            if(new Date().getMonth() != new Date(notification.date).getMonth()){
                const today = new Date();
                const endOfMonth = new Date(today.getFullYear(), today.getMonth() +1, 0);
    
                if(endOfMonth.getDate() - today.getDate() == 5){
                    if(!notify){
                        const NotificationData ={
                            nic,
                            type:"Reminder",
                            sourceId:"0000",
                            date:new Date()
                        }
                        AddNotification(NotificationData);
                    }

                }
            }
            
        }
       
    }
    
}


function RedDot(){
    const notify = Notifications.filter(n => n.nic == nic && n.isDeleted != true);
    if(notify.length != 0){
        document.getElementById('circle').style.visibility = "visible"
    }else{
        document.getElementById('circle').style.visibility = "hidden"
    }
}

function NotificationsTable(){
    const student = students.find(s => s.nic == nic);
    const notificationContainer = document.getElementById('notification-container');
    notificationContainer.innerHTML = ""
    Notifications.forEach(N => {
        if(N.nic == nic && N.isDeleted != true){
            if(N.type == "Course"){
                const course = courses.find(c => c.id == N.sourceId)
                if(course){
                    const div = document.createElement('div');
                    div.className = "reminder";
                    div.innerHTML = `
                        <p id="message">"Exciting news! We’re thrilled to announce the launch of our new course, <strong>${course.courseName} for ${course.level}</strong>, starting on <strong>${new Date(N.date).toDateString()}</strong></p>
                        <i class="fa-regular fa-circle-xmark" onclick="removeCourseNotification(event,'${N.id}')"></i>
                    `;
                    notificationContainer.appendChild(div);
                }
            }else if(N.type == "FullPayment"){
                const fullpayment = FUllpaymentDetails.find(f => f.id == N.sourceId);
                const courseEnroll = courseEnrollData.find(ce => ce.fullPaymentId == fullpayment.id)
                const course = courses.find(c => c.id == courseEnroll.courseId)
                const div = document.createElement('div');
                div.className = "reminder";
                div.innerHTML = `
                    <p id="message">"Dear <strong>${student.fullName}</strong>, we are pleased to inform you that your full payment <strong>${fullpayment.fullPayment} Rs</strong> for <strong>${course.courseName} ${course.level} </strong>has been successfully received as of <strong>${new Date(N.date).toDateString()}</strong>. Thank you for your prompt payment!"</p>
                    <i class="fa-regular fa-circle-xmark" onclick="removeCourseNotification(event,'${N.id}')"></i>
                `;
                notificationContainer.appendChild(div);
            }else if(N.type == "Installment"){
                const installment = installments.find(i => i.id == N.sourceId)
                const courseEnroll = courseEnrollData.find(ce => ce.installmentId == installment.id)
                const course = courses.find(c => c.id == courseEnroll.courseId)
                const div = document.createElement('div');
                div.className = "reminder";
                div.innerHTML = `
                    <p id="message">We are pleased to inform you that your installment payment <strong>${installment.installmentAmount} Rs</strong> for <strong>${course.courseName}
                    ${course.level}</strong> has been successfully received as of <strong>${new Date(N.date).toDateString()}</strong>. Thank you for your timely payment!</p>
                    <i class="fa-regular fa-circle-xmark" onclick="removeCourseNotification(event,'${N.id}')"></i>
                `;
                notificationContainer.appendChild(div);
            }else if(N.type == "Reminder"){
                const courseEnroll = courseEnrollData.find(ce => ce.id == student.courseEnrollId)
                const course = courses.find(c => c.id == courseEnroll.courseId)

                const today = new Date();
                const endOfMonth = new Date(today.getFullYear(), today.getMonth() +1, 0);

                const div = document.createElement('div');
                div.className = "reminder";
                div.innerHTML = `
                    <p id="message">"Hello <strong>${student.fullName}</strong>, this is a friendly reminder that your next installment payment for <strong> ${course.courseName} ${course.level}</strong> is due on<strong> ${new Date(endOfMonth).toDateString()}</strong>. Please ensure that your payment is made on time to continue enjoying the course.</p>
                    <i class="fa-regular fa-circle-xmark" onclick="removeCourseNotification(event,'${N.id}')"></i>
                `;
                notificationContainer.appendChild(div);
            }
                
        }
    })
}

// Soft Delete Function
function removeCourseNotification(event,notificationId){
    event.target.parentElement.remove();
    const notification = Notifications.find(n => n.id == notificationId);
    if(notification){
        DeleteNotification(notificationId);
    }
}

//Course Automatically InActive After Reach The DeadLine And If Student Paid Payment
function UpdateCourseInActive(){
    const student = students.find(s => s.nic == nic);

    const CourseEnroll = courseEnrollData.find(c => c.id == student.courseEnrollId);

    let installment;
    if(CourseEnroll.installmentId != null ){
        installment = installments.find(i => i.id == CourseEnroll.installmentId);
    }

    let fullPayment ;
    if(CourseEnroll.fullPaymentId != null){
        fullPayment = FUllpaymentDetails.find(f => f.id == CourseEnroll.fullPaymentId)
    }

    //Function For Add months in date
    function addMonths(date, months) {
        const newDate = new Date(date); 
        newDate.setMonth(newDate.getMonth() + months); 
        return newDate;
    }

    if(CourseEnroll.status == "Active"){

        if(CourseEnroll.fullPaymentId != null){
            if(CourseEnroll.duration == 3){
                const EnrolledDate = new Date(CourseEnroll.courseEnrollDate);
                const monthsToAdd = 3;
                const DeadLine = addMonths(EnrolledDate, monthsToAdd);
        
                if(DeadLine <= new Date()){
                    const Status = "InActive"
                    UpdateStatus(CourseEnroll.id, Status)
                }
                
            }else if(CourseEnroll.duration == 6){
                const EnrolledDate = new Date(CourseEnroll.courseEnrollDate);
                const monthsToAdd = 6;
                const DeadLine = addMonths(EnrolledDate, monthsToAdd);
        
                if(DeadLine <= new Date()){
                    const Status = "InActive"
                    UpdateStatus(CourseEnroll.id, Status)
                }
            }
        }else if(CourseEnroll.installmentId != null){
            if(installment.paymentDue <= 0){
                if(CourseEnroll.duration == 3){
                    const EnrolledDate = new Date(CourseEnroll.courseEnrollDate);
                    const monthsToAdd = 3;
                    const DeadLine = addMonths(EnrolledDate, monthsToAdd);
            
                    if(DeadLine <= new Date()){
                        const Status = "InActive"
                        UpdateStatus(CourseEnroll.id, Status)
                    }
                    
                }else if(CourseEnroll.duration == 6){
                    const EnrolledDate = new Date(CourseEnroll.courseEnrollDate);
                    const monthsToAdd = 6;
                    const DeadLine = addMonths(EnrolledDate, monthsToAdd);
            
                    if(DeadLine <= new Date()){
                        const Status = "InActive"
                        UpdateStatus(CourseEnroll.id, Status)
                    }
                }
            }
        }
    }
    
}


function HistoryCourseTable(){

    const tableBody = document.getElementById('course-body');
    tableBody.innerHTML = ""
    courseEnrollData.forEach(ced => {
        if(ced.nic == nic){
            const course = courses.find(c => c.id == ced.courseId);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${course.courseName}</td>
                <td>${course.level}</td>
                <td>${ced.duration} Months</td>
                <td>${new Date(ced.courseEnrollDate).toDateString()}</td>
                <td>${ced.status}</td>
            `
            tableBody.appendChild(tr);
        }
        
    })
    
}
    
function HistoryPaymentTable(){
    const tableBody = document.getElementById('payment-body');
    if(tableBody)
    tableBody.innerHTML = ""
    courseEnrollData.forEach(ced => {
        if(ced.nic == nic){
            if(ced.installmentId != null && ced.fullPaymentId == null){
                const installment = installments.find(i => i.id == ced.installmentId);
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${installment.id}</td>
                    <td>Installment</td>
                    <td>${installment.totalAmount}</td>
                    <td>${new Date(installment.paymentDate).toDateString()}</td>
                    <td>${installment.paymentDue <= 0 ? "Paid" : "Active"}</td>
                `
                tableBody.appendChild(tr);
            }else if(ced.installmentId == null && ced.fullPaymentId != null){
                const fullpayment = FUllpaymentDetails.find(f => f.id == ced.fullPaymentId);
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${fullpayment.id}</td>
                    <td>Full Payment</td>
                    <td>${fullpayment.fullPayment}</td>
                    <td>${new Date(fullpayment.paymentDate).toDateString()}</td>
                    <td>Paid</td>
                `
                tableBody.appendChild(tr);
            }
        }
        
    })
}

document.getElementById("profile-pic-update-form").addEventListener("submit",(event)=>{
    event.preventDefault();
    const fileInput = document.getElementById('profilepic').files;

    const formData = new FormData();
    formData.append('nic',nic);
    formData.append("imageFile", fileInput[0]);

    UpdateProfilePic(formData);
    event.target.reset();
});

function ProfilePicDelete(){
    if(confirm("Do you want to delete your Profile Picture?")){
        const formData = new FormData();
    formData.append('nic',nic);
    formData.append("imageFile", "");

    UpdateProfilePic(formData);
    }
}