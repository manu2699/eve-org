import React, { createContext, useState } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";

export const AuthContext = createContext();

const AuthContextProvider = props => {
  let tok = localStorage.getItem("Token");

  const [isAuth, setIsAuth] = useState(tok);
  const [details, setDetails] = useState({ name: "", email: "", id: "", type: "" });

  const afterAuth = data => {
    setIsAuth(data.token);
    localStorage.setItem("Token", data.token);
    let decode = jwt_decode(data.token);
    setDetails({
      name: data.name,
      email: data.email,
      _id: decode._id,
      type: decode.type
    });
  };

  const logOut = () => {
    localStorage.removeItem("Token");
    setIsAuth(null);
    setDetails({ name: "", email: "" });
  };

  const init = () => {
    let decode = jwt_decode(tok);
    axios
      .get(`/users/${decode._id}`)
      .then(res => {
        setIsAuth(tok);
        setDetails({
          name: res.data.name,
          email: res.data.email,
          id: decode._id
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <AuthContext.Provider
      value={{ isAuth, details, afterAuth, logOut, init }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
