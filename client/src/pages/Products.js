import React, { useState, useEffect } from "react";
import axios from "axios";

const serverUrl = process.env.NODE_ENV === "development" ? "http://localhost:5000" : process.env.REACT_APP_API_BASE_URL;

const Products = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await axios.get(`${serverUrl}/products`);
            setProducts(data);
        };
        fetchProducts();
    }, []);

    return (
        <div className="Products">
            <h2>My products: </h2>
            <ol>
                {products.map(({ _id, name }) => {
                    return (
                        <li key={_id}>
                            <span> {name} </span>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
};

export default Products;
