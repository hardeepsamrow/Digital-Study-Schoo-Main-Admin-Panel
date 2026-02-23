import axios from "axios";
import AuthService from "../services/auth.service";

const API_URL =
  process.env.NODE_ENV != "production"
    ? "https://backend.digitalstudyschool.com/"
    : "https://backend.digitalstudyschool.com/";

axios.interceptors.request.use(function (config) {
  const token = AuthService.getCurrentUserTokken();
  config.headers.Authorization = "Bearer " + token;

  return config;
});
axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/#/login";
      // Hace la solicitud de refresco de tokens
    }
    return Promise.reject(error);
  }
);

const addBlog = (data) => {
  return axios.post(API_URL + "api/blogs/add", data);
};
const getAllBlog = () => {
  return axios.get(API_URL + "api/blogs/admin-panel");
};
const getBlogById = (id) => {
  return axios.get(API_URL + "api/blogs/get/" + id);
};
const updateBlog = (data, id) => {
  return axios.put(API_URL + "api/blogs/update/" + id, data);
};

const deleteBlog = (id) => {
  return axios.delete(API_URL + "api/blogs/delete/" + id);
};

const addCategory = (data) => {
  return axios.post(API_URL + "api/category/add", data);
};
const getCategory = () => {
  return axios.get(API_URL + "api/category/getAll");
};
const getCategoryById = (id) => {
  return axios.get(API_URL + "api/category/get/" + id);
};
const updateCategory = (data, id) => {
  return axios.put(API_URL + "api/category/update/" + id, data);
};
const deleteCategory = (id) => {
  return axios.delete(API_URL + "api/category/delete/" + id);
};
const addTag = (data) => {
  return axios.post(API_URL + "api/tag/add/", data);
};
const getTags = () => {
  return axios.get(API_URL + "api/tag/getAll");
};
const getTagById = (id) => {
  return axios.get(API_URL + "api/tag/get/" + id);
};
const updateTag = (data, id) => {
  return axios.put(API_URL + "api/tag/update/" + id, data);
};
const deleteTag = (id) => {
  return axios.delete(API_URL + "api/tag/delete/" + id);
};
const addAuthor = (data) => {
  return axios.post(API_URL + "api/authors/add", data);
};
const getAllAuthors = () => {
  return axios.get(API_URL + "api/authors/getAll");
};
const getAuthorById = (id) => {
  return axios.get(API_URL + "api/authors/get/" + id);
};
const updateAuthor = (id, data) => {
  return axios.put(API_URL + "api/authors/update/" + id, data);
};
const deleteAuthor = (id) => {
  return axios.delete(API_URL + "api/authors/delete/" + id);
};
const getProfile = () => {
  return axios.get(API_URL + "api/admin/get");
};
const updateProfile = (id, data) => {
  return axios.put(API_URL + "api/admin/update/" + id, data);
};

const getContactForm = () => {
  return axios.get(API_URL + "api/contact/getAll");
};
const getContactFormById = (id) => {
  return axios.get(API_URL + "api/contact/get/" + id);
};
const updateForm = (id, data) => {
  return axios.put(API_URL + "api/contact/update/" + id, data);
};

const deleteContactForm = (id) => {
  return axios.delete(API_URL + "api/contact/delete/" + id);
};


const AddScholarShipContent = (data) => {
  return axios.post(API_URL + "api/admin/scholarship/create/", data);
};

const gerScholarShipContent = (id) => {
  return axios.get(API_URL + "api/admin/get/scholarship/" + id);
};

const updateScholarShipContent = (id, data) => {
  return axios.put(API_URL + "api/admin/scholarship/update/" + id, data);
};
const getScholarShipForm = () => {
  return axios.get(API_URL + "api/scholarship/getAll");
};
const getScholarShipFormById = (id) => {
  return axios.get(API_URL + "api/scholarship/get/" + id);
};
const deleteScholarShipForm = (id) => {
  return axios.delete(API_URL + "api/scholarship/delete/" + id);
};
const addTopBarContent = (data) => {
  return axios.post(API_URL + "api/description/create/", data);
};
const getTopBarContent = (id) => {
  return axios.get(API_URL + "api/description/get/" + id);
};
const updateTopBarContent = (id, data) => {
  return axios.put(API_URL + "api/description/update/" + id, data);
};

// ####################################################################################################

const getCategoryTwo = () => {
  return axios.get(API_URL + "api/categories/getAll");
};
const getCategoryDetail = (id) => {
  return axios.get(API_URL + "api/categories/" + id);
};

const updateCategoryOrder = (data) => {
  return axios.put(API_URL + "api/categories/order", data);
};

// const getAllTag = (data) => {
//   return axios.get(API_URL + "api/tag/getAll", data);
// };
const getAllTtags = (page) => {
  return axios.get(`${API_URL}api/tag/getAll?page=${page}`);
};
const getAllStarTag = (data) => {
  return axios.get(API_URL + "api/starTag/getAll", data);
};
// const getAllCategory = (type) => {
//   return axios.get(API_URL + "api/categories");
// };

const getUser = (type) => {
  return axios.get(API_URL + "api/users?role=" + type);
};

const getUserDetail = () => {
  return axios.get(API_URL + "api/users/detail");
};

const changePassword = (id, data) => {
  return axios.put(API_URL + "api/admin/passwordChange/" + id, data);
};
const getDashboard = () => {
  return axios.get(API_URL + "api/dashboard");
};

const forgotPassword = (data) => {
  return axios.post(API_URL + "api/users/forgotpassword", data);
};
const verifyUserOtp = (data) => {
  return axios.post(API_URL + "api/users/verifyotp", data);
};
const resetPassword = (data) => {
  return axios.post(API_URL + "api/users/resetpassword", data);
};
const deleteImage = (rId, id) => {
  return axios.delete(API_URL + "api/EnNews/deleteImage/" + rId + "/" + id);
};
const getAllTypes = (data) => {
  return axios.get(API_URL + "api/types/getAll", data);
};

const deleteSingleVideo = (data) => {
  return axios.delete(API_URL + "api/EnNews/deleteVideo/" + data);
};
const emailSend = (data) => {
  return axios.post(API_URL + "api/mail/send", data);
};
const addComment = (data) => {
  return axios.post(API_URL + "api/comment/add", data);
};
const getPDFForm = () => {
  return axios.get(API_URL + "api/pdf-form/get");
};

const requestIndexing = (data) => {
  return axios.post(API_URL + "api/indexing/request-indexing", data);
};

const DataService = {
  requestIndexing,
  getPDFForm,
  addComment,
  updateProfile,
  getProfile,
  getCategoryTwo,
  addCategory,
  getCategory,
  getCategoryById,
  deleteCategory,
  // getAllTag,
  getAllStarTag,
  // getAllCategory,
  addBlog,
  getAllBlog,
  getUser,
  getUserDetail,
  getCategoryDetail,
  updateCategory,
  updateCategoryOrder,
  changePassword,
  getDashboard,
  getBlogById,
  updateBlog,
  deleteBlog,
  forgotPassword,
  verifyUserOtp,
  resetPassword,
  getAllTtags,
  deleteImage,
  getAllTypes,
  deleteSingleVideo,
  addTag,
  getTags,
  deleteTag,
  getTagById,
  updateTag,
  getContactForm,
  getContactFormById,
  updateForm,
  deleteContactForm,
  AddScholarShipContent,
  gerScholarShipContent,
  updateScholarShipContent,
  getScholarShipForm,
  getScholarShipFormById,
  deleteScholarShipForm,
  emailSend,
  addTopBarContent,
  getTopBarContent,
  updateTopBarContent,
  addAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
};
export default DataService;
