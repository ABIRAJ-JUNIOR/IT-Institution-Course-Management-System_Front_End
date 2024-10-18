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

const GetAllStudentsURL = 'http://localhost:5251/api/Student/Get-All-Students';
//Fetch Students Data from Database
async function GetAllStudents(){
    fetch(GetAllStudentsURL).then((response) => {
        return response.json();
    }).then((data) => {
        students = data;

        ProfilePicLoading();
        UpdatePersonalInformation();
        PasswordChange();

        const GetAllCoursesURL = 'http://localhost:5251/api/Course/Get-All-Courses';
        //Fetch Students Data from Database
        async function GetAllCourses(){
            fetch(GetAllCoursesURL).then((response) => {
                return response.json();
            }).then((data) => {
                courses = data;

                const GetAllCourseEnrollURL = 'http://localhost:5251/api/CourseEnroll/Get-All-Enroll-Data';
                //Fetch CourseEnrollData Data from Database
                async function GetAllCourseEnrollData(){
                    fetch(GetAllCourseEnrollURL).then((response) => {
                        return response.json();
                    }).then((data) => {
                        courseEnrollData = data;
                        HistoryCourseTable();

                        const GetAllInstallmentsURL = 'http://localhost:5251/api/Installment/Get-All-Installments';
                        //Fetch Installments Data from Database
                        async function GetAllInstallments(){
                            fetch(GetAllInstallmentsURL).then((response) => {
                                return response.json();
                            }).then((data) => {
                                installments = data;

                                const GetAllFullPaymentURL = 'http://localhost:5251/api/FullPayment/Get-All-FullPayments';
                                //Fetch Fullpayments Data from Database
                                async function GetAllFullPayments(){
                                    fetch(GetAllFullPaymentURL).then((response) => {
                                        return response.json();
                                    }).then((data) => {
                                        FUllpaymentDetails = data;

                                        PageLoadingDetails();
                                        UpdateCourseInActive();
                                        HistoryPaymentTable();

                                        const GetAllNotificationsURL = "http://localhost:5251/api/Notification/Get-All-Notifications";
                                        // Fetch All Notification Data From Database
                                        async function GetAllNotifications(){
                                            fetch(GetAllNotificationsURL).then((response) => {
                                                return response.json();
                                            }).then((data)=> {
                                                Notifications = data
                                                RedDot();
                                                NotificationsTable();
                                                ReminderNotification();
                                            })
                                        }
                                        GetAllNotifications();
                                    })
                                };
                                GetAllFullPayments();
                            })
                        };
                        GetAllInstallments();
                    })
                };
                GetAllCourseEnrollData();
            })
        };
        GetAllCourses();
    })
};
GetAllStudents();

const UpdateStudentURL = 'http://localhost:5251/api/Student/Update-Student';
//Update Student Contact Details
async function UpdateStudent(StudentNic , StudentUpdateData){

    await fetch(`${UpdateStudentURL}/${StudentNic}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(StudentUpdateData)
    });

};

const PasswordChangeURL = 'http://localhost:5251/api/Student/Password-Change';
//Update Student Password
async function UpdatePassword(StudentNic , NewPassword){
    await fetch(`${PasswordChangeURL}/${StudentNic}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(NewPassword)
    });
}


const UpdateStatusURL = 'http://localhost:5251/api/CourseEnroll/Update-Status';
//Update CourseEnroll Status
async function UpdateStatus(CourseEnrollId , Status){
    await fetch(`${UpdateStatusURL}/${CourseEnrollId}/${Status}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
    });
}


document.addEventListener("DOMContentLoaded" , ()=>{
    document.getElementById('profile-button').addEventListener("click" , () =>{
        document.getElementById("home-container").style.display = "none"
        document.getElementById("profile-container").style.display = "block"
    })
    document.getElementById('home-button').addEventListener("click" , () =>{
        document.getElementById("home-container").style.display = "block"
        document.getElementById("profile-container").style.display = "none"
    })
    
    // Home Page
    function PageLoadingDetails(){
    
        const student = students.find(s => s.nic == nic);
        const CourseEnroll = courseEnrollData.find(c => c.id == student.courseEnrollId)
        const coursedetails = courses.find(c => c.id == CourseEnroll.courseId)

        let installment ;
        if(CourseEnroll.installmentId != 0 ){
            installment = installments.find(i => i.id == CourseEnroll.installmentId);
        }

        let fullPayment ;
        if(CourseEnroll.fullPaymentId != 0){
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
    PageLoadingDetails();
    
    // Profile page
    // Personal Information Update and View
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
    
        student.fullName = FullName;
        student.email = Email;
        student.phone = Phone;

        localStorage.setItem('Students' , JSON.stringify(students));
    
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
                    student.password = newPassword;
                    localStorage.setItem('Students' , JSON.stringify(students));
                    alert('Password Changed Successfully');
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

    
    
    //Notification
    function Notification(){
        document.getElementById('notification').addEventListener('click' , ()=>{
            document.getElementById('overlay').style.display = 'block'
            document.getElementById('popupbox').style.display = 'block'
        })
        
        document.getElementById('overlay').addEventListener('click' , ()=>{
            document.getElementById('overlay').style.display = 'none'
            document.getElementById('popupbox').style.display = 'none'
        })
        
        document.getElementById('remove-notification').addEventListener('click' , (event)=>{
           event.target.parentElement.remove()
           document.getElementById('circle').style.visibility = "hidden"
        })
        
        
        const CourseEnroll = courseEnrollData.find(c => c.id == student.courseEnrollId)
    
        if(CourseEnroll.installmentId != 0){
            const installment = installments.find(i => i.id == CourseEnroll.installmentId);
            const today = new Date();
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() +1, 0);
            // console.log(endOfMonth.getDate() - today.getDate())
    
            if(endOfMonth.getDate() - today.getDate() <= 5){
                    document.getElementById('reminder').style.display = "flex"
                    document.getElementById('message').innerText = `You have to pay your installment of ${installment.installmentAmount}/= this month.`
                    document.getElementById('circle').style.visibility = "visible"
            }else{
                document.getElementById('reminder').style.display = "none"
                document.getElementById('circle').style.visibility = "hidden"
    
            }
        }else{
            document.getElementById('reminder').style.display = "none"
            document.getElementById('circle').style.visibility = "hidden"
        }
    }
    Notification();
    
    
    //Course Automatically InActive After Reach The DeadLine And If Student Paid Payment
    function UpdateCourseInActive(){
        const student = students.find(s => s.nic == nic);
        const CourseEnroll = courseEnrollData.find(c => c.id == student.courseEnrollId);

        let installment;
        if(CourseEnroll.installmentId != 0 ){
            installment = installments.find(i => i.id == CourseEnroll.installmentId);
        }

        let fullPayment ;
        if(CourseEnroll.fullPaymentId != 0){
            fullPayment = FUllpaymentDetails.find(f => f.id == CourseEnroll.fullPaymentId)
        }
    
        //Function For Add months in date
        function addMonths(date, months) {
            const newDate = new Date(date); 
            newDate.setMonth(newDate.getMonth() + months); 
            return newDate;
        }

        if(CourseEnroll.status == "Active"){

            if(CourseEnroll.fullPaymentId != 0){
                if(CourseEnroll.duration == 3){
                    const EnrolledDate = new Date(CourseEnroll.courseEnrollDate);
                    const monthsToAdd = 3;
                    const futureDate = addMonths(EnrolledDate, monthsToAdd);
            
                    if(futureDate <= new Date()){
                        CourseEnroll.status == "InActive";
                    }
                    
                }else if(CourseEnroll.duration == 6){
                    const EnrolledDate = new Date(CourseEnroll.courseEnrollDate);
                    const monthsToAdd = 6;
                    const futureDate = addMonths(EnrolledDate, monthsToAdd);
            
                    if(futureDate <= new Date()){
                        CourseEnroll.status == "InActive";
                    }
                }
            }else if(CourseEnroll.installmentId != 0){
                if(installment.paymentDue <= 0){
                    if(CourseEnroll.duration == 3){
                        const EnrolledDate = new Date(CourseEnroll.courseEnrollDate);
                        const monthsToAdd = 3;
                        const futureDate = addMonths(EnrolledDate, monthsToAdd);
                
                        if(futureDate <= new Date()){
                            CourseEnroll.status == "InActive";
                        }
                        
                    }else if(CourseEnroll.duration == 6){
                        const EnrolledDate = new Date(CourseEnroll.courseEnrollDate);
                        const monthsToAdd = 6;
                        const futureDate = addMonths(EnrolledDate, monthsToAdd);
                
                        if(futureDate <= new Date()){
                            CourseEnroll.status == "InActive";
                        }
                    }
                }
            }
        }
        localStorage.setItem('CourseEnrollDetails' , JSON.stringify(courseEnrollData));
    }
    
    UpdateCourseInActive();
});














