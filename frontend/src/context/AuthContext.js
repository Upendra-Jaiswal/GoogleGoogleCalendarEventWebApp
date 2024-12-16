import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Holds user information
  const [loading, setLoading] = useState(true); // Loading state for async operations
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Tracks login status
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  // Fetch user login information
  const fetchUser = async () => {
    try {
      const response = await fetch("http://localhost:3001/google/getUser", {
        credentials: "include", // Include cookies for session management
      });

      if (response.ok) {
        const userData = await response.json();

        // Validate and set user state
        // if (userData.tokenType === "Bearer") {
        if (userData.accessToken) {
          setIsLoggedIn(true);
          console.log(userData);
          // console.log(userData);
          setUser(userData.accessToken);
          //  setUser({ scope: userData.accessToken }); // Only store non-sensitive data
          ////conso{ scope: userData.accessToken });
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      //  setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      // Simulating login process (replace this with your actual login logic)
      window.location.href = "http://localhost:3001/google/redirect";
      // setIsLoggedIn(true);
      // Assume login is successful and set isLoggedIn to true
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const response = await fetch("http://localhost:3001/google/logout", {
        method: "POST",
        credentials: "include", // Include cookies if used
      });

      if (response.ok) {
        console.log("Logout successful");
        // setIsLoggedIn(false);
        setUser(null);
        fetchUser();

        // window.location.href = "/dashboard"; // Redirect to login page
      } else {
        throw new Error("Failed to logout");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      //fetchUser();
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,

        loading,
        isLoggedIn,
        login,
        logout,
        events,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
