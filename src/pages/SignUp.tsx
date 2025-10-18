import React, { useEffect } from "react";
import { gapi } from "gapi-script";
import { useNavigate } from "react-router-dom";

const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID";
const API_KEY = "YOUR_GOOGLE_API_KEY";
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();

  // Initialize Google API client
  useEffect(() => {
    gapi.load("client:auth2", () => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        scope: SCOPES,
      });
    });
  }, []);

  const handleSignIn = () => {
    const authInstance = gapi.auth2.getAuthInstance();
    authInstance.signIn().then(() => {
      // Optionally store user info or token here
      navigate("/dashboard"); // Redirect to Dashboard
    });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Welcome to Ejenda</h1>
      <p>Sign in with your Google account to access your weekly calendar and routines.</p>
      <button
        onClick={handleSignIn}
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#4285F4",
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default SignUpPage;
