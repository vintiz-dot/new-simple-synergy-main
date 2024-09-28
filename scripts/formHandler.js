document.addEventListener("DOMContentLoaded", function () {
    // Initialize EmailJS with your public key
    emailjs.init("aAS2beu7Twp64U6jd");

    // Helper function to safely get an element by ID, returning null if not found
    const getElement = (id) => document.getElementById(id) || null;

    // Function to toggle the visibility of a section based on a condition (e.g., a dropdown selection)
    const toggleDisplay = (element, condition) => {
        if (element) {
            element.style.display = condition ? 'block' : 'none';
        }
    };

    // Function to reset input fields within a specific section
    const resetFields = (section) => {
        if (!section) return;
        const inputs = section.querySelectorAll('input, select');
        inputs.forEach(input => input.value = ''); // Reset all input values to an empty string
    };

    // Object to store references to important form elements
    const formElements = {
        registrationType: getElement('registrationType'),
        classType: getElement('classType'),
        groupCourse: getElement('groupCourse'),
        privateLocation: getElement('privateLocation'),
        privateSchedule: getElement('privateSchedule'),
        examType: getElement('examType'),
        ieltsMode: getElement('ieltsMode'),
        ieltsCategory: getElement('ieltsCategory'),
        ieltsCategoryExam: getElement('ieltsCategoryExam'),
        totalCostElement: getElement('totalCost'), // Display element for total cost
        registrationForm: getElement('registrationForm') // Form element
    };

    // Object to store references to sections of the form that are conditionally shown
    const classSections = {
        classRegistrationSection: getElement('classRegistrationSection'),
        examRegistrationSection: getElement('examRegistrationSection'),
        groupClassCourses: getElement('groupClassCourses'),
        privateClassOptions: getElement('privateClassOptions'),
        ieltsOptions: getElement('ieltsOptions'),
        ieltsCategory: getElement('ieltsCategory')
    };

    // Object to define prices for various classes and exams
    const prices = {
        groupClass: {
            IELTS: 80000,
            GRE: 100000,
            GMAT: 130000,
            TOEFL: 85000,
            PTE: 85000,
            SAT: 100000
        },
        privateClass: {
            'center': 8000, // Price per hour at the center
            'client-location': 10000 // Price per hour at the client's preferred location
        },
        ieltsExam: {
            'paper': {
                'academic': 258000, // Price for paper-based IELTS academic
                'general': 258000,  // Price for paper-based IELTS general
                'ukvi': 287000      // Price for paper-based IELTS UKVI
            },
            'computer': {
                'academic': 268000, // Price for computer-based IELTS academic
                'general': 268000,  // Price for computer-based IELTS general
                'ukvi': 287000      // Price for computer-based IELTS UKVI
            }
        },
        usdExams: {
            gre: 270,  // GRE exam in USD
            gmat: 310, // GMAT Focus Edition in USD
            sat: 140,  // SAT exam in USD
            toefl: 190, // TOEFL exam in USD
            pte: 200   // PTE exam in USD
        }
    };

    // Function to get the USD to NGN exchange rate
    const getExchangeRate = async () => {
        const url = 'https://v6.exchangerate-api.com/v6/b06accadc952b828842ed555/latest/USD'; // API link
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data && data.conversion_rates && data.conversion_rates.NGN) {
                return data.conversion_rates.NGN;
            } else {
                console.error('Failed to fetch exchange rate');
                return null;
            }
        } catch (error) {
            console.error('Error fetching exchange rate:', error);
            return null;
        }
    };

    // Function to calculate private class cost
    const calculatePrivateClassCost = () => {
        let totalCost = 0;
        const privateLocation = formElements.privateLocation?.value; // Get selected location
        const privateSchedule = formElements.privateSchedule?.value; // Get selected schedule

        if (privateLocation && privateSchedule) {
            // Extract contacts per week and hours per session from the schedule
            const scheduleParts = privateSchedule.match(/(\d+)-contacts-(\d+)-hours/);
            if (scheduleParts) {
                const contactsPerWeek = parseInt(scheduleParts[1], 10); // Number of contacts per week
                const hoursPerContact = parseInt(scheduleParts[2], 10); // Hours per contact/session
                // Calculate total cost for a month (4 weeks)
                totalCost = prices.privateClass[privateLocation] * contactsPerWeek * hoursPerContact * 4;
            }
        }

        return totalCost; // Return the calculated cost
    };

    // Calculate the cost for the exam (including USD-based exams)
    const calculateExamCost = async () => {
        let totalCost = 0;
        const examType = formElements.examType?.value;

        // If the selected exam is IELTS
        if (examType === 'ielts') {
            const ieltsMode = formElements.ieltsMode?.value; // Get the value of IELTS mode (paper/computer)
            const ieltsCategory = formElements.ieltsCategoryExam?.value; // Get the value of the IELTS category (academic/general/ukvi)
            if (ieltsMode && ieltsCategory && prices.ieltsExam[ieltsMode][ieltsCategory]) {
                totalCost = prices.ieltsExam[ieltsMode][ieltsCategory]; // Set the total cost based on mode and category
            }
        } else if (['gre', 'gmat', 'sat', 'toefl', 'pte'].includes(examType)) {
            // Get exchange rate for USD to NGN
            const exchangeRate = await getExchangeRate();
            if (exchangeRate && prices.usdExams[examType]) {
                totalCost = prices.usdExams[examType] * exchangeRate; // Convert USD exam price to NGN
            }
        }

        return totalCost;
    };

    // Function to update the displayed total cost
    const updateTotalCost = async () => {
        let totalCost = 0;
        const { registrationType, classType, groupCourse } = formElements;

        // Calculate cost of classes if "classes" or "both" is selected
        if (registrationType && ['classes', 'both'].includes(registrationType.value)) {
            if (classType.value === 'group' && groupCourse?.value) {
                totalCost += prices.groupClass[groupCourse.value]; // Add group class cost
            } else if (classType.value === 'private') {
                totalCost += calculatePrivateClassCost(); // Add private class cost
            }
        }

        // Add exam cost if "exam" or "both" is selected
        if (registrationType && ['exam', 'both'].includes(registrationType.value)) {
            totalCost += await calculateExamCost(); // Add exam cost
        }

        // Display the total cost in the designated element
        formElements.totalCostElement.textContent = `₦${totalCost.toLocaleString()}`;
    };

    // Function to toggle visibility of IELTS exam-related options
    const toggleExamOptions = () => {
        const { examType } = formElements;
        toggleDisplay(classSections.ieltsOptions, examType.value === 'ielts'); // Show IELTS options if IELTS is selected
        toggleDisplay(classSections.ieltsCategory, examType.value === 'ielts'); // Show IELTS category if IELTS is selected
        updateTotalCost(); // Update total cost
    };

    // Function to toggle visibility of registration sections (class and exam)
    const toggleRegistrationOptions = () => {
        const { registrationType } = formElements;
        toggleDisplay(classSections.classRegistrationSection, ['classes', 'both'].includes(registrationType.value)); // Show class section if needed
        toggleDisplay(classSections.examRegistrationSection, ['exam', 'both'].includes(registrationType.value)); // Show exam section if needed
        resetFields(classSections.classRegistrationSection); // Reset class section inputs
        resetFields(classSections.examRegistrationSection); // Reset exam section inputs
        updateTotalCost(); // Update total cost
    };

    // Function to toggle class options (group or private classes)
    const toggleClassOptions = () => {
        const { classType } = formElements;
        toggleDisplay(classSections.groupClassCourses, classType.value === 'group'); // Show group class options if selected
        toggleDisplay(classSections.privateClassOptions, classType.value === 'private'); // Show private class options if selected
        updateTotalCost(); // Update total cost
    };

    // Validate the form before submission
    const validateForm = () => {
        if (formElements.registrationForm.checkValidity()) {
            sendEmail(); // Send email if form is valid
        } else {
            formElements.registrationForm.classList.add('was-validated'); // Show validation errors
        }
    };

    // Function to send the form data using EmailJS
    const sendEmail = () => {
        const formData = {
            fullName: getElement('fullName')?.value || '',
            dob: getElement('dob')?.value || '',
            email: getElement('email')?.value || '',
            phone: getElement('phone')?.value || '',
            address: getElement('address')?.value || '',
            registrationType: formElements.registrationType?.value || '',
            classType: formElements.classType?.value || 'N/A',
            privateHours: getElement('privateHours')?.value || 'N/A',
            course: formElements.groupCourse?.value || 'N/A',
            classStartDate: getElement('classStartDate')?.value || 'N/A',
            examType: formElements.examType?.value || 'N/A',
            ieltsMode: formElements.ieltsMode?.value || 'N/A',
            examDate: getElement('examDate')?.value || 'N/A',
            passportCopy: getElement('passportCopy')?.files[0]?.name || 'N/A'
        };

        // Use EmailJS to send the form data via email
        emailjs.send("service_msihk69", "template_chg044c", formData)
            .then(() => {
                alert('Registration successful!');
                formElements.registrationForm.reset(); // Reset the form after successful submission
            })
            .catch(() => {
                alert('Failed to send registration details. Please try again later.');
            });
    };

    // Attach event listeners for different form elements to update costs or toggle options
    if (formElements.registrationType) formElements.registrationType.addEventListener('change', toggleRegistrationOptions);
    if (formElements.classType) formElements.classType.addEventListener('change', toggleClassOptions);
    if (formElements.groupCourse) formElements.groupCourse.addEventListener('change', updateTotalCost);
    if (formElements.privateLocation) formElements.privateLocation.addEventListener('change', updateTotalCost);
    if (formElements.privateSchedule) formElements.privateSchedule.addEventListener('change', updateTotalCost);
    if (formElements.examType) formElements.examType.addEventListener('change', toggleExamOptions);
    if (formElements.ieltsMode) formElements.ieltsMode.addEventListener('change', updateTotalCost);
    if (formElements.ieltsCategory) formElements.ieltsCategory.addEventListener('change', updateTotalCost);
});
