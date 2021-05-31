import React, { useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import Layout from "../core/Layout";
import axios from "axios";
import { ToastContainer, Toast, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { authenticate, isAuth } from "./helpers";

const Forgot = () => {
  const history = useHistory();
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
      {/* {JSON.stringify(isAuth())} */}
      <div className="col-md-6 offset-md-3">
        <ToastContainer />
        {/* {JSON.stringify({ email, password })} */}
        {isAuth() ? <Redirect to="/" /> : null}
        <h1 className="p-5 text-center">Forgot Password</h1>
        {/* {signupForm()} */}
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
    </Layout>
  );
};
export default Forgot;
