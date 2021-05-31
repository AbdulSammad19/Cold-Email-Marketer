import React, { useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import Layout from "../core/Layout";
import axios from "axios";
import { ToastContainer, Toast, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { authenticate, isAuth } from "./helpers";
import Google from "./Google";
import Facebook from "./Facebook";

const Signin = () => {
  const history = useHistory();
  const [values, setValues] = useState({
    email: "",
    password: "",
    buttonText: "Submit",
  });
  const { email, password, buttonText } = values;

  const handleChange = (name) => (event) => {
    // console.log(event.target.value)
    setValues({ ...values, [name]: event.target.value });
  };

  const informParent = (response) => {
    authenticate(response, () => {
      isAuth() && isAuth().role === "admin"
        ? history.pushState("/admin")
        : history.push("/private");
    });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}`,
      data: { email, password },
    })
      .then((response) => {
        console.log(`signin success`, response);
        //save the response (user,token) local Storage/cookie
        authenticate(response, () => {
          setValues({
            ...values,

            email: "",
            password: "",
            buttonText: "Submitted",
          });
          // toast.success(`Hey ${response.data.user.name}, Welcome Back!`);
          isAuth() && isAuth().role === "admin"
            ? history.pushState("/admin")
            : history.push("/private");
        });
      })

      .catch((err) => {
        console.log(`signin error`, err.response.data);
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
      {/* {JSON.stringify(isAuth())} */}
      <div className="col-md-6 offset-md-3">
        <ToastContainer />
        {/* {JSON.stringify({ email, password })} */}
        {isAuth() ? <Redirect to="/" /> : null}
        <h1 className="p-5 text-center">Signin</h1>
        <Google informParent={informParent} />
        <Facebook informParent={informParent} />
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
export default Signin;
