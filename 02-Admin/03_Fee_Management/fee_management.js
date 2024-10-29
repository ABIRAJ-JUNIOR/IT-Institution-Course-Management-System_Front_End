// Side NaveBar

const toggle = document.querySelector(".fa-bars");
const toggleClose = document.querySelector(".fa-xmark");
const sideNavebar = document.querySelector(".side-navebar");

toggle.addEventListener("click" ,function(){
    sideNavebar.style.right = "0";
})

toggleClose.addEventListener("click" , function(){
    sideNavebar.style.right = "-60%";
})

const mainURL = 'http://localhost:5091'

let students  = [];
let courses = [];
let courseEnrollData = [];
let InstallmentDetails  = [];
let FullpaymentDetails  = [];

const GetAllStudentsURL = mainURL + '/api/Student/Get-All-Students';
//Fetch Students Data from Database
async function GetAllStudents(){
    fetch(GetAllStudentsURL).then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    }).then((data) => {
        students = data;
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
};
GetAllStudents();;


const GetAllCoursesURL = mainURL + '/api/Course/Get-All-Courses';
//Fetch Students Data from Database
async function GetAllCourses(){
    fetch(GetAllCoursesURL).then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    }).then((data) => {
        courses = data;
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
};
GetAllCourses();

const GetAllCourseEnrollURL = mainURL + '/api/CourseEnroll/Get-All-Enroll-Data';
//Fetch CourseEnrollData Data from Database
async function GetAllCourseEnrollData(){
    fetch(GetAllCourseEnrollURL).then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    }).then((data) => {
        courseEnrollData = data;
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
};
GetAllCourseEnrollData();

const GetAllInstallmentsURL = mainURL + '/api/Installment/Get-All-Installments';
//Fetch Installments Data from Database
async function GetAllInstallments(){
    fetch(GetAllInstallmentsURL).then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    }).then((data) => {
        InstallmentDetails = data;
        GetLastInstallmentId();
        displayInstallmentPaymentTable();
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
    
};
GetAllInstallments();

const GetAllFullPaymentURL = mainURL + '/api/FullPayment/Get-All-FullPayments';
//Fetch Fullpayments Data from Database
async function GetAllFullPayments(){
    fetch(GetAllFullPaymentURL).then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    }).then((data) => {
        FullpaymentDetails = data;
        GetLastFullpaymentId();
        displayFullPaymentTable();
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
};
GetAllFullPayments();

const AddFullPaymentURL = mainURL + '/api/FullPayment/Add-FullPayment';
//Add FullPayment data in Database
async function AddFullPayment(FullPaymentData){
    await fetch(AddFullPaymentURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(FullPaymentData)
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
    GetAllFullPayments();
    displayFullPaymentTable();
};


const UpdateStatusURL = mainURL + '/api/CourseEnroll/Update-Status';
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
    GetAllCourseEnrollData();
}

const UpdatePaymentIdURL = mainURL + '/api/CourseEnroll/Add-payment-Id';
//Update CourseEnroll PaymentId
async function UpdatePaymentId(CourseEnrollId , InstallmentId , FullPaymentId){
    await fetch(`${UpdatePaymentIdURL}/${CourseEnrollId}/${InstallmentId}/${FullPaymentId}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
    GetAllCourseEnrollData();
}

const UpdateInstallmentURL = mainURL + '/api/Installment/Update-Installment';
//Update Installments
async function UpdateInstallment(installmentId , paidAmount){
    await fetch(`${UpdateInstallmentURL}/${installmentId}/${paidAmount}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
    GetAllInstallments();
}

const AddInstallmentURL = mainURL + '/api/Installment/Add-installment';
//Add Stud
async function AddInstallment(InstallmentData){
    await fetch(AddInstallmentURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(InstallmentData)
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
    GetAllInstallments();
    displayInstallmentPaymentTable();
};

const AddNotificationURL = mainURL + '/api/Notification/Add-Notification';
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
}




let totalAmount = 0;
let installmentAmount = 0;

document.getElementById('nic').addEventListener("keyup" , () =>{
    const nic = document.getElementById('nic').value.trim();
    const student = students.find((student) => student.nic == nic);
            
    if(student){
        if(student.courseEnrollId != null){
            const CourseEnrollDetail = courseEnrollData.find(c => c.id === student.courseEnrollId);
            const CourseDetails = courses.find(c => c.id == CourseEnrollDetail.courseId)

            if(CourseEnrollDetail != null){
                document.getElementById('fee-management-message').textContent = student.fullName;
                document.getElementById('fee-management-message').style.color = "green";
    
                courses.forEach(element => {
                    if(element.courseName == CourseDetails.courseName && element.level == CourseDetails.level){
                        document.getElementById('total-course-fee').textContent = `${element.totalFee} Rs`;
                        document.getElementById('total-amount').textContent = `${element.totalFee} Rs`;
                        if(CourseEnrollDetail.duration == "3"){
                            installmentAmount = (element.totalFee / 3).toFixed(0);
                            document.getElementById('installment-amount').textContent = `${installmentAmount} Rs / Month`
                        }else if(CourseEnrollDetail.duration == "6"){
                                installmentAmount = (element.totalFee / 6).toFixed(0);
                                document.getElementById('installment-amount').textContent = `${installmentAmount} Rs / Month`
                        }
                        totalAmount = element.totalFee;
                    }
                });
    
            }

        }else{
            document.getElementById('fee-management-message').textContent = `${student.fullName} didnt select a course`;
            document.getElementById('fee-management-message').style.color = "red";
            document.getElementById('total-course-fee').textContent = `0 Rs`;
            document.getElementById('total-amount').textContent = `0 Rs`;
            document.getElementById('installment-amount').textContent = `0 Rs`;
        }

    }else{
        document.getElementById('fee-management-message').textContent = "Student not found";
        document.getElementById('fee-management-message').style.color = "red";
    }

    if(nic.length == 0){
        document.getElementById('fee-management-message').textContent = "";
    }

});

function generateFullPymentID(lastID) {
    let numericPart = parseInt(lastID.slice(1));
    numericPart++;
    let newID = "F" + numericPart.toString().padStart(3, "0");
    return newID;
}
function generateInstallmentID(lastID) {
    let numericPart = parseInt(lastID.slice(1));
    numericPart++;
    let newID = "I" + numericPart.toString().padStart(3, "0");
    return newID;
}

let lastFullpaymentID;

function GetLastFullpaymentId(){
    if(FullpaymentDetails.length != 0){
        lastFullpaymentID = FullpaymentDetails[FullpaymentDetails.length - 1].id
    }else{
        lastFullpaymentID = "F000";
    }    
}

let lastInstallmentID;

function GetLastInstallmentId(){
    if(InstallmentDetails.length != 0){
        lastInstallmentID = InstallmentDetails[InstallmentDetails.length - 1].id
    }else{
        lastInstallmentID = "I000";
    }    
}

//Form Submit Function
document.getElementById('fee-management-form').addEventListener('submit' ,(event) =>{
    event.preventDefault();


    const paymentplan = document.getElementById('payment-plan').value;
    const nic = document.getElementById('nic').value.trim();
    const student = students.find((student) => student.nic == nic);

    const CourseEnrollDetail = courseEnrollData.find(c => c.id == student.courseEnrollId)
    const FullPayment = FullpaymentDetails.find(p => p.id == CourseEnrollDetail.fullPaymentId)

    const date = new Date();
    let fullPaymentid = generateFullPymentID(lastFullpaymentID);
    let installmentid = generateInstallmentID(lastInstallmentID);

    if(paymentplan == "fullpayment"){

        if(CourseEnrollDetail.installmentId != null && CourseEnrollDetail.fullPaymentId == null){
            document.getElementById('fee-management-message').textContent = "Wrong Payment Method";
            document.getElementById('fee-management-message').style.color = "red";
        }else{
            if(FullPayment && CourseEnrollDetail.status == "Active"){
                document.getElementById('fee-management-message').textContent = "Student already paid FullPayment";
            }else{
                // Update Payment Id in CourseEnroll Data
                UpdatePaymentId(CourseEnrollDetail.id , null , fullPaymentid)

                const Status = "Active" ;
                // Update Status Of Course in CourseEnroll Data
                UpdateStatus(CourseEnrollDetail.id , Status)

                const FullPaymentData = {
                    id:fullPaymentid,
                    nic,
                    fullPayment:totalAmount,
                    paymentDate:date
                }

                const NotificationData = {
                    nic,
                    type:"FullPayment",
                    sourceId:fullPaymentid,
                    date:date
                }

                // Add Full payment Details
                AddFullPayment(FullPaymentData);
                // Add Payment Notification
                AddNotification(NotificationData);

                document.getElementById('fee-management-message').textContent = `${student.fullName} Paid Full Payment`;
                displayFullPaymentTable();
            }
        }


    }
    else if(paymentplan == "installment"){


        if(CourseEnrollDetail.fullPaymentId != null ){
            document.getElementById('fee-management-message').textContent = "Student already paid Full payment";
        }
        else{

            Installment(student,installmentid,CourseEnrollDetail);
        }

    }else{
        document.getElementById('fee-management-message').textContent = "Please select the payment Plan";
    }

    setTimeout(()=>{
        document.getElementById('fee-management-message').textContent = "";
        }, 3000);
    
    document.getElementById('total-course-fee').textContent = `0 Rs`;
    document.getElementById('total-amount').textContent = `0 Rs`;
    document.getElementById('installment-amount').textContent = `0 Rs`;

    event.target.reset();

});


//Installment Calculation
function Installment(student,paymentId,CourseEnrollDetail){
    // Today Date 
    const today = new Date();

    const studentInstallment = InstallmentDetails.find((installment) => installment.id == CourseEnrollDetail.installmentId)

    if(studentInstallment != null && CourseEnrollDetail.status != "Pending"){
        if(studentInstallment.paymentDue <= 0){
            document.getElementById('fee-management-message').style.color = "green";
            document.getElementById('fee-management-message').textContent = `${student.fullName} paid Full installment plan`;
        }else{
            const NotificationData = {
                nic:student.nic,
                type:"Installment",
                sourceId:studentInstallment.id,
                date:today
            };

            //Update Installment details
            UpdateInstallment(studentInstallment.id , installmentAmount);
            //Add notification 
            AddNotification(NotificationData);
            document.getElementById('fee-management-message').textContent = `${student.fullName} Paid Installment Payment`;
        }
        
    }else{
        let paymentDue = totalAmount - installmentAmount
        // Update PaymentId in CourseEnroll Data
        UpdatePaymentId(CourseEnrollDetail.id , paymentId , null)

        const Status = "Active" ;
        // Update Status Of Course in CourseEnroll Data
        UpdateStatus(CourseEnrollDetail.id , Status)

        const InstallmentData = {
            id:paymentId,
            nic:student.nic,
            totalAmount,
            installmentAmount,
            installments:CourseEnrollDetail.duration,
            paymentDue,
            paymentPaid:installmentAmount,
            paymentDate:today
        }

        const NotificationData = {
            nic:student.nic,
            type:"Installment",
            sourceId:paymentId,
            date:today
        };

        // Add Installment Details
        AddInstallment(InstallmentData);
        // Add Notification
        AddNotification(NotificationData);
        document.getElementById('fee-management-message').textContent = `${student.fullName} Paid Installment Payment`
        displayInstallmentPaymentTable();
    }
}



//Pop up box For Payment details
document.getElementById("student-payment-details").addEventListener("click" , ()=>{
    document.getElementById("overlay").style.display ="block"
    document.getElementById("popupbox").style.display ="block"
});

document.getElementById("overlay").addEventListener("click" , ()=>{
    document.getElementById("overlay").style.display ="none"
    document.getElementById("popupbox").style.display ="none"
});

//Installment Payment Table
function displayInstallmentPaymentTable(){

    const tableBody = document.getElementById('table-body-installment');
    tableBody.innerHTML = "";
    InstallmentDetails.forEach((installment) => {
        const student = students.find(s => s.nic == installment.nic)
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${installment.id}</td>
            <td>${student.fullName}</td>
            <td>${(installment.installmentAmount).toFixed(0)}/= </td>
            <td>${(installment.paymentPaid).toFixed(0)}/= </td>
            <td>${(installment.paymentDue).toFixed(0) < 0 ? 0 : (installment.paymentDue).toFixed(0)}/= </td>
        `;
        tableBody.appendChild(row);
    });
}
displayInstallmentPaymentTable();

//Full Payment Table

function displayFullPaymentTable(){

    const table = document.getElementById('table-body-fullpayment');
    table.innerHTML = "";
    FullpaymentDetails.forEach((fullpayment) => {
        const student = students.find(s => s.nic == fullpayment.nic);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${fullpayment.id}</td>
            <td>${fullpayment.nic}</td>
            <td>${student.fullName}</td>
            <td>${fullpayment.fullPayment}/= </td>
            <td>${fullpayment.fullPayment}/= </td>
        `;
        table.appendChild(row);
    })
}
displayFullPaymentTable();



document.getElementById("installment-btn").addEventListener('click',() =>{
    document.querySelector("#table-1").style.display = "block"
    document.querySelector("#table-2").style.display = "none"
})
document.getElementById("full-payment-btn").addEventListener('click',() =>{
    document.querySelector("#table-1").style.display = "none"
    document.querySelector("#table-2").style.display = "block"
})


//Logout function
function logout() {
    window.location.href = "../01_Admin_Login/admin_login.html";
}

const logoutButton = document.getElementById('logoutButton');
logoutButton.addEventListener('click', function() {
    logout();
});

