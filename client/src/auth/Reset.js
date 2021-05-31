import React, { useEffect, useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import Layout from "../core/Layout";
import axios from "axios";
import { ToastContainer, Toast, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { authenticate, isAuth } from "./helpers";
import jwt from "jsonwebtoken";

const Reset = ({ match }) => {
  //props.match from react DOM
  const history = useHistory();
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

  const handleChange = (event) => (event) => {
    // console.log(event.target.value)
    setValues({ ...values, newPassword: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Request password reset link" });
    console.log("Req send");
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
        console.log(`Reset password error`, err.response.data);
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
      <div className="col-md-6 offset-md-3">
        <ToastContainer />

        {isAuth() ? <Redirect to="/" /> : null}
        <h1 className="p-5 text-center">Hey {name}, Type your new password</h1>

        <form action="" className="bg-black">
          <div className="form-group">
            <label htmlFor="" className="text-muted">
              Email
            </label>
            <input
              type="password"
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
    </Layout>
  );
};
export default Reset;
