import React, { useState, useEffect } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import Layout from "../core/Layout";
import axios from "axios";
import { ToastContainer, Toast, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { isAuth, getCookie, signout, updateUser } from "../auth/helpers";

const Admin = () => {
  const history = useHistory();
  const [values, setValues] = useState({
    role: "",
    name: "",
    email: "",
    password: "",
    buttonText: "Submit",
  });

  const token = getCookie("token");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/user/${isAuth()._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(`Private PROFILE UPDATE`, response);
        const { role, name, email } = response.data;
        setValues({ ...values, role, name, email });
      })
      .catch((error) => {
        console.log("Private profile update error", error.response.data.error);
        if (error.response.status === 401) {
          signout(() => {
            history.push("/");
          });
        }
      });
  };

  const { role, name, email, password, buttonText } = values;

  const handleChange = (name) => (event) => {
    // console.log(event.target.value)
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API}/admin/update`,

      headers: {
        Authorization: `Bearer ${token}`,
        data: { name, password },
      },
    })
      .then((response) => {
        console.log(`Private Profile update success`, response);
        updateUser(response, () => {
          setValues({
            ...values,
            name: "",
            email: "",
            password: "",
            buttonText: "Submitted",
          });
          toast.success(`Profile Update successfully`);
        });
      })
      .catch((err) => {
        console.log(`Private profile update error`, err.response.data.error);
        setValues({ ...values, buttonText: "Submit" });
        toast.error(err.response.data.e);
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

        <h1 className="p-5 text-center">Admin</h1>
        <p className="lead  text-center">Admin Update</p>

        <form action="" className="bg-black">
          <div className="form-group ">
            <label htmlFor="" className="text-muted">
              Role
            </label>
            <input
              type="text"
              className="form-control"
              defaultValue={role}
              disabled
            />
          </div>
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
              value={email}
              disabled
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
      </div>
    </Layout>
  );
};
export default Admin;
