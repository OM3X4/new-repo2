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

    // Step 2: Display instructions to the user
    instructionsDiv.innerHTML = `
      <p>To sign in, visit: <a href="${verificationUri}" target="_blank">${verificationUri}</a></p>
      <p>Enter the code: <strong>${userCode}</strong></p>
    `;

    // Step 3: Poll GitHub to check if the user authorized the app
    const pollInterval = deviceCodeData.interval * 1000;

    const pollForAccessToken = async () => {
      while (true) {
        await new Promise((resolve) => setTimeout(resolve, pollInterval));

        const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            client_id: clientID,
            device_code: deviceCode,
            grant_type: "urn:ietf:params:oauth:grant-type:device_code",
          }),
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.access_token) {
          // Step 4: Fetch user data
          const userResponse = await fetch("https://api.github.com/user", {
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
            },
          });

          const user = await userResponse.json();

          // Display user info
          userInfoDiv.innerHTML = `
            <h1>Welcome, ${user.name}!</h1>
            <p>Username: ${user.login}</p>
            <img src="${user.avatar_url}" alt="GitHub Avatar" width="100">
          `;
          break;
        } else if (tokenData.error === "authorization_pending") {
          // Continue polling
          console.log("Waiting for user authorization...");
        } else {
          console.error("Error during token polling:", tokenData.error);
          break;
        }
      }
    };

    pollForAccessToken();
  } catch (error) {
    console.error("Error during sign-in process:", error);
  }
});
