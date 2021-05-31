import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { isAuth } from "./helpers";
import Navbar from "./Navbar";

const Forgot = () => {
  const [values, setValues] = useState({
    email: "",

    buttonText: "Submit",
  });
  const { email, buttonText } = values;

  const handleChange = (name) => (event) => {
    // console.log(event.target.value)
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Request password reset link" });
    console.log("Req send");
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API}/forgot-password`,
      data: { email },
    })
      .then((response) => {
        console.log(`Forgot password success`, response);
        toast.success(response.data.message);

        setValues({ ...values, buttonText: "Requested" });
      })

      .catch((err) => {
        console.log(`Forgot password error`, err.response.data);
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
        <h1 className="p-5 text-center">Forgot Password</h1>

        <form action="" className="bg-black">
          <div className="form-group">
            <label htmlFor="" className="text-muted">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              onChange={handleChange("email")}
              value={email}
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
export default Forgot;
