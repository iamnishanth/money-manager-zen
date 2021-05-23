import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../utils/networkHandler";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ type: "", message: "" });

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async () => {
    setMessage({ type: "green", message: "Loading...." });
    if (validateEmail(email)) {
      let res = await forgotPassword(email);
      setMessage({
        type: res.mailSent ? "green" : "red",
        message: res.message,
      });
    } else {
      setMessage({ type: "red", message: "Invalid email" });
    }
  };
  return (
    <div className="login-container">
      <div className="text-center">
        <main className="form-signin">
          <div>
            <h1 className="h3 mt-2 mb-3 fw-normal">Password Reset</h1>
            <div className="form-floating">
              <input
                type="email"
                className="form-control mb-2"
                id="floatingInput"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="floatingInput">Email address</label>
            </div>
            <p style={{ color: message.type }}>{message.message}</p>
            <button
              className="w-100 btn btn-lg btn-primary"
              onClick={handleSubmit}
            >
              Reset
            </button>
            <div className="form-cta mt-3">
              <Link to="/login">Go back</Link>
              <Link to="/signup">Create an account</Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ForgotPassword;
