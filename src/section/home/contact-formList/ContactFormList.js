import React, { useEffect, useState, Fragment } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataService from "../../../services/data.service";
import moment from "moment";
const ContactFormList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setfilteredData] = useState([]);
  //console.log(props)

  useEffect(() => {
    document.title = "All Contact Form Submissions";
    getData();
  }, []);
  const userId = JSON.parse(localStorage.getItem("user_id"));
  const getData = () => {
    DataService.getContactForm().then((data) => {
      setData(data.data.data);
      setfilteredData(data.data.data);
      setLoading(false);
    });
  };
  const onChangeSearch = (e) => {
    if (e.target.value) {
      const result = data.filter((value) => {
        return value.name.toLowerCase().includes(e.target.value.toLowerCase());
      });
      setfilteredData(result);
    } else {
      setfilteredData(data);
    }
  };
  const onChangeStatus = (e) => {
    if (e.target.value !== "All") {
      const result = data.filter((value) => {
        return value.status === e.target.value;
      });
      setfilteredData(result);
    } else {
      setfilteredData(data);
    }
  };
  const deleteContactForm = (item) => {
    setLoading(true);
    DataService.deleteContactForm(item?._id).then(
      () => {
        toast.success("Form Submission Deleted Successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setLoading(false);
        getData();
      },
      (error) => {
        const resMessage =
          (error.response && error.response.data && error.response.data.msg) ||
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
    <div className="row">
      <ToastContainer />
      <div className="col-md-12">
        <h4 className="f-700 mb-4">All Contact Form Submissions</h4>
        <div className="table-header d-flex align-items-center">
          <div className="table-search">
            <i>
              <svg
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.7422 10.8439C12.5329 9.7673 13 8.4382 13 7C13 3.41015 10.0899 0.5 6.5 0.5C2.91015 0.5 0 3.41015 0 7C0 10.5899 2.91015 13.5 6.5 13.5C7.93858 13.5 9.26801 13.0327 10.3448 12.2415L10.3439 12.2422C10.3734 12.2822 10.4062 12.3204 10.4424 12.3566L14.2929 16.2071C14.6834 16.5976 15.3166 16.5976 15.7071 16.2071C16.0976 15.8166 16.0976 15.1834 15.7071 14.7929L11.8566 10.9424C11.8204 10.9062 11.7822 10.8734 11.7422 10.8439ZM12 7C12 10.0376 9.53757 12.5 6.5 12.5C3.46243 12.5 1 10.0376 1 7C1 3.96243 3.46243 1.5 6.5 1.5C9.53757 1.5 12 3.96243 12 7Z"
                  fill="#707070"
                  fill-opacity="0.5"
                />
              </svg>
            </i>
            <input
              type="search"
              onChange={onChangeSearch}
              name="search"
              placeholder="Search By Name"
            />
          </div>
          <div class="d-flex align-items-center ms-auto"></div>
        </div>
        <div className="container-fluid text-center no-padding">
          <div className="col-lg-6 m-auto">
            {loading && (
              <span className="spinner-border spinner-border-sm"></span>
            )}
          </div>
        </div>
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">S. No.</th>
              <th scope="col">Name </th>
              <th scope="col">Email </th>
              <th scope="col">Course </th>
              <th scope="col">Visit Date</th>
              <th scope="col">Updated Status</th>
              <th scope="col" className="text-end">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData && filteredData.length > 0
              ? filteredData.map((item, i) => {
                  if (item?._id !== userId) {
                    return (
                      <tr>
                        <td>{i + 1}</td>
                        <td className="d-flex align-items-center">
                          {item?.name}
                        </td>
                        <td>{item?.email}</td>
                        <td>{item?.course}</td>
                        <td>{moment(item?.date).format("ll")}</td>
                        <td>
                          {item?.status
                            ? moment(item?.updatedAt).format("ll")
                            : ""}
                        </td>
                        <td width="150">
                          <span className="d-flex justify-content-end">
                            <Link
                              to={"/view-contact-form/" + item?._id}
                              className="mx-2"
                            >
                              <i class="fas fa-eye eye-icon"></i>
                            </Link>

                            <Link
                              data-bs-toggle="modal"
                              data-bs-target={`#staticBackdrop_${item._id}`}
                              className="mx-2"
                            >
                              <svg
                                style={{ marginTop: "-5px" }}
                                width="14"
                                height="16"
                                viewBox="0 0 14 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4.19312 5.979C4.46926 5.979 4.69312 6.20286 4.69312 6.479V12.479C4.69311 12.7551 4.46926 12.979 4.19312 12.979C3.91697 12.979 3.69312 12.7551 3.69312 12.479V6.479C3.69312 6.20286 3.91697 5.979 4.19312 5.979Z"
                                  fill="#C30E0E"
                                />
                                <path
                                  d="M6.69312 5.979C6.96926 5.979 7.19312 6.20286 7.19312 6.479V12.479C7.19312 12.7551 6.96926 12.979 6.69312 12.979C6.41697 12.979 6.19312 12.7551 6.19312 12.479V6.479C6.19312 6.20286 6.41697 5.979 6.69312 5.979Z"
                                  fill="#C30E0E"
                                />
                                <path
                                  d="M9.69312 6.479C9.69312 6.20286 9.46926 5.979 9.19312 5.979C8.91697 5.979 8.69312 6.20286 8.69312 6.479V12.479C8.69312 12.7551 8.91697 12.979 9.19312 12.979C9.46926 12.979 9.69312 12.7551 9.69312 12.479V6.479Z"
                                  fill="#C30E0E"
                                />
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M13.1931 3.479C13.1931 4.03129 12.7454 4.479 12.1931 4.479H11.6931V13.479C11.6931 14.5836 10.7977 15.479 9.69312 15.479H3.69312C2.58855 15.479 1.69312 14.5836 1.69312 13.479V4.479H1.19312C0.640831 4.479 0.193115 4.03129 0.193115 3.479V2.479C0.193115 1.92672 0.640831 1.479 1.19312 1.479H4.69312C4.69312 0.926719 5.14083 0.479004 5.69312 0.479004H7.69312C8.2454 0.479004 8.69312 0.926719 8.69312 1.479H12.1931C12.7454 1.479 13.1931 1.92672 13.1931 2.479V3.479ZM2.81115 4.479L2.69312 4.53802V13.479C2.69312 14.0313 3.14083 14.479 3.69312 14.479H9.69312C10.2454 14.479 10.6931 14.0313 10.6931 13.479V4.53802L10.5751 4.479H2.81115ZM1.19312 3.479V2.479H12.1931V3.479H1.19312Z"
                                  fill="#C30E0E"
                                />
                              </svg>
                            </Link>
                            <div
                              class="modal fade"
                              id={`staticBackdrop_${item?._id}`}
                              data-bs-backdrop="static"
                              data-bs-keyboard="false"
                              tabindex="-1"
                              aria-labelledby="staticBackdropLabel"
                              aria-hidden="true"
                            >
                              <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content">
                                  <div class="modal-body py-5">
                                    <div className="d-flex flex-column justify-content-center align-items-center">
                                      <i className="text-center">
                                        <svg
                                          width="100"
                                          viewBox="0 0 268 268"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <g opacity="0.01">
                                            <path
                                              d="M134 0.939941C60.5108 0.939941 0.939941 60.5108 0.939941 134C0.939941 207.489 60.5108 267.06 134 267.06C207.489 267.06 267.06 207.489 267.06 134C267.06 60.5108 207.489 0.939941 134 0.939941Z"
                                              fill="#C5D9F1"
                                            />
                                            <path
                                              d="M134 0.939941C60.5108 0.939941 0.939941 60.5108 0.939941 134C0.939941 207.489 60.5108 267.06 134 267.06C207.489 267.06 267.06 207.489 267.06 134C267.06 60.5108 207.489 0.939941 134 0.939941Z"
                                              stroke="#F2F2F2"
                                              stroke-width="1.25"
                                            />
                                          </g>
                                          <path
                                            d="M90.5 102.991H177.5V192.378C177.5 197.714 173.169 202.045 167.833 202.045H100.167C94.8307 202.045 90.5 197.714 90.5 192.378V102.991ZM97.75 110.241V192.378C97.75 193.712 98.8327 194.795 100.167 194.795H167.833C169.167 194.795 170.25 193.712 170.25 192.378V110.241H97.75Z"
                                            fill="#2C5F2D"
                                          />
                                          <path
                                            d="M88.5944 79.0569L175.594 79.0573C180.93 79.0573 185.261 83.388 185.261 88.724L185.261 108.057L78.9276 108.057L78.9277 88.7236C78.9277 83.3876 83.2584 79.0569 88.5944 79.0569ZM178.011 100.807L178.011 88.724C178.011 87.39 176.928 86.3073 175.594 86.3073L88.5944 86.3069C87.2604 86.3069 86.1777 87.3896 86.1777 88.7236L86.1776 100.807L178.011 100.807Z"
                                            fill="#2C5F2D"
                                          />
                                          <path
                                            d="M124.361 62.3733L139.828 62.3734C144.097 62.3734 147.561 65.838 147.561 70.1068L147.561 83.5318L116.628 83.5317L116.628 70.1066C116.628 65.8378 120.092 62.3733 124.361 62.3733ZM141.761 70.1067C141.761 69.0395 140.895 68.1734 139.828 68.1734L124.361 68.1733C123.294 68.1733 122.428 69.0395 122.428 70.1067L122.428 77.7317L141.761 77.7318L141.761 70.1067Z"
                                            fill="#2C5F2D"
                                          />
                                          <path
                                            d="M129.921 126C129.921 123.999 131.545 122.375 133.546 122.375C135.547 122.375 137.171 123.999 137.171 126V183.816C137.171 185.817 135.547 187.441 133.546 187.441C131.545 187.441 129.921 185.817 129.921 183.816V126ZM130.375 126C130.375 123.999 131.999 122.375 134 122.375C136.001 122.375 137.625 123.999 137.625 126V183.816C137.625 185.817 136.001 187.441 134 187.441C131.999 187.441 130.375 185.817 130.375 183.816V126ZM129.771 125.908C129.771 123.907 131.395 122.283 133.396 122.283C135.397 122.283 137.021 123.907 137.021 125.908V183.724C137.021 185.725 135.397 187.349 133.396 187.349C131.395 187.349 129.771 185.725 129.771 183.724V125.908Z"
                                            fill="#2C5F2D"
                                          />
                                        </svg>
                                      </i>

                                      <h5
                                        className="mt-4"
                                        style={{ textAlign: "center" }}
                                      >
                                        Are you sure you want to delete this
                                        submission?
                                      </h5>

                                      <div className="d-flex justify-content-center mt-3">
                                        <button
                                          type="button"
                                          class="btn btn-primary"
                                          data-bs-dismiss="modal"
                                          onClick={() => {
                                            deleteContactForm(item);
                                          }}
                                        >
                                          Yes
                                        </button>
                                        <button
                                          type="button"
                                          class="btn btn-default ms-3"
                                          data-bs-dismiss="modal"
                                        >
                                          No
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </span>
                        </td>
                      </tr>
                    );
                  }
                })
              : !loading && (
                  <div
                    className="container text-center no-padding"
                    style={{ padding: "100px" }}
                  >
                    <div className="col-lg-6 m-auto">
                      <p className="data_not_found">No data found</p>
                    </div>
                  </div>
                )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactFormList;
