import React from "react";
import Footer from "../common/Footer";
import Header from "../common/Header";
import Sidebar from "../common/sidebar";
import CertifiedStudentsList from "../section/home/certifiedStudents/CertifiedStudentsList";

const CertifiedStudents = () => {
    React.useEffect(() => {
        document.title = "Certified Students";
    }, []);

    return (
        <div className="bg-grey h-100">
            <Header />
            <section className="content-area mt-4">
                <Sidebar />
                <div className="Right-content">
                    <div className="main-content">
                        <CertifiedStudentsList />
                    </div>
                    <Footer />
                </div>
            </section>
        </div>
    );
};

export default CertifiedStudents;
