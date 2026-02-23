import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataService from "../../../services/data.service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthorList = () => {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        getAuthors();
    }, []);

    const getAuthors = () => {
        DataService.getAllAuthors().then((data) => {
            setAuthors(data.data.data);
            setFilteredData(data.data.data);
            setLoading(false);
        }).catch(err => {
            setLoading(false);
            console.error(err);
        });
    };

    const onChangeSearch = (e) => {
        if (e.target.value) {
            const result = authors.filter((value) => {
                return (
                    value?.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                    value?.email?.toLowerCase().includes(e.target.value.toLowerCase())
                );
            });
            setFilteredData(result);
        } else {
            setFilteredData(authors);
        }
    };

    const deleteAuthor = (id) => {
        setLoading(true);
        DataService.deleteAuthor(id).then(
            () => {
                toast.success("Author deleted successfully");
                getAuthors();
            },
            (error) => {
                setLoading(false);
                toast.error("Failed to delete author");
            }
        );
    };

    return (
        <div className="row">
            <ToastContainer />
            <div className="col-md-12">
                <h4 className="f-700 mb-4">Authors</h4>
                <div className="table-header d-flex align-items-center">
                    <div className="table-search">
                        <i>
                            <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.7422 10.8439C12.5329 9.7673 13 8.4382 13 7C13 3.41015 10.0899 0.5 6.5 0.5C2.91015 0.5 0 3.41015 0 7C0 10.5899 2.91015 13.5 6.5 13.5C7.93858 13.5 9.26801 13.0327 10.3448 12.2415L10.3439 12.2422C10.3734 12.2822 10.4062 12.3204 10.4424 12.3566L14.2929 16.2071C14.6834 16.5976 15.3166 16.5976 15.7071 16.2071C16.0976 15.8166 16.0976 15.1834 15.7071 14.7929L11.8566 10.9424C11.8204 10.9062 11.7822 10.8734 11.7422 10.8439ZM12 7C12 10.0376 9.53757 12.5 6.5 12.5C3.46243 12.5 1 10.0376 1 7C1 3.96243 3.46243 1.5 6.5 1.5C9.53757 1.5 12 3.96243 12 7Z" fill="#707070" fillOpacity="0.5" />
                            </svg>
                        </i>
                        <input type="search" onChange={onChangeSearch} name="search" placeholder="Search Author" />
                    </div>
                    <div className="d-flex align-items-center ms-auto">
                        <Link to={"/add-author"} className="btn btn-secondary">Add Author</Link>
                    </div>
                </div>
                <div className="container-fluid text-center">
                    {loading && <span className="spinner-border spinner-border-sm"></span>}
                </div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Image</th>
                            <th scope="col">Name</th>
                            <th scope="col">Designation</th>
                            <th scope="col">Email</th>
                            <th scope="col" className="text-end">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? filteredData.map((item, i) => (
                            <tr key={i}>
                                <td>
                                    <img
                                        src={item.image ? `https://backend.digitalstudyschool.com${item.image.url}` : "../assets/img/user-default.png"}
                                        alt={item.name}
                                        style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                                    />
                                </td>
                                <td>{item.name}</td>
                                <td>{item.designation}</td>
                                <td>{item.email}</td>
                                <td className="text-end">
                                    <Link to={"/edit-author/" + item._id} className="mx-2">
                                        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12.8415 0.623009C13.0368 0.427747 13.3534 0.427747 13.5486 0.623009L16.5486 3.62301C16.7439 3.81827 16.7439 4.13485 16.5486 4.33012L6.54864 14.3301C6.50076 14.378 6.44365 14.4157 6.38078 14.4408L1.38078 16.4408C1.19507 16.5151 0.982961 16.4715 0.84153 16.3301C0.700098 16.1887 0.656561 15.9766 0.730845 15.7909L2.73084 10.7909C2.75599 10.728 2.79365 10.6709 2.84153 10.623L12.8415 0.623009ZM11.9022 2.97656L14.1951 5.26946L15.488 3.97656L13.1951 1.68367L11.9022 2.97656ZM13.488 5.97656L11.1951 3.68367L4.69508 10.1837V10.4766H5.19508C5.47123 10.4766 5.69508 10.7004 5.69508 10.9766V11.4766H6.19508C6.47123 11.4766 6.69508 11.7004 6.69508 11.9766V12.4766H6.98798L13.488 5.97656ZM3.72673 11.152L3.62121 11.2575L2.09261 15.079L5.9141 13.5504L6.01963 13.4449C5.83003 13.3739 5.69508 13.191 5.69508 12.9766V12.4766H5.19508C4.91894 12.4766 4.69508 12.2527 4.69508 11.9766V11.4766H4.19508C3.98068 11.4766 3.79779 11.3416 3.72673 11.152Z" fill="#2C5F2D" />
                                        </svg>
                                    </Link>
                                    <span onClick={() => { if (window.confirm('Are you sure you want to delete this author?')) deleteAuthor(item._id) }} style={{ cursor: 'pointer' }} className="mx-2">
                                        <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.19312 5.979C4.46926 5.979 4.69312 6.20286 4.69312 6.479V12.479C4.69311 12.7551 4.46926 12.979 4.19312 12.979C3.91697 12.979 3.69312 12.7551 3.69312 12.479V6.479C3.69312 6.20286 3.91697 5.979 4.19312 5.979Z" fill="#C30E0E" />
                                            <path d="M6.69312 5.979C6.96926 5.979 7.19312 6.20286 7.19312 6.479V12.479C7.19312 12.7551 6.96926 12.979 6.69312 12.979C6.41697 12.979 6.19312 12.7551 6.19312 12.479V6.479C6.19312 6.20286 6.41697 5.979 6.69312 5.979Z" fill="#C30E0E" />
                                            <path d="M9.69312 6.479C9.69312 6.20286 9.46926 5.979 9.19312 5.979C8.91697 5.979 8.69312 6.20286 8.69312 6.479V12.479C8.69312 12.7551 8.91697 12.979 9.19312 12.979C9.46926 12.979 9.69312 12.7551 9.69312 12.479V6.479Z" fill="#C30E0E" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M13.1931 3.479C13.1931 4.03129 12.7454 4.479 12.1931 4.479H11.6931V13.479C11.6931 14.5836 10.7977 15.479 9.69312 15.479H3.69312C2.58855 15.479 1.69312 14.5836 1.69312 13.479V4.479H1.19312C0.640831 4.479 0.193115 4.03129 0.193115 3.479V2.479C0.193115 1.92672 0.640831 1.479 1.19312 1.479H4.69312C4.69312 0.926719 5.14083 0.479004 5.69312 0.479004H7.69312C8.2454 0.479004 8.69312 0.926719 8.69312 1.479H12.1931C12.7454 1.479 13.1931 1.92672 13.1931 2.479V3.479ZM2.81115 4.479L2.69312 4.53802V13.479C2.69312 14.0313 3.14083 14.479 3.69312 14.479H9.69312C10.2454 14.479 10.6931 14.0313 10.6931 13.479V4.53802L10.5751 4.479H2.81115ZM1.19312 3.479V2.479H12.1931V3.479H1.19312Z" fill="#C30E0E" />
                                        </svg>
                                    </span>
                                </td>
                            </tr>
                        )) : <tr><td colSpan="5" className="text-center">No authors found</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuthorList;
