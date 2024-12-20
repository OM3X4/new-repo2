        // Initialize the Facebook SDK
        window.fbAsyncInit = function() {
            FB.init({
                appId      : '468825406321179', // Replace with your App ID from Facebook Developer Console
                cookie     : true,  // Enable cookies to allow the server to access the session
                xfbml      : true,  // Parse social plugins on this page
                version    : 'v12.0' // Use the latest version of the Graph API
            });

            FB.AppEvents.logPageView(); // Log page view for analytics
        };

        // Asynchronously load the SDK
        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));


function loginWithFacebook() {
    FB.login(function(response) {
        if (response.authResponse) {
            console.log('Logged in successfully');
            // Fetch user data with available fields
            FB.api('/me', { 
                fields: 'id,name,email,picture,gender,first_name,last_name,locale' 
            }, function(response) {
                console.log('User data:', response);
                document.getElementById("nameInput").value = response.name;
                // Display more information such as email, gender, picture, etc.
            });
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, { scope: 'public_profile,email' }); // Default permissions: public_profile and email
}