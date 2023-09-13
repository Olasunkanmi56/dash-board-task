import React, { useReducer } from "react";
import MkdSDK from "./utils/MkdSDK";

export const AuthContext = React.createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  role: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      //TODO
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        role: action.payload.role,
      };
    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

let sdk = new MkdSDK();

export const tokenExpireError = (dispatch, errorMessage) => {
  const role = localStorage.getItem("role");
  if (errorMessage === "TOKEN_EXPIRED") {
    dispatch({
      type: "Logout",
    });
    window.location.href = "/" + role + "/login";
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  React.useEffect(() => {
    //TODO
    const checkAuthentication = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (token && role) {
        try {
          const parts = token.split(".");
          if (parts.length !== 3) {
            throw new Error("Invalid token format");
          }
          const payload = JSON.parse(atob(parts[1]));
          if (payload.exp) {
            const currentTimestamp = Math.floor(Date.now() / 1000);
            if (payload.exp < currentTimestamp) {
              dispatch({ type: "LOGOUT" });
              return;
            }
          }
          const user = null; 
          dispatch({
            type: "LOGIN",
            payload: {
              user,
              token,
              role,
            },
          });
        } catch (error) {
          console.error("Error during token validation:", error);
        }
      }
    };


    checkAuthentication();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
