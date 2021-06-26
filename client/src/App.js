import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Products, AdminMain, Login } from "./pages";
import "./App.css";
import AdminAddProduct from "./pages/AdminAddProduct";
import AdminEditProduct from "./pages/AdminEditProduct";

const App = () => {
   return (
      <Router>
         <div className="App">
            <nav>
               <ul>
                  <li>
                     <Link to="/products">Products</Link>
                  </li>
                  <li>
                     <Link to="/admin">Admin</Link>
                  </li>
               </ul>
            </nav>
            <Switch>
               <Route exact path="/products" component={Products} />
               <Route exact path="/admin" component={AdminMain} />
               <Route exact path="/login" component={Login} />
               <Route exact path="/admin-add-product" component={AdminAddProduct} />
               <Route exact path="/admin-edit-product/:productId" component={AdminEditProduct} />
            </Switch>
         </div>
      </Router>
   );
};

export default App;
