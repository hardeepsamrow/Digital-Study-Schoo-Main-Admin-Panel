import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataService from "../../../services/data.service";
import moment from "moment";

const ResourcesList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Student Portal - Resources";
    getData();
  }, []);

  const getData = () => {
    DataService.getAllResources().then((res) => {
      setData(res.data.data);
      setLoading(false);
    }).catch((err) => {
      setLoading(false);
      toast.error("Error fetching resources");
    });
  };

  const deleteResource = (id) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      setLoading(true);
      DataService.deleteResource(id).then(() => {
        toast.success("Resource Deleted Successfully");
        getData();
      }).catch((err) => {
        setLoading(false);
        toast.error("Error deleting resource");
      });
    }
  };

  return (
    <div className="row">
      <ToastContainer />
      <div className="col-md-12">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="f-700">All Learning Resources</h4>
          <Link to="/student-portal/resources/add" className="btn btn-primary" style={{ background: "#157549" }}>
            + Add New Resource
          </Link>
        </div>
        
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Type</th>
              <th scope="col">Course Tag</th>
              <th scope="col">Category</th>
              <th scope="col">Duration</th>
              <th scope="col">Created At</th>
              <th scope="col" className="text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center">Loading...</td></tr>
            ) : data && data.length > 0 ? (
              data.map((item, i) => (
                <tr key={i}>
                  <td>{item.title}</td>
                  <td>{item.resourceType}</td>
                  <td>{item.courseTag}</td>
                  <td>{item.category || "General"}</td>
                  <td>{item.courseDuration || "Both"}</td>
                  <td>{moment(item.createdAt).format("ll")}</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-danger" onClick={() => deleteResource(item._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="text-center">No resources found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResourcesList;
