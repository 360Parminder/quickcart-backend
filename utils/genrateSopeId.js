export function generateScopeId() {
    const now = Date.now(); // Get the current timestamp
    const randomNum = Math.floor(Math.random() * 1000000); // Generate a random number between 0 and 999999
    const scopeId = (now + randomNum).toString().slice(-7); // Combine and take the last 7 digits
    return scopeId;
}

