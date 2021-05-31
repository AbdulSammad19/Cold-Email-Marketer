import cookie from "js-cookie";

// set in cookie
export const setCookie = (key, value) => {
  if (window !== "undefined") {
    cookie.set(key, value, {
      expires: 1,
    });
  }
};

// remove from cookie
export const removeCookie = (key) => {
  if (window !== "undefined") {
    cookie.remove(key, {
      expires: 1,
    });
  }
};

// get from cookie such as stored token
// will be useful when we need to make request to server with token

export const getCookie = (key) => {
  if (window !== "undefined") {
    // console.log(`Get Cookie Method ${cookie.get(key)}`);
    return cookie.get(key);
  }
};

// set in local storage
export const setLocalStorage = (key, value) => {
  if (window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// remove from local storage

export const removeLocalStorage = (key) => {
  if (window !== "undefined") {
    localStorage.removeItem(key);
  }
};

// authenticate user by passing data to cookie and local storage during signin
export const authenticate = (response, next) => {
  console.log(`Autheticate helper on signin response`, response);
  setCookie("token", response.data.token);
  setLocalStorage("user", response.data.user);
  next();
};

// access user info from localStorage
export const isAuth = () => {
  if (window !== "undefined") {
    const cookieChecked = getCookie("token");
    // console.log(cookieChecked);
    if (cookieChecked) {
      if (localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user"));
      } else {
        return false;
      }
    }
  }
};

export const signout = (next) => {
  removeCookie("token");
  removeLocalStorage("user");
  next();
};

export const updateUser = (response, next) => {
  console.log(`update user in localstorage helpers`, response);
  if (typeof window !== "undefined") {
    let auth = JSON.parse(localStorage.getItem("user"));
    auth = response.data;
    localStorage.setItem("user", JSON.stringify(auth));
  }
  next();
};
