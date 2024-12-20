function parseJwt(token) {
    const base64Url = token.split('.')[1]; // Get the payload part
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Fix encoding
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function handleCredentialResponse(response) {
    console.log('Encoded JWT ID token:');
    // Use the credential to authenticate with your backend or process user information
}

// window.onload = function () {
//     // Initialize the Google Identity Services
//     google.accounts.id.initialize({
//         client_id: "51079260520-4hoibkqfam0ihpa1e8invmfmuuae7uf0",
//         callback: handleCredentialResponse,
//     });

//     // Attach the Google sign-in functionality to your custom button
//     const customButton = document.getElementById("custom-google-button");
//     customButton.addEventListener("click", () => {
//         console.log("Button clicked");
//         google.accounts.id.prompt(); // Shows the One Tap UI or Consent screen
//     });
// };