import React, { useState } from "react";
import axios from "axios";
import { serverUrl } from "../config";

const Login = () => {
    const [nameValue, setNameValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [loginResultMessage, setLoginResultMessage] = useState("");

    const loginHandle = async (e) => {
        e.preventDefault();

        // Send login post request to server
        try {
            await axios.post(`${serverUrl}/login`, {
                name: nameValue,
                password: passwordValue
            });
            setLoginResultMessage("Login success");
        } catch (e) {
            console.log(e);
            setLoginResultMessage("Incorrect username/password");
        }

        // If rejected, display login fail message
        // If success, save jwt token to cookies/local storage
        // Redirect to /admin
    };
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
