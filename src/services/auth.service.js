import axios from "axios";

const API_URL = (process.env.NODE_ENV != 'production' ? "https://backend.digitalstudyschool.com/" : "https://backend.digitalstudyschool.com/");

// const register = (username, email, password) => {
//   return axios.post(API_URL + "api/users/register", {
//     username,
//     email,
//     password,
//   });
// };

const login = (username, password) => {
  return axios
    .post(API_URL + "api/admin/login", {
      email:username,
      password:password,
    })
    .then((response) => {
      if (response.data.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data.data.userData));
        localStorage.setItem("userId", JSON.stringify(response.data.data.userData._id));
        localStorage.setItem("token", JSON.stringify(response.data.data.accessToken));
      }
      console.log(response.data.data)
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
  return axios.post(API_URL + "signout").then((response) => {
    return response.data;
  });
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};
const getCurrentUserTokken = () => {
  return JSON.parse(localStorage.getItem("token"));
};

const AuthService = {
  // register,
  login,
  logout,
  getCurrentUser,
  getCurrentUserTokken
}

export default AuthService;