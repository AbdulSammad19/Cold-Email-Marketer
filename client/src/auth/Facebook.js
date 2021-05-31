import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import axios from "axios";

const Facebook = ({ informParent = (f) => f }) => {
  const responseFacebook = (response) => {
    console.log(response.tokenId);
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/facebook-login`,
      data: { userID: response.userID, accessToken: response.accessToken },
    })
      .then((response) => {
        console.log("Facebook signin success", response);
        //inform parent component
        informParent(response);
      })
      .catch((error) => {
        console.log("Facebook signin error", error);
      });
  };
  return (
    <div className="pb-3">
      <FacebookLogin
        appId={`${process.env.REACT_APP_FACEBOOK_APP_ID}`}
        autoLoad={false}
        callback={responseFacebook}
        render={(renderProps) => (
          <button
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            className="btn btn-primary btn-lg btn-block"
          >
            <i className="fab fa-facebook pr-2"></i> Login with Facebook
          </button>
        )}
      />
    </div>
  );
};
export default Facebook;
