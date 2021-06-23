import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Products, AdminMain, Login } from "./pages";
import "./App.css";
import AdminAddProduct from "./pages/AdminAddProduct";

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
               <Route path="/products" component={Products} />
               <Route path="/admin" component={AdminMain} />
               <Route path="/login" component={Login} />
               <Route path="/admin-add-product" component={AdminAddProduct} />
            </Switch>
         </div>
      </Router>
   );
};

export default App;
