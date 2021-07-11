import { useState } from "react";
import axios from "axios";
import { apiUrl } from "../../config";
import { getCookieValue } from "../../shared/util.js";

const SearchBar = ({ setProducts, isPrivate }) => {
   const [searchText, setSearchText] = useState("");

   const handleSearchSubmit = (e) => {
      e.preventDefault();
      const headerConfig = isPrivate && {
         headers: {
            Authorization: `Bearer ${getCookieValue("accessToken")}`
         }
      };
      const route = isPrivate ? "search_admin" : "search";
      const fetchSearchedProduct = async () => {
         const { data } = await axios.post(
            `${apiUrl}/${route}`,
            {
               searchText
            },
            headerConfig
         );
         setProducts(data);
      };
      fetchSearchedProduct();
   };
   return (
      <div className="search-bar">
         <form onSubmit={handleSearchSubmit}>
            <label htmlFor="header-search"></label>
            <input
               className="inline"
               type="text"
               placeholder="Search product"
               name="name"
               value={searchText}
               onChange={(e) => setSearchText(e.target.value)}
            />
            <button className="inline" type="button" onClick={handleSearchSubmit}>
               Search
            </button>
         </form>
      </div>
   );
};

export default SearchBar;
