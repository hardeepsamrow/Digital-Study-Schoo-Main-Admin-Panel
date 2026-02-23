import React from "react";
import Footer from "../common/Footer";
import Header from "../common/Header";
import Sidebar from "../common/sidebar";
import EditAuthor from "../section/home/Author/EditAuthor";

const EditAuthorPage = () => {
    React.useEffect(() => {
        document.title = "Edit Author";
    }, []);

    return (
        <div className="bg-grey h-100">
            <Header />
            <section className="content-area mt-4">
                <Sidebar />
                <div className="Right-content">
                    <div className="main-content">
                        <EditAuthor />
                    </div>
                    <Footer />
                </div>
            </section>
        </div>
    );
};

export default EditAuthorPage;
