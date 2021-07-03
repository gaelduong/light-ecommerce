import React from "react";

const AdminContainer = ({ history, children }) => {
   const logoutHandler = () => {
      const delete_cookie = (name) => {
         document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      };
      delete_cookie("accessToken");
      history.push("/login");
   };
   return (
      <div className="container">
         <button onClick={logoutHandler}> Log out </button>
         {children}
      </div>
   );
};

export default AdminContainer;
