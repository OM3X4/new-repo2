

console.log("hi")

function parseJwt(token) {
    const base64Url = token.split('.')[1]; // Get the payload part
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Fix encoding
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function handleCredentialResponse(googleUser){
    // console.log((googleUser.credential))
    const cred = googleUser.credential
    console.log(parseJwt(cred))
}