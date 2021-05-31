import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Layout from "../core/Layout";
import axios from "axios";
import { ToastContainer, Toast, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { isAuth } from "./helpers";

const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    buttonText: "Submit",
  });
  const { name, email, password, buttonText } = values;

  const handleChange = (name) => (event) => {
    // console.log(event.target.value)
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}`,
      data: { name, email, password },
    })
      .then((response) => {
        console.log(`signup success`, response);
        setValues({
          ...values,
          name: "",
          email: "",
          password: "",
          buttonText: "Submitted",
        });
        toast.success(response.data.message);
      })
      .catch((err) => {
        console.log(`signup error`, err.response.data);
        setValues({ ...values, buttonText: "Submit" });
        toast.error(err.response.data.error);
      });
  };

  // const signupForm = () => {
  //   <form action="" className="bg-black">
  //     <div className="form-group ">
  //       <label htmlFor="" className="text-muted">
  //         Name
  //       </label>
  //       <input
  //         type="text"
  //         className="form-control"
  //         onChange={handleChange("name")}
  //         value={name}
  //       />
  //     </div>

  //     <div className="form-group">
  //       <label htmlFor="" className="text-muted">
  //         Email
  //       </label>
  //       <input
  //         type="email"
  //         className="form-control"
  //         onChange={handleChange("email")}
  //         value={email}
  //       />
  //     </div>

  //     <div className="form-group">
  //       <label htmlFor="" className="text-muted">
  //         Password
  //       </label>
  //       <input
  //         type="password"
  //         className="form-control"
  //         onChange={handleChange("password")}
  //         value={password}
  //       />
  //     </div>

  //     <div>
  //       <button className="btn btn-primary" onClick={clickSubmit}>
  //         {buttonText}
  //       </button>
  //     </div>
  //   </form>;
  // };
  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <ToastContainer />

        {isAuth() ? <Redirect to="/" /> : null}
        <h1 className="p-5 text-center">Signup</h1>

        <form action="" className="bg-black">
          <div className="form-group ">
            <label htmlFor="" className="text-muted">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              onChange={handleChange("name")}
              value={name}
            />
          </div>

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

          <div className="form-group">
            <label htmlFor="" className="text-muted">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              onChange={handleChange("password")}
              value={password}
            />
          </div>

          <div>
            <button className="btn btn-primary" onClick={clickSubmit}>
              {buttonText}
            </button>
          </div>
        </form>
        <br />
        <Link
          to="/auth/password/forgot"
          className="btn bt-sm btn-outline-danger"
        >
          Forgot Password
        </Link>
      </div>
    </Layout>
  );
};
export default Signup;
