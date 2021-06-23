import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../config";

const Login = ({ history }) => {
   const [loading, setLoading] = useState(true);
   const [nameValue, setNameValue] = useState("");
   const [passwordValue, setPasswordValue] = useState("");
   const [loginResultMessage, setLoginResultMessage] = useState("");

   useEffect(() => {
      // Redirect to /admin if already logged in
      const redirectToAdmin = () => history.push("/admin");
      const getCookieValue = (name) => document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || "";
      const accessToken = getCookieValue("accessToken");
      if (!accessToken) return setLoading(false);

      const verifyLoggedIn = async (accessToken) => {
         try {
            await axios.get(`${apiUrl}/isloggedin`, {
               headers: {
                  Authorization: `Bearer ${accessToken}`
               }
            });
            redirectToAdmin();
         } catch (error) {
            setLoading(false);
            console.log(error);
         }
      };
      verifyLoggedIn(accessToken);
   }, [history]);

   const loginHandle = async (e) => {
      e.preventDefault();

      try {
         const { data } = await axios.post(`${apiUrl}/login`, {
            name: nameValue,
            password: passwordValue
         });
         setLoginResultMessage("Login success");

         // Log in success -> save jwt token to cookies
         document.cookie = `accessToken=${data.accessToken}`;
         history.push("/admin");
      } catch (e) {
         console.log(e);
         setLoginResultMessage("Incorrect username/password");
      }
   };

   if (loading) return <></>;

   return (
      <div>
         <form onSubmit={loginHandle}>
            <label>
               <b> Username </b>
            </label>
            <input
               type="text"
               placeholder="Enter username"
               value={nameValue}
               onChange={(e) => {
                  setNameValue(e.target.value);
               }}
               required
            />
            <label>
               <b> Password </b>
            </label>
            <input
               type="password"
               placeholder="Enter password"
               value={passwordValue}
               onChange={(e) => {
                  setPasswordValue(e.target.value);
               }}
               required
            />
            <input type="submit" value="Login" />
         </form>
         <p> {loginResultMessage} </p>
      </div>
   );
};

export default Login;
