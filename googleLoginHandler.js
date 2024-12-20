function parseJwt(token) {
    const base64Url = token.split('.')[1]; // Get the payload part
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Fix encoding
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function handleCredentialResponse(response) {
    console.log(parseJwt(response.credential));
    document.getElementById("nameInput").value = parseJwt(response.credential).name;
}

window.onload = function() {
    // Initialize Google Identity Services
    google.accounts.id.initialize({
        client_id: "51079260520-4hoibkqfam0ihpa1e8invmfmuuae7uf0",
        callback: handleCredentialResponse,
        auto_select: false, // Don't auto select the account
        cancel_on_tap_outside: true // Allow clicking outside to cancel
    });

    // Render the button within your custom button container
    google.accounts.id.renderButton(
        document.getElementById("custom-google-button"), 
        {
            type: "icon",  // Use standard instead of icon for full-width
            theme: "filled_black", // Apply the filled_blue theme
            size: "large", // Use the large size
            width: 1000 , 
            logo_alignment: "left", // Align the logo to the left
            text: "", // Show "Continue with Google"
            shape: "pill" // Use rectangular shape to match your design
        }
    );
};