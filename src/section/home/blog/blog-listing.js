import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataService from "../../../services/data.service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BlogList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData1, setFilteredData1] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [viewType, setViewType] = useState("table"); // 'table' or 'grid'

  useEffect(() => {
    document.title = "Blog";
    getData();
  }, []);

  const handleError = (e) => {
    e.target.src = "../../assets/img/no-image.png";
  };

  const getData = () => {
    setLoading(true);
    DataService.getAllBlog().then((response) => {
      const blogs = response?.data?.data || [];
      // Sort blogs: latest (newest) on top
      blogs.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (dateB !== dateA) {
          return dateB - dateA;
        }
        // Fallback to _id descending (assuming Mongo ObjectId)
        return (b._id || "").localeCompare(a._id || "");
      });
      setData(blogs);
      setFilteredData1(blogs);
      setLoading(false);
    }).catch((error) => {
      console.error("Error fetching blogs:", error);
      setLoading(false);
    });
  };

  const deleteBlog = (item) => {
    setLoading(true);
    DataService.deleteBlog(item?._id).then(
      () => {
        toast.success("Blog deleted successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        getData(); // Refresh data after delete
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

  useEffect(() => {
    filterData();
  }, [selectedStatus, data]);

  const filterData = () => {
    if (selectedStatus === "All") {
      setFilteredData1(data);
    } else {
      const result = data.filter((value) => {
        // Check if status matches, handling case sensitivity if needed
        return value.status === selectedStatus || value.status?.toLowerCase() === selectedStatus.toLowerCase();
      });
      setFilteredData1(result);
    }
  };

  const onChangeStatus = (e) => {
    setSelectedStatus(e.target.value);
  };

  const safeJsonParse = (str, key) => {
    try {
      if (!str) return "";
      // Check if str is already an object
      if (typeof str === 'object') {
        return key ? (str[key] || "") : str;
      }
      const parsed = JSON.parse(str);
      return key ? (parsed[key] || "") : parsed;
    } catch (e) {
      return str; // Return original string if parse fails (fallback)
    }
  };

  const getImageUrl = (url) => {
    if (!url) return "../../assets/img/placeholder-img.png";
    if (url.startsWith("http") || url.startsWith("//")) return url;
    return "https://backend.digitalstudyschool.com" + url;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="row m-0">
      <ToastContainer />
      <div className="col-md-12">
        <div className="flex_blogstatus">
          <div className="flex_status_one">
            <h4 className="f-700 mb-4">All Blogs</h4>
          </div>
          <div className="flex_status_two d-flex align-items-center">
            <div className="btn-group me-3" role="group">
              <button
                type="button"
                className={`btn btn-outline-primary ${viewType === 'table' ? 'active' : ''}`}
                onClick={() => setViewType('table')}
                title="Table View"
              >
                <i className="fas fa-list"></i>
              </button>
              <button
                type="button"
                className={`btn btn-outline-primary ${viewType === 'grid' ? 'active' : ''}`}
                onClick={() => setViewType('grid')}
                title="Grid View"
              >
                <i className="fas fa-th-large"></i>
              </button>
            </div>

            <form className="d-flex align-items-center ms-auto">
              <label className="me-3">Status</label>
              <select
                className="form-select me-3"
                value={selectedStatus}
                onChange={onChangeStatus}
              >
                <option value="All">All</option>
                <option value="Published">Published</option>
                <option value="Pending">Scheduled</option>
              </select>
            </form>
          </div>
        </div>

        <div className="col-lg-12 text-center">
          {loading && (
            <span className="spinner-border spinner-border-sm mb-3"></span>
          )}
        </div>

        <div className="row">
          {filteredData1 && filteredData1.length > 0 ? (
            viewType === 'table' ? (
              <div className="col-12">
                <div className="table-responsive bg-white p-3 rounded shadow-sm">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Image</th>
                        <th style={{ width: '20%' }}>Blog Info</th>
                        <th style={{ width: '20%' }}>Meta Title</th>
                        <th style={{ width: '25%' }}>Meta Description</th>
                        <th style={{ width: '15%' }}>Keywords</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData1.map((item) => {
                        const metaTitle = item?.metaTitle || "";
                        const metaDesc = item?.metaDescription || "";
                        const metaKeywords = item?.metaKeywords || [];

                        // Count colors
                        const getLenColor = (len, max) => {
                          if (len === 0) return '#dc3545';
                          if (len > max) return '#dc3545';
                          if (len < max * 0.5) return '#ffc107';
                          return '#198754';
                        };

                        return (
                          <tr key={item._id}>
                            <td>
                              <img
                                src={getImageUrl(item?.image?.url)}
                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                                alt="thumb"
                                onError={handleError}
                              />
                            </td>
                            <td>
                              <div className="fw-bold text-truncate" style={{ maxWidth: '200px' }} title={safeJsonParse(item?.title, "EN")}>
                                {safeJsonParse(item?.title, "EN")}
                              </div>
                              <div className="small text-muted mt-1">
                                <a href={`https://digitalstudyschool.com/blog/${item?.url?.replace(/^\//, "")}`} target="_blank" rel="noreferrer" className="text-decoration-none">
                                  <i className="fas fa-external-link-alt me-1"></i> View Live
                                </a>
                              </div>
                              <div className="small text-muted">
                                {formatDate(item?.createdAt)}
                              </div>
                            </td>
                            <td>
                              <div className="small mb-1" style={{ color: getLenColor(metaTitle.length, 60), fontWeight: 'bold' }}>
                                {metaTitle.length} / 60
                              </div>
                              <div className="small text-wrap" style={{ maxWidth: '250px', fontSize: '12px', lineHeight: '1.2' }}>
                                {metaTitle || <span className="text-muted fst-italic">Missing</span>}
                              </div>
                            </td>
                            <td>
                              <div className="small mb-1" style={{ color: getLenColor(metaDesc.length, 160), fontWeight: 'bold' }}>
                                {metaDesc.length} / 160
                              </div>
                              <div className="small text-wrap" style={{ maxWidth: '300px', fontSize: '12px', lineHeight: '1.2' }}>
                                {metaDesc || <span className="text-muted fst-italic">Missing</span>}
                              </div>
                            </td>
                            <td>
                              <div className="small text-wrap" style={{ maxWidth: '150px' }}>
                                {metaKeywords.length > 0 ? (
                                  metaKeywords.map((k, i) => (
                                    <span key={i} className="badge bg-light text-dark border me-1 mb-1">{k}</span>
                                  ))
                                ) : (
                                  <span className="text-muted fst-italic small">No keywords</span>
                                )}
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${item?.status === "Published" ? "bg-success" : "bg-warning text-dark"}`}>
                                {item?.status === "Published" ? "Published" : "Scheduled"}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex">
                                <Link to={"/edit-blog/" + item._id} className="btn btn-sm btn-outline-primary me-2" title="Edit">
                                  <i className="fas fa-edit"></i>
                                </Link>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  data-bs-toggle="modal"
                                  data-bs-target={`#staticBackdrop_${item._id}`}
                                  title="Delete"
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </button>

                                {/* Delete Modal inside loop to keep logic simple (though inefficient for large lists, simpler for refactor) */}
                                <div
                                  className="modal fade"
                                  id={`staticBackdrop_${item?._id}`}
                                  data-bs-backdrop="static"
                                  data-bs-keyboard="false"
                                  tabIndex="-1"
                                  aria-hidden="true"
                                >
                                  <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                      <div className="modal-body py-5 text-center">
                                        <h5 className="mt-3">Are you sure you want to delete this blog?</h5>
                                        <div className="mt-4">
                                          <button type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal">No</button>
                                          <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => deleteBlog(item)}>Yes</button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              filteredData1.map((item) => (
                <div className="col-xl-4 col-md-6 col-12 mb-3" key={item._id}>
                  <div className="blogList bg-grey">
                    <span
                      className={`${item?.status === "Published" ? "status_pub" : "status_pen"
                        }`}
                    >
                      {item?.status === "Published" ? "Published" : "Scheduled"}
                    </span>

                    <div style={{ height: '250px', overflow: 'hidden' }}>
                      <img
                        src={getImageUrl(item?.image?.url)}
                        className="product-img"
                        alt="blog_img"
                        onError={handleError}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    <div className="caption">
                      <h5 title={safeJsonParse(item?.title, "EN")}>
                        {safeJsonParse(item?.title, "EN")?.split(" ")?.slice(0, 12)?.join(" ")}
                        {safeJsonParse(item?.title, "EN")?.split(" ").length > 12 ? "..." : ""}
                      </h5>

                      <p className="mb-2" style={{ color: '#2C5F2D', fontWeight: 'bold', fontSize: '14px' }}>
                        <i className="far fa-clock me-1"></i> {item?.status === "Published" ? "Published" : "Created"}: {formatDate(item?.createdAt)}
                      </p>
                    </div>
                    <div className="blog_actions block-action-2">
                      <div className="action-div">
                        <a
                          href={`https://digitalstudyschool.com/blog/${item?.url?.replace(/^\//, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="me-3"
                          title="View"
                        >
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="#2C5F2D" />
                          </svg>
                        </a>
                        <Link to={"/edit-blog/" + item._id} className="me-3" title="Edit">
                          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.8415 0.623009C13.0368 0.427747 13.3534 0.427747 13.5486 0.623009L16.5486 3.62301C16.7439 3.81827 16.7439 4.13485 16.5486 4.33012L6.54864 14.3301C6.50076 14.378 6.44365 14.4157 6.38078 14.4408L1.38078 16.4408C1.19507 16.5151 0.982961 16.4715 0.84153 16.3301C0.700098 16.1887 0.656561 15.9766 0.730845 15.7909L2.73084 10.7909C2.75599 10.728 2.79365 10.6709 2.84153 10.623L12.8415 0.623009ZM11.9022 2.97656L14.1951 5.26946L15.488 3.97656L13.1951 1.68367L11.9022 2.97656ZM13.488 5.97656L11.1951 3.68367L4.69508 10.1837V10.4766H5.19508C5.47123 10.4766 5.69508 10.7004 5.69508 10.9766V11.4766H6.19508C6.47123 11.4766 6.69508 11.7004 6.69508 11.9766V12.4766H6.98798L13.488 5.97656ZM3.72673 11.152L3.62121 11.2575L2.09261 15.079L5.9141 13.5504L6.01963 13.4449C5.83003 13.3739 5.69508 13.191 5.69508 12.9766V12.4766H5.19508C4.91894 12.4766 4.69508 12.2527 4.69508 11.9766V11.4766H4.19508C3.98068 11.4766 3.79779 11.3416 3.72673 11.152Z" fill="#2C5F2D" />
                          </svg>
                        </Link>
                        <Link
                          data-bs-toggle="modal"
                          data-bs-target={`#staticBackdrop_${item._id}`}
                          className="mx-2"
                          title="Delete"
                        >
                          <svg
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
                              fillRule="evenodd" // React demands camelCase
                              clipRule="evenodd"
                              d="M13.1931 3.479C13.1931 4.03129 12.7454 4.479 12.1931 4.479H11.6931V13.479C11.6931 14.5836 10.7977 15.479 9.69312 15.479H3.69312C2.58855 15.479 1.69312 14.5836 1.69312 13.479V4.479H1.19312C0.640831 4.479 0.193115 4.03129 0.193115 3.479V2.479C0.193115 1.92672 0.640831 1.479 1.19312 1.479H4.69312C4.69312 0.926719 5.14083 0.479004 5.69312 0.479004H7.69312C8.2454 0.479004 8.69312 0.926719 8.69312 1.479H12.1931C12.7454 1.479 13.1931 1.92672 13.1931 2.479V3.479ZM2.81115 4.479L2.69312 4.53802V13.479C2.69312 14.0313 3.14083 14.479 3.69312 14.479H9.69312C10.2454 14.479 10.6931 14.0313 10.6931 13.479V4.53802L10.5751 4.479H2.81115ZM1.19312 3.479V2.479H12.1931V3.479H1.19312Z"
                              fill="#C30E0E"
                            />
                          </svg>
                        </Link>
                        <div
                          className="modal fade"
                          id={`staticBackdrop_${item?._id}`}
                          data-bs-backdrop="static"
                          data-bs-keyboard="false"
                          tabIndex="-1"
                          aria-labelledby="staticBackdropLabel"
                          aria-hidden="true"
                        >
                          <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                              <div className="modal-body py-5">
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
                                          strokeWidth="1.25"
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

                                  <h5 className="mt-4">
                                    Are you sure you want to delete this blog?
                                  </h5>
                                  <div className="d-flex justify-content-center mt-3">
                                    <button
                                      type="button"
                                      className="btn btn-default me-3"
                                      data-bs-dismiss="modal"
                                    >
                                      No
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-primary"
                                      data-bs-dismiss="modal"
                                      onClick={() => {
                                        deleteBlog(item);
                                      }}
                                    >
                                      Yes
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
            !loading && (
              <div
                className="container-fluid text-center no-padding"
                style={{ padding: "100px" }}
              >
                <div className="col-lg-6 m-auto">
                  {/* Placeholder for no data */}
                  <div style={{ fontSize: '50px', color: '#ccc', marginBottom: '20px' }}><i className="fas fa-folder-open"></i></div>
                  <p className="mb-3">No blogs found.</p>
                  <Link to="/add-blog" className="btn btn-primary">Add New Blog</Link>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogList;
