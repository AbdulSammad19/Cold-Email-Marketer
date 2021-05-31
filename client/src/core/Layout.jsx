import React, { Fragment } from "react";
import { Link, useHistory } from "react-router-dom";
import { isAuth, signout } from "../auth/helpers";

const Layout = ({ children }) => {
  const history = useHistory();
  const nav = () => {
    <ul className="nav nav-tabs bg-primary">
      <li className="nav-items">
        <Link to="/" className="text-light nav-link">
          Home
        </Link>
      </li>
      {!isAuth() && (
        <Fragment>
          <li className="nav-items">
            <Link to="/signin" className="text-light nav-link">
              Signin
            </Link>
          </li>
          <li className="nav-items">
            <Link to="/signup" className="text-light nav-link">
              Signup
            </Link>
          </li>
        </Fragment>
      )}

      {isAuth() && isAuth.role === "admin" && (
        <li className="nav-items">
          <Link className="nav-link" to="/admin">
            {isAuth().name}
          </Link>
        </li>
      )}

      {isAuth() && isAuth.role === "subscriber" && (
        <li className="nav-items">
          <Link className="nav-link" to="/admin">
            {isAuth().name}
          </Link>
        </li>
      )}

      {isAuth() && (
        <li className="nav-items">
          <span
            className="nav-link"
            onClick={() => {
              signout(() => {
                history.push("/");
              });
            }}
          >
            Signout
          </span>
        </li>
      )}
    </ul>;
  };
  return (
    <Fragment>
      {nav()}
      <div className="container">{children}</div>
    </Fragment>
  );
};

export default Layout;

// import React, { Fragment } from "react";

// const Layout = ({ children }) => {
//   const nav = () => {
//     <ul className="nav nav-tabs bg-primary">
//       <li className="nav-item">
//         <a href="/" className="text-light">
//           Home
//         </a>
//       </li>
//     </ul>;
//   };
//   return (
//     <Fragment>
//       {nav()}
//       {/* <p>this is nav</p> */}
//       <div className="container">{children}</div>
//     </Fragment>
//   );
// };
// export default Layout;
