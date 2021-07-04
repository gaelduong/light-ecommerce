import { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../config";
import { getCookieValue } from "../shared/util.js";

const useVerifyAuth = (history) => {
   const [authVerified, setAuthVerified] = useState(false);

   useEffect(() => {
      const redirectToLogin = () => history.push("/login");
      const accessToken = getCookieValue("accessToken");
      if (!accessToken) redirectToLogin();

      const verifyLoggedIn = async (accessToken) => {
         try {
            await axios.get(`${apiUrl}/isloggedin`, {
               headers: {
                  Authorization: `Bearer ${accessToken}`
               }
            });
            setAuthVerified(true);
         } catch (error) {
            console.log(error);
            redirectToLogin();
         }
      };
      verifyLoggedIn(accessToken);
   }, [history]);

   return authVerified;
};

export default useVerifyAuth;
