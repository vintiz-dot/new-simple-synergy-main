const CLIENT_ID = '170977434703-la0tmoe3ev3vs2dno77hdo6hk3j8cv5v.apps.googleusercontent.com';  
const API_KEY = 'AIzaSyD25TGdPCip6jjaTGxvwb6aKJx_t7iukgw';  
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";
const SPREADSHEET_ID = '1tv8RT-Mxr0cI2fc3OZ6Kq1_1899JX0PSBDT-9TibkK0';  
const RANGE = 'Sheet1!A2';  // The range where the data will be appended

let googleAuthInitialized = false;
let authInstance = null;  // To hold the initialized gapi.auth2 instance

// Load the API client and auth2 library
function handleClientLoad() {
    console.log('Loading Google API client...');
    gapi.load('client:auth2', initClient);
}

// Initialize the API client library and set up sign-in state listeners
function initClient() {
    console.log('Initializing Google API client...');
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        console.log('Google API client initialized.');
        googleAuthInitialized = true;
        authInstance = gapi.auth2.getAuthInstance();
        console.log('Auth Instance:', authInstance); // Check if authInstance is available

        // Enable the sign-in button
        document.getElementById('signin-button').disabled = false;
        console.log('Sign-in button enabled.');
    }, function (error) {
        console.error('Error during API initialization:', error);
    });
}

// Update sign-in status and enable the form when the user is signed in
function updateSigninStatus(isSignedIn) {
    console.log('Updating sign-in status:', isSignedIn);
    const submitButton = document.getElementById('submit-button');
    const signOutButton = document.getElementById('signout-button');
    const signInButton = document.getElementById('signin-button');
    
    if (isSignedIn) {
        console.log('User signed in');
        submitButton.disabled = false;  // Enable form submission
        signOutButton.style.display = 'inline-block';  // Show the sign-out button
        signInButton.style.display = 'none';  // Hide the sign-in button
    } else {
        console.log('User not signed in');
        submitButton.disabled = true;  // Disable form submission
        signOutButton.style.display = 'none';  // Hide the sign-out button
        signInButton.style.display = 'inline-block';  // Show the sign-in button
    }
}

// Sign-in button click event
function handleSignInClick(event) {
    console.log('Sign-in button clicked');
    if (googleAuthInitialized && authInstance) {
        authInstance.signIn().then(() => {
            console.log('User signed in');
        }).catch((error) => {
            console.error('Sign-in error:', error);
        });
    } else {
        console.error('Google Auth2 is not initialized yet or authInstance is null.');
    }
}

// Sign-out button click event
function handleSignOutClick(event) {
    if (googleAuthInitialized && authInstance) {
        authInstance.signOut().then(() => {
            console.log('User signed out');
        }).catch((error) => {
            console.error('Sign-out error:', error);
        });
    }
}

// Attach event listeners after the DOM has fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, setting up event listeners.');

    const signInButton = document.getElementById('signin-button');
    const signOutButton = document.getElementById('signout-button');
    const submitButton = document.getElementById('submit-button');

    if (signInButton) {
        console.log('Adding event listener to sign-in button.');
        signInButton.addEventListener('click', handleSignInClick);
    }

    if (signOutButton) {
        console.log('Adding event listener to sign-out button.');
        signOutButton.addEventListener('click', handleSignOutClick);
    }

    if (submitButton) {
        console.log('Adding event listener to submit button.');
        submitButton.addEventListener('click', validateForm);
    }

    handleClientLoad();  // Ensure the Google API client is loaded after DOM is ready
});

// Function to send form data to Google Sheets
function sendDataToGoogleSheets() {
    if (gapi.client && gapi.client.sheets) {
        const formData = {
            fullName: document.getElementById('fullName').value,
            dob: document.getElementById('dob').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            registrationType: document.getElementById('registrationType').value,
            classType: document.getElementById('classType') ? document.getElementById('classType').value : '',
            privateHours: document.getElementById('privateHours') ? document.getElementById('privateHours').value : '',
            course: document.getElementById('course') ? document.getElementById('course').value : '',
            classStartDate: document.getElementById('classStartDate') ? document.getElementById('classStartDate').value : '',
            examType: document.getElementById('examType') ? document.getElementById('examType').value : '',
            ieltsType: document.getElementById('ieltsTypeSelect') ? document.getElementById('ieltsTypeSelect').value : '',
            examDate: document.getElementById('examDate') ? document.getElementById('examDate').value : '',
            passportCopy: document.getElementById('passportCopy').value  // Assuming this is the file input
        };

        gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: RANGE,
            valueInputOption: 'RAW',
            resource: {
                values: [
                    [formData.fullName, formData.dob, formData.email, formData.phone, formData.address, formData.registrationType, formData.classType, formData.privateHours, formData.course, formData.classStartDate, formData.examType, formData.ieltsType, formData.examDate, formData.passportCopy]
                ]
            }
        }).then(function(response) {
            alert('Registration successful!');
            document.getElementById('registrationForm').reset();
        }, function(error) {
            console.error('Error while sending data to Google Sheets:', error);
            alert('Failed to submit registration. Please try again.');
        });
    } else {
        console.error('Google Sheets API is not initialized.');
        alert('An error occurred while accessing the Sheets API. Please try again.');
    }
}

// Validate the form before submission
function validateForm() {
    const form = document.getElementById('registrationForm');

    if (form.checkValidity()) {
        sendDataToGoogleSheets();
    } else {
        form.classList.add('was-validated');
    }
}

// Toggle visibility of class options based on class type
function toggleClassOptions() {
    const classType = document.getElementById('classType').value;
    const privateClassHours = document.getElementById('privateClassHours');

    if (classType === 'private') {
        privateClassHours.style.display = 'block';
        document.getElementById('privateHours').required = true;
    } else {
        privateClassHours.style.display = 'none';
        document.getElementById('privateHours').required = false;
    }
}

// Toggle visibility of IELTS options based on exam type
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

// Toggle visibility of registration sections based on registration type
function toggleRegistrationOptions() {
    const registrationType = document.getElementById('registrationType').value;
    const classSection = document.getElementById('classRegistrationSection');
    const examSection = document.getElementById('examRegistrationSection');

    classSection.style.display = 'none';
    examSection.style.display = 'none';

    resetFields(classSection);
    resetFields(examSection);

    if (registrationType === 'classes') {
        classSection.style.display = 'block';
    } else if (registrationType === 'exam') {
        examSection.style.display = 'block';
    } else if (registrationType === 'both') {
        classSection.style.display = 'block';
        examSection.style.display = 'block';
    }
}

// Reset fields in a section
function resetFields(section) {
    if (section) {
        const inputs = section.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.value = '';
            input.checked = false;
            input.required = false;
        });
    }
}

// Attach event listeners after the DOM has fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const signInButton = document.getElementById('signin-button');
    const signOutButton = document.getElementById('signout-button');
    const submitButton = document.getElementById('submit-button');

    // Disable sign-in button until Google Auth2 is initialized
    signInButton.disabled = true;

    if (signInButton) {
        signInButton.addEventListener('click', handleSignInClick);
    }

    if (signOutButton) {
        signOutButton.addEventListener('click', handleSignOutClick);
    }

    if (submitButton) {
        submitButton.addEventListener('click', validateForm);
    }
});