import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const serverUrl = process.env.NODE_ENV === "development" ? "http://localhost:5000" : process.env.REACT_APP_API_BASE_URL;

const App = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            // console.log(process.env.NODE_ENV);
            const { data } = await axios.get(`${serverUrl}/products`);
            setProducts(data);
        };
        fetchProducts();
    }, []);

    const addProductHandler = async () => {
        const { data } = await axios.post(`${serverUrl}/products`, {
            name: "Watermelon"
        });
        console.log(data);
    };

    return (
        <div className="App">
            <button onClick={addProductHandler}> Add product</button>
            <h2>My products: </h2>
            {products.map((product) => {
                const name = product.name;
                return <p key={name}>{name}</p>;
            })}
        </div>
    );
};

export default App;
