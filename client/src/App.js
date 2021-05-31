import React from "react";
import Navbar from "./auth/Navbar";
const App = () => {
  return (
    <>
      <Navbar />
      <div className="col-md-6 offset-md-3 text-center">
        <h1 className="p-5">React Node MongoDB Authentication Boilerplate</h1>
        <h2>MERN STACK</h2>
        <hr />
        <p className="lead">
          This module includes user registration by manually, facebook and
          google. for manuall registration activation link is send to user's
          email to activate user account. this module also include forgot
          password, reset password link as well as private and protected routes
          for authentication user and users with te role of admin. User can also
          update his name and password for the moment.
        </p>
      </div>
    </>
  );
};

export default App;
