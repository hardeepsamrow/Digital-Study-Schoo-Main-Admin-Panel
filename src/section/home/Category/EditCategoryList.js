import React, { useEffect, useState, useRef } from "react";
import DataService from "../../../services/data.service";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const styles = {
  input: {
    opacity: "0%",
    position: "absolute",
  },
};
const EditCategoryList = () => {
  const form = useRef();
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();
  const params = useParams();

  const getCategory = () => {
    DataService.getCategoryById(params.id).then((data) => {
      setName(data?.data?.data?.name);
      setParentId(data?.data?.data?.parentCategory?._id || data?.data?.data?.parentCategory || "");
      setData(data?.data?.data);
      setLoading(false);
    });
    DataService.getCategory().then((res) => {
      setCategories(res.data.data || []);
    });
  };
  useEffect(() => {
    getCategory();
  }, [params.id]);
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {};
    data.name = name;
    data.parentCategory = parentId || null;
    DataService.updateCategory(data, params.id).then(
      () => {
        toast.success("Category Updated Successfully!!");
        setTimeout(() => {
          navigate("/all-categories");
        }, 2000);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setLoading(false);
        toast.error(resMessage, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    );
  };
  return (
    <div className="container-fluid">
      <form onSubmit={handleSubmit} className="mt-4 login" ref={form}>
        <div className="row">
          <div className="d-flex w-100 justify-content-between align-items-center mb-4">
            <h4 className="mb-0 f-700">Edit Category</h4>
          </div>

          <div className="row">
            <div className="col-xxl-9 col-lg-8 ps-xxl-5 ps-md-3 ps-0">
              <div className="mb-4">
                <div className="mb-4">
                  <input
                    type="text"
                    value={name}
                    className="form-control my-4"
                    onChange={(e) => setName(e.target.value)}
                    placeholder="En"
                    required
                  />
                  <select
                    className="form-control my-4"
                    onChange={(e) => setParentId(e.target.value)}
                    value={parentId}
                  >
                    <option value="">Select Parent Category (Optional)</option>
                    {categories.filter(cat => cat._id !== params.id).map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div style={{ textAlign: "left" }}>
              <button onClick={handleSubmit} className="btn btn-primary">
                {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                Save
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditCategoryList;
