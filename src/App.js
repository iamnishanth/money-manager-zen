import { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Reset from "./components/Reset";
import Verify from "./components/Verify";
import Categories from "./components/Categories";
import DateFilter from "./components/DateFilter";
import { login } from "./utils/networkHandler";

import "./App.css";

function App() {
  const [userID, setUserID] = useState("");
  const [isLogged, setIsLogged] = useState(false);

  const toggleLoggedIn = (id) => {
    setIsLogged(true);
    setUserID(id);
  };

  useEffect(() => {
    const autoLogin = async () => {
      let email = localStorage.getItem("email");
      let password = localStorage.getItem("password");
      if (email) {
        let res = await login({ email, password });
        console.log(res);
        if (res.loggedIn) {
          toggleLoggedIn(res.id);
        }
      }
    };
    autoLogin();
  }, []);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route
            exact
            path="/login"
            component={(props) => (
              <Login
                {...props}
                isLogged={isLogged}
                toggleLoggedIn={toggleLoggedIn}
              />
            )}
          />
          <Route
            exact
            path="/signup"
            component={(props) => (
              <Login
                {...props}
                isLogged={isLogged}
                toggleLoggedIn={toggleLoggedIn}
              />
            )}
          />
          <Route exact path="/forgot-password" component={ForgotPassword} />
          <Route exact path="/verify/:id/:hash" component={Reset} />
          <Route exact path="/activate/:hash" component={Verify} />
          <Route
            exact
            path="/"
            component={() => <Home isLogged={isLogged} userID={userID} />}
          />
          <Route
            exact
            path="/categories"
            component={() => <Categories isLogged={isLogged} userID={userID} />}
          />
          <Route
            exact
            path="/date"
            component={() => <DateFilter isLogged={isLogged} userID={userID} />}
          />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
