import { Route, Redirect } from "react-router-dom";
import { isAuth } from "./helpers";

const PrivateRoutes = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    redner={(props) =>
      isAuth() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/signin",
            state: { from: props.location },
          }}
        />
      )
    }
  ></Route>
);

export default PrivateRoutes;
