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
const EditTagList = () => {
  const form = useRef();
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  const navigate = useNavigate();
  const params = useParams();

  const getTag = () => {
    DataService.getTagById(params.id).then((data) => {
      setName(data?.data?.data?.name);
      setData(data?.data?.data);
      setLoading(false);
    });
  };
  useEffect(() => {
    getTag();
  }, [params.id]);
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {};
    data.name = name;
    DataService.updateTag(data, params.id).then(
      () => {
        toast.success("Tag Updated Successfully!!");
        setTimeout(() => {
          navigate("/all-tags");
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
            <h4 className="mb-0 f-700">Edit Tag</h4>
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
                  />
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

export default EditTagList;
