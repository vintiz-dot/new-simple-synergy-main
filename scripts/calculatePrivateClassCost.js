// calculatePrivateClassCost.js
export const calculatePrivateClassCost = (formElements, classFees) => {
    // Get raw values from the form
    const rawLocation = formElements.privateLocation?.value;
    const schedule = formElements.privateSchedule?.value;
    
    console.log("Raw privateLocation:", rawLocation);
    const location = rawLocation ? rawLocation.trim().toLowerCase() : '';
    console.log("Normalized privateLocation:", location);
    console.log("Private schedule:", schedule);
    
    // Only calculate if both location and schedule are provided
    if (!location || !schedule) {
      console.log("Location or schedule not selected. Returning 0.");
      return 0;
    }
    
    // Validate schedule format: expected "<contacts>-contacts-<hours>-hours"
    const scheduleRegex = /^(\d+)-contacts-(\d+)-hours$/;
    const match = schedule.trim().toLowerCase().match(scheduleRegex);
    if (!match) {
      console.error("Invalid schedule format. Expected format: <contacts>-contacts-<hours>-hours. Received:", schedule);
      return 0;
    }
    
    const contactsPerWeek = parseInt(match[1], 10);
    const hoursPerContact = parseInt(match[2], 10);
    
    // Debug: Log available keys in classFees.privateClass
    const availableKeys = classFees?.privateClass ? Object.keys(classFees.privateClass) : [];
    console.log("Available privateClass keys:", availableKeys);
    
    if (!classFees || !classFees.privateClass || classFees.privateClass[location] === undefined) {
      console.error(`Private class fee for location "${location}" is not defined.`);
      return 0;
    }
    
    // Calculate monthly cost: fee per hour * contacts per week * hours per contact * 4 weeks
    const monthlyCost = classFees.privateClass[location] * contactsPerWeek * hoursPerContact * 4;
    console.log(`Calculated monthly cost for location "${location}":`, monthlyCost);
    
    return monthlyCost;
  };
  