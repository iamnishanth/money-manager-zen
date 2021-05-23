import { useState, useEffect } from "react";
import { Link, useHistory, Redirect } from "react-router-dom";
import { login, signup } from "../utils/networkHandler";

const Login = (props) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [whatKind, setWhatKind] = useState("");
  const [message, setMessage] = useState({ type: "", message: "" });
  const history = useHistory();

  useEffect(() => {
    setFormData({
      email: "",
      password: "",
    });
    setWhatKind(props.location.pathname);
    setMessage({ type: "", message: "" });
  }, [props.location.pathname]);

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async () => {
    if (validateEmail(formData.email)) {
      setMessage({ type: "", message: "" });
      if (formData.password.length > 0) {
        setMessage({ type: "", message: "" });
        if (whatKind === "/login") {
          setMessage({ type: "green", message: "Loading...." });
          console.log(formData);
          let res = await login(formData);
          setMessage({
            type: res.loggedIn ? "green" : "red",
            message: res.message,
          });
          if (res.loggedIn) {
            localStorage.setItem("email", formData.email);
            localStorage.setItem("password", formData.password);
            props.toggleLoggedIn(res.id);
            history.push("/");
          }
        } else {
          setMessage({ type: "green", message: "Loading...." });
          console.log(formData);

          let res = await signup(formData);
          setMessage({
            type: res.signup ? "green" : "red",
            message: res.message,
          });
        }
      } else {
        setMessage({ type: "red", message: "Enter password" });
      }
    } else {
      setMessage({ type: "red", message: "Invalid Email address" });
    }
  };

  return (
    <div className="login-container">
      <div className="text-center">
        {!props.isLogged && (
          <main className="form-signin">
            <div>
              <h1 className="h3 mt-2 mb-3 fw-normal">
                {whatKind === "/login" ? "Login" : "Sign up"}
              </h1>
              <div className="form-floating">
                <input
                  type="email"
                  className="form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <label htmlFor="floatingInput">Email address</label>
              </div>
              <div className="form-floating">
                <input
                  type="password"
                  className="form-control"
                  id="floatingPassword"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <label htmlFor="floatingPassword">Password</label>
              </div>
              <p style={{ color: message.type }}>{message.message}</p>
              <button
                className="w-100 btn btn-lg btn-primary"
                onClick={handleSubmit}
              >
                {whatKind === "/login" ? "Login" : "Sign up"}
              </button>
              <div className="form-cta mt-3">
                <Link to="/forgot-password">Forgot password?</Link>
                {whatKind === "/login" ? (
                  <Link to="/signup">Create an account</Link>
                ) : (
                  <Link to="/login">Login</Link>
                )}
              </div>
            </div>
          </main>
        )}
        {props.isLogged && <Redirect to="/" />}
      </div>
    </div>
  );
};

export default Login;
