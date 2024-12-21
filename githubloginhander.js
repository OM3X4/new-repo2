const clientID = "Iv23li14mhgQnf9KpKiq"; // Replace with your GitHub Client ID
const signInButton = document.getElementById("signIn");
const instructionsDiv = document.getElementById("instructions");
const userInfoDiv = document.getElementById("userInfo");

signInButton.addEventListener("click", async () => {
  try {
    // Step 1: Request a device code
    const deviceCodeResponse = await fetch("https://github.com/login/device/code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientID,
        scope: "read:user",
      }),
    });

    const deviceCodeData = await deviceCodeResponse.json();

    const userCode = deviceCodeData.user_code;
    const verificationUri = deviceCodeData.verification_uri;
    const deviceCode = deviceCodeData.device_code;

    // Display instructions to the user
    instructionsDiv.innerHTML = `Please go to <a href="${verificationUri}" target="_blank">${verificationUri}</a> and enter the code: ${userCode}`;

    // Step 2: Poll for the access token
    let accessToken;
    while (!accessToken) {
      await new Promise(resolve => setTimeout(resolve, deviceCodeData.interval * 1000));

      const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          client_id: clientID,
          device_code: deviceCode,
          grant_type: "urn:ietf:params:oauth:grant-type:device_code",
        }),
      });

      const tokenData = await tokenResponse.json();

      if (tokenData.access_token) {
        accessToken = tokenData.access_token;
      } else if (tokenData.error && tokenData.error !== "authorization_pending") {
        throw new Error(tokenData.error);
      }
    }

    // Step 3: Use the access token to get user info
    const userResponse = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const userData = await userResponse.json();

    // Display user info
    userInfoDiv.innerHTML = `Hello, ${userData.login}!`;

  } catch (error) {
    console.error("Error during GitHub sign-in:", error);
    instructionsDiv.innerHTML = "An error occurred during sign-in. Please try again.";
  }
});