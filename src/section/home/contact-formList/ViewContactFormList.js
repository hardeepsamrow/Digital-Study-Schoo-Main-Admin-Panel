import React, { useEffect, useState, Fragment } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";

import "react-toastify/dist/ReactToastify.css";
import DataService from "../../../services/data.service";
const ViewContactFormList = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [value, setValue] = useState(null);
  const [allComments, setAllComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentsPopup, setCommentsPopup] = useState(false);
  const [entryStatus, setEntryStatus] = useState("");
  //console.log(props)

  useEffect(() => {
    document.title = "Submission Details";
    getData();
  }, []);
  const getData = () => {
    DataService.getContactFormById(params?.id).then((data) => {
      setData(data?.data?.data?.contact);
      setEntryStatus(data?.data?.data?.contact?.status);
      setAllComments(data?.data?.data?.comments?.reverse());
      if (data?.data?.data?.contact?.reminderTime) {
        const formatted = dayjs(
          data?.data?.data?.contact?.reminderTime,
          "YYYY-MM-DD hh:mm A"
        );
        setValue(formatted);
      }
      setLoading(false);
    });
  };

  const updateForm = (e) => {
    e.preventDefault();
    setBtnLoading(true);
    const data = {};
    const formattedDate = dayjs(value).format("YYYY-MM-DD hh:mm A");
    data.status = status;
    data.reminderTime = formattedDate;
    DataService.updateForm(params.id, data).then(
      () => {
        toast.success("Changed Done Successfully!!");
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
  const createComment = (e) => {
    e.preventDefault();
    if (!newComment) {
      toast.error("Please write comment to add!!");
      return false;
    }
    setBtnLoading(true);
    const data = {};
    data.text = newComment;
    data.contactId = params?.id;
    DataService.addComment(data).then(
      () => {
        toast.success("Comment Added Successfully!!");
        setNewComment("");
        getData();
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
          <Link to={"/send-email/" + params?.id}>
            <button className="btn-secondary">Send Email</button>
          </Link>
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
              <td className="d-flex align-items-center">Email:</td>
              <td>{data?.email}</td>
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
              <td className="d-flex align-items-center">Visit Date:</td>
              <td>{moment(data?.date).format("ll")}</td>
            </tr>
            <tr>
              <td className="d-flex align-items-center">Submitted On:</td>
              <td>{moment(data?.createdAt).format("ll")}</td>
            </tr>
            {status && (
              <tr>
                <td className="d-flex align-items-center">Update Date:</td>
                <td>
                  {data?.status ? moment(data?.updatedAt).format("ll") : ""}
                </td>
              </tr>
            )}
            <tr>
              <td className="d-flex align-items-center">
                Reminder Date &amp; Time:
                <br />
                <br />
                <br />
              </td>
              <td>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Select Date & Time"
                    value={value}
                    sx={{ background: "#fff" }}
                    disablePast
                    onChange={(newValue) => setValue(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </td>
            </tr>
            <tr>
              <td className="d-flex align-items-center">Previous Comments:</td>
              <td>
                <div className="row">
                  <div className="col-sm-5">
                    <div class="form-floating mb-3">
                      <input
                        type="text"
                        class="form-control"
                        id="floatingInput"
                        placeholder="Add New Comment"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <label for="floatingInput">
                        Add New Comment<span className="astrick">*</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-sm-3">
                    <button
                      className="btn btn-primary w-100 py-3"
                      style={{ background: "#157549" }}
                      onClick={createComment}
                      disabled={btnLoading}
                    >
                      Add Comment
                    </button>
                  </div>
                  <div className="col-sm-4">
                    <button
                      className="btn btn-primary w-100 py-3"
                      disabled={allComments?.length < 1}
                      onClick={() => setCommentsPopup(true)}
                    >
                      {allComments?.length > 0
                        ? "View All Comments"
                        : "No Previous Comments"}
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        {commentsPopup && (
          <div className="popup_outer">
            <div className="popup_inner">
              <i
                className="fas fa-times"
                onClick={() => setCommentsPopup(false)}
              />
              <h2>All Comments</h2>
              <div className="commentsAll">
                {allComments &&
                  allComments?.map((item, index) => {
                    return (
                      <div className="commentsInnerSec">
                        <div className="row">
                          <div className="col-sm-12">
                            <p className="m-0">{item?.text}</p>
                          </div>
                          <div
                            className="col-sm-12"
                            style={{ textAlign: "right" }}
                          >
                            <span
                              style={{ fontSize: "12px", color: "#333333" }}
                            >
                              <i className="far fa-clock me-1"></i>
                              {moment(item?.createdAt).format("lll")}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
        <div className="main-sec-bottom-btn">
          <button className="btn-secondary" onClick={updateForm}>
            {btnLoading ? (
              <span className="spinner-border spinner-border-sm"></span>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewContactFormList;
