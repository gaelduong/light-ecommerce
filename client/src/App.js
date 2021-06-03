import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
const serverUrl = "http://localhost:5000";

const App = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            // console.log(process.env.NODE_ENV);
            // const serverUrl = process.env.REACT_APP_API_BASE_URL ? process.env.REACT_APP_API_BASE_URL : "http://localhost:5000";
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
                return <p>{product.name}</p>;
            })}
        </div>
    );
};

export default App;
