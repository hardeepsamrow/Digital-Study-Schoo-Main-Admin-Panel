import React, { useEffect, useState, useRef } from "react";
import DataService from "../../../services/data.service";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddCategoryList = () => {
  const form = useRef();
  const [categoryType, setCategoryType] = useState("main");
  const [parentId, setparentId] = useState("");
  const [name, setName] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    DataService.getCategory().then((res) => {
      setCategories(res.data.data || []);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    const data = {};
    data.name = name;
    if (categoryType === "inner" && parentId) {
      data.parentCategory = parentId;
    } else if (categoryType === "inner" && !parentId) {
      setLoading(false);
      setMessage("Please select a parent category.");
      return;
    }
    DataService.addCategory(data).then(
      () => {
        toast.success("Category Added Successfully!!!");
        setTimeout(() => {
          navigate("/all-categories");
        }, 2000);
      },
      (error) => {
        const resMessage =
          (error.response && error.response.data && (error.response.data.message || error.response.data.msg)) ||
          error.message ||
          error.toString();

        setLoading(false);
        setMessage(resMessage); // Show specific error in the UI toast
        toast.error(resMessage, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    );
  };
  return (
    <div className="container-fluid">
      <ToastContainer></ToastContainer>
      <div className="row">
        <div className="d-flex w-100 justify-content-between align-items-center mb-4">
          <h4 className="mb-0 f-700">Add New Category</h4>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-4 login" ref={form}>
        {message && (
          <div className="form-group">
            <div className="alert alert-danger" role="alert">
              {message}
            </div>
          </div>
        )}
        <div className="row">
          <div className="col-xxl-12 col-lg-12 ps-xxl-5 ps-md-3 ps-0">
            <div className="card mb-5">
              <div className="card-body p-4">
                <div className="mb-4">
                  <div className="mb-4">
                    <div className="d-flex mb-4">
                      <div className="form-check me-4">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="categoryType"
                          id="mainCategory"
                          value="main"
                          checked={categoryType === "main"}
                          onChange={() => {
                            setCategoryType("main");
                            setparentId("");
                          }}
                        />
                        <label className="form-check-label" htmlFor="mainCategory">
                          Main Category
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="categoryType"
                          id="innerCategory"
                          value="inner"
                          checked={categoryType === "inner"}
                          onChange={() => setCategoryType("inner")}
                        />
                        <label className="form-check-label" htmlFor="innerCategory">
                          Inner Category
                        </label>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="mb-2">Category Name</label>
                      <input
                        type="text"
                        className="form-control mb-4"
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Category Name"
                        required
                      />
                    </div>

                    {categoryType === "inner" && (
                      <div className="mb-4">
                        <label className="mb-2">Select Parent Category</label>
                        <select
                          className="form-control"
                          onChange={(e) => setparentId(e.target.value)}
                          value={parentId}
                          required
                        >
                          <option value="">Select Parent Category</option>
                          {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
                <div className="d-flex justify-content-start btn-min-width">
                  <button className="btn btn-primary" disabled={loading}>
                    {loading && (
                      <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddCategoryList;
