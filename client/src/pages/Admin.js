import React, { useState, useEffect } from "react";
import axios from "axios";

const serverUrl = process.env.NODE_ENV === "development" ? "http://localhost:5000" : process.env.REACT_APP_API_BASE_URL;

const Admin = () => {
    const [products, setProducts] = useState([]);
    const [productNameInput, setProductNameInput] = useState("");
    const [productNameEdit, setProductNameEdit] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [currentProductEditId, setCurrentProductEditId] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            // console.log(process.env.NODE_ENV);
            const { data } = await axios.get(`${serverUrl}/products`);
            setProducts(data);
        };
        fetchProducts();
    }, []);

    const handleNameInputChange = (e) => {
        setProductNameInput(e.target.value);
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();

        const { data } = await axios.post(`${serverUrl}/products`, {
            name: productNameInput
        });
        const newProducts = [...products];
        newProducts.push(data);
        setProducts(newProducts);
        setProductNameInput("");
    };

    const handleDeleteProduct = async (e, id) => {
        const { data } = await axios.delete(`${serverUrl}/products/${id}`);
        const newProducts = [...products].filter((product) => product._id !== data._id);
        setProducts(newProducts);
    };

    const handleEditProduct = async (e) => {
        e.preventDefault();
        const { data } = await axios.put(`${serverUrl}/products/${currentProductEditId}`, { name: productNameEdit });
        const newProducts = products.map((product) => {
            return product._id === currentProductEditId ? data : product;
        });
        setProducts(newProducts);
        setIsEdit(false);
        setCurrentProductEditId("");
    };

    const handleNameEditChange = (e) => {
        setProductNameEdit(e.target.value);
    };

    const handleEnableProductEdit = (e, id) => {
        setCurrentProductEditId(id);
        setIsEdit(true);
        const product = products.find((product) => product._id === id);
        setProductNameEdit(product.name);
    };

    const editForm = (
        <form onSubmit={handleEditProduct}>
            <label>
                New name:
                <input type="text" value={productNameEdit} onChange={handleNameEditChange} />
            </label>
            <input type="submit" value="Update" />
            <button
                onClick={() => {
                    setIsEdit(false);
                    setCurrentProductEditId("");
                }}
            >
                Cancel
            </button>
        </form>
    );

    return (
        <div className="Admin">
            <form onSubmit={handleAddProduct}>
                <label>
                    Name:
                    <input type="text" value={productNameInput} onChange={handleNameInputChange} />
                </label>
                <input type="submit" value="Add product" />
            </form>

            {isEdit ? editForm : ""}

            <h2>My products: </h2>
            <ol>
                {products.map(({ _id, name }) => {
                    return (
                        <li style={{ color: currentProductEditId === _id ? "red" : "white" }} key={_id}>
                            <span> {name} </span>
                            <button onClick={(e) => handleEnableProductEdit(e, _id)}>Edit</button>
                            <button onClick={(e) => handleDeleteProduct(e, _id)}> X </button>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
};

export default Admin;
