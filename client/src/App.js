import React, { useState, useEffect } from "react";
import axios from "axios";

import "./App.css";

const App = () => {
    const [products, setProducts] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            // console.log(process.env.NODE_ENV);
            // const serverUrl = process.env.REACT_APP_API_BASE_URL ? process.env.REACT_APP_API_BASE_URL : "http://localhost:5000";
            const serverUrl = "http://localhost:5000";
            const { data } = await axios.get(`${serverUrl}/products`);
            console.log(data);
            setProducts(data);
        };
        fetchProducts();
    }, []);

    return <div className="App"> My products: {products.name} </div>;
};

export default App;
