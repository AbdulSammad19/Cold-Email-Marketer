import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { isAuth } from "./helpers";
import jwt from "jsonwebtoken";

const Reset = ({ match }) => {
  //props.match from react DOM

  const [values, setValues] = useState({
    name: "",
    token: "",
    newPassword: "",
    buttonText: "Reset Password",
  });

  useEffect(() => {
    let token = match.params.token;
    let { name } = jwt.decode(token);
    if (token) {
      setValues({ ...values, name, token });
    }
  }, []);
  const { name, token, newPassword, buttonText } = values;

  const handleChange = (event) => {
    // console.log(event.target.value)
    setValues({ ...values, newPassword: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Request password reset link" });
    console.log("Req send");
    console.log(newPassword);
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API}/reset-password`,

      data: { newPassword, resetPasswordLink: token },
    })
      .then((response) => {
        console.log(`Reset password success`, response);
        toast.success(response.data.message);

        setValues({ ...values, buttonText: "Done" });
      })

      .catch((err) => {
        console.log(`Reset password error`, err.response);
        setValues({ ...values, buttonText: "Request password reset link" });
        toast.error(err.response.data.error);
      });
  };
  return (
    <>
      <Navbar />
      <div className="col-md-6 offset-md-3">
        <ToastContainer />

        {isAuth() ? <Redirect to="/" /> : null}
        <h1 className="p-5 text-center">Hey {name}, Type your new password</h1>

        <form action="" className="bg-black">
          <div className="form-group">
            <label htmlFor="" className="text-muted">
              New Password
            </label>
            <input
              type="text"
              className="form-control"
              onChange={handleChange}
              value={newPassword}
              placeholder="Type new password"
              required
            />
          </div>

          <div>
            <button className="btn btn-primary" onClick={clickSubmit}>
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
export default Reset;
