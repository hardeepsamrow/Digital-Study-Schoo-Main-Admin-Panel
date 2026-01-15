import React, { useEffect, useState, Fragment } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataService from "../../../services/data.service";
import Header from "../../../common/Header";
import Sidebar from "../../../common/sidebar";
import Footer from "../../../common/Footer";
import moment from "moment";
const PDFFormList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setfilteredData] = useState([]);
  //console.log(props)

  useEffect(() => {
    document.title = "All PDF Form Submissions";
    getData();
  }, []);
  const userId = JSON.parse(localStorage.getItem("user_id"));
  const getData = () => {
    DataService.getPDFForm().then((data) => {
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
    <div className="bg-grey h-100">
      <Header />

      <section className="content-area mt-4">
        <Sidebar />
        <div className="Right-content">
          <div className="main-content">
            <div className="row">
              <ToastContainer />
              <div className="col-md-12">
                <h4 className="f-700 mb-4">All PDF Form Submissions</h4>
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
                      <th scope="col">Email</th>
                      <th scope="col">Phone</th>
                      <th scope="col">Course Type</th>
                      <th scope="col">Message</th>
                      <th scope="col">Submitted On</th>
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
                                <td>{item?.phoneNo}</td>
                                <td>{item?.courseType}</td>
                                <td>{item?.message}</td>
                                <td>{moment(item?.createdAt).format("ll")}</td>
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
          </div>
          <Footer />
        </div>
      </section>
    </div>
  );
};

export default PDFFormList;
