import React, { useEffect, useState, Fragment } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";

import "react-toastify/dist/ReactToastify.css";
import DataService from "../../../services/data.service";
const ViewScholarShipFormList = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  //console.log(props)

  useEffect(() => {
    document.title = "Submission Details";
    getData();
  }, []);
  const getData = () => {
    DataService.getScholarShipFormById(params?.id).then((data) => {
      setData(data.data.data);
      setStatus(data.data.data?.status);
      setLoading(false);
    });
  };

  const updateForm = (e) => {
    e.preventDefault();
    setBtnLoading(true);
    const data = {};
    data.status = status;
    DataService.updateForm(params.id, data).then(
      () => {
        toast.success("Status Updated Successfully!!");
        setTimeout(() => {
          navigate("/contact-form");
        }, 2000);
        setBtnLoading(false);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setBtnLoading(false);
        toast.error(resMessage, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    );
  };

  return (
    <div className="row">
      <ToastContainer></ToastContainer>
      <div className="col-md-12 ">
        <div className="top-flex-btn mb-4">
          <h4 className="f-700 ">Submission Details</h4>
          {/* <Link to={"/send-email/" + params?.id}>
            <button className="btn-secondary">Send Email</button>
          </Link> */}
        </div>
        <div className="container-fluid text-center no-padding">
          <div className="col-lg-6 m-auto">
            {loading && (
              <span className="spinner-border spinner-border-sm"></span>
            )}
          </div>
        </div>
        <table class="table table-striped">
          <tbody>
            <tr>
              <td className="d-flex align-items-center">Name:</td>
              <td>{data?.name}</td>
            </tr>
            <tr>
              <td className="d-flex align-items-center">Phone No.:</td>
              <td>{data?.phoneNo}</td>
            </tr>
            <tr>
              <td className="d-flex align-items-center">Course:</td>
              <td>{data?.course}</td>
            </tr>
            <tr>
              <td className="d-flex align-items-center">Qualification:</td>
              <td>{data?.qualification}</td>
            </tr>
            {/* {status && (
              <tr>
                <td className="d-flex align-items-center">Update Date:</td>
                <td>
                  {data?.status ? moment(data?.updatedAt).format("ll") : ""}
                </td>
              </tr>
            )} */}

            {/* <tr>
              <td className="d-flex align-items-center">Status:</td>
              <td className="status-sec-form">
                <input
                  type="text"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                />
              </td>
            </tr> */}
          </tbody>
        </table>
        {/* <div className="main-sec-bottom-btn">
          <button className="btn-secondary" onClick={updateForm}>
            {btnLoading ? (
              <span className="spinner-border spinner-border-sm"></span>
            ) : (
              "Save"
            )}
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ViewScholarShipFormList;
