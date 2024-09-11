// Initialize EmailJS with your public key
(function() {
    emailjs.init("aAS2beu7Twp64U6jd");  // Replace with your actual public key
})();

// Toggle the visibility of the registration options (Classes, Exam, Both)
function toggleRegistrationOptions() {
    const registrationType = document.getElementById('registrationType').value;
    const classSection = document.getElementById('classRegistrationSection');
    const examSection = document.getElementById('examRegistrationSection');

    // Reset and hide all sections
    resetFields(classSection);
    resetFields(examSection);
    classSection.style.display = 'none';
    examSection.style.display = 'none';

    // Show relevant sections based on registration type
    if (registrationType === 'classes') {
        classSection.style.display = 'block';
    } else if (registrationType === 'exam') {
        examSection.style.display = 'block';
    } else if (registrationType === 'both') {
        classSection.style.display = 'block';
        examSection.style.display = 'block';
    }
}

// Toggle the visibility of options for private or group classes
function toggleClassOptions() {
    const classType = document.getElementById('classType').value;
    const groupClassCourses = document.getElementById('groupClassCourses');
    const privateClassOptions = document.getElementById('privateClassOptions');
    const course = document.getElementById('course');

    // Hide both options initially
    groupClassCourses.style.display = 'none';
    privateClassOptions.style.display = 'none';

    if (classType === 'group') {
        groupClassCourses.style.display = 'block';
    } else if (classType === 'private') {
        privateClassOptions.style.display = 'block';
        course.required = false;  // Remove course requirement for private classes
    }
}

// Toggle IELTS options when Exam Type is IELTS
function toggleIeltsOptions() {
    const examType = document.getElementById('examType').value;
    const ieltsType = document.getElementById('ieltsType');

    if (examType === 'ielts') {
        ieltsType.style.display = 'block';
        document.getElementById('ieltsTypeSelect').required = true;
    } else {
        ieltsType.style.display = 'none';
        document.getElementById('ieltsTypeSelect').required = false;
    }
}

// Reset all fields in a section
function resetFields(section) {
    if (!section) return; // Ensure section exists
    const inputs = section.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.value = '';
        input.checked = false;
        input.required = false;
    });
}

// Validate the form and trigger email sending if valid
function validateForm() {
    const form = document.getElementById('registrationForm');

    if (form.checkValidity()) {
        sendEmail();  // If the form is valid, send the email
    } else {
        form.classList.add('was-validated');  // Add validation classes if invalid
    }
}

// Function to send email using EmailJS
function sendEmail() {
    const fullName = document.getElementById('fullName').value;
    const dob = document.getElementById('dob').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const registrationType = document.getElementById('registrationType').value;
    const classType = document.getElementById('classType').value || "N/A";
    const privateHours = document.getElementById('privateHours') ? document.getElementById('privateHours').value : "N/A";
    const course = document.getElementById('groupCourse') ? document.getElementById('groupCourse').value : "N/A";
    const classStartDate = document.getElementById('classStartDate').value || "N/A";
    const examType = document.getElementById('examType').value || "N/A";
    const ieltsType = document.getElementById('ieltsTypeSelect') ? document.getElementById('ieltsTypeSelect').value : "N/A";
    const examDate = document.getElementById('examDate').value || "N/A";
    const passportCopy = document.getElementById('passportCopy').files[0] ? document.getElementById('passportCopy').files[0].name : "N/A";

    const templateParams = {
        fullName,
        dob,
        email,
        phone,
        address,
        registrationType,
        classType,
        privateHours,
        course,
        classStartDate,
        examType,
        ieltsType,
        examDate,
        passportCopy
    };

    console.log("Sending email with params:", templateParams);  // Debugging log

    emailjs.send("service_msihk69", "template_chg044c", templateParams)
        .then(function(response) {
            console.log('Email sent successfully:', response);
            alert('Registration successful!');
            document.getElementById('registrationForm').reset();  // Reset form after submission
        }, function(error) {
            console.error('Email send error:', error);
            alert('Failed to send registration details. Please try again later.');
        });
}
