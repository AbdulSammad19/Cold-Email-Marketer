import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import Layout from "../core/Layout";
import axios from "axios";
import { ToastContainer, Toast, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import jwt from "jsonwebtoken";

const Activate = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    token: "",
    show: true,
  });

  useEffect(() => {
    console.log(`use effect`);
    let token = match.params.token;
    let { name } = jwt.decode(token);
    if (token) {
      setValues({ ...values, name, token });
    }
    console.log(token);
  }, []);
  const { name, token, show } = values;

  const clickSubmit = (event) => {
    event.preventDefault();

    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/account/activation`,
      data: { token },
    })
      .then((response) => {
        console.log(`Account Activation`, response);
        setValues({
          ...values,
          show: false,
        });
        toast.success(response.data.message);
      })
      .catch((err) => {
        console.log(`Account Activation error`, err.response.data.error);

        toast.error(err.response.data.error);
      });
  };

  //   const activationLink = () => (
  //     <div className="text-center">
  //       <h1 className="p-5">Hey {name} Ready to Activate your account</h1>
  //       <button className="btn btn-outline-primary" onClick={clickSubmit}>
  //         Activate Account
  //       </button>
  //     </div>
  //   );
  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <ToastContainer />

        {/* {activationLink()} */}
        <div className="text-center">
          <h1 className="p-5">Hey {name} Ready to Activate your account</h1>
          <button className="btn btn-outline-primary" onClick={clickSubmit}>
            Activate Account
          </button>
        </div>
      </div>
    </Layout>
  );
};
export default Activate;
