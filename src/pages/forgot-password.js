import React from "react";
import { Link } from "react-router-dom";
const ForgotPassword = () => {
    React.useEffect(() => {
        document.title = "Login";
    }, []);

    return (
        <div className="container-fluid bg-grey p-0 h-100">
            <div className="row m-0">
                <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 bg-white p-4 h-100">
                    <Link to={"/"}>
                        <img src="../assets/img/adminlogo.png" className="main_logo" alt="" />
                    </Link>
                    <h3 className="mt-50">Forgot Password</h3>
                    <p>Enter Your New Password</p>
                    <form className="mt-4 login">
                        <div className="mb-4">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Password</label>
                            <input type="password" className="form-control" placeholder="Enter Your Password" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Password</label>
                            <input type="password" className="form-control" placeholder="Re Enter Your Password" />
                        </div>
                        <div className="d-grid mt-5">
                            <Link to={"/dashboard"} className="btn btn-primary" type="submit">Change Password</Link>
                        </div>
                    </form>
                </div>
                <div className="col-xxl-9 col-xl-8 col-lg-8 col-md-6 px-5 d-flex align-items-center justify-content-center ">
                    <img src="../assets/img/pana.png" className="img-fluid max-7" alt="" />
                </div>
            </div>

        </div>
    );
};

export default ForgotPassword;
