import React from "react";
import Footer from "../common/Footer";
import Header from "../common/Header";
import Sidebar from "../common/sidebar";
import AuthorList from "../section/home/Author/AuthorList";

const Authors = () => {
    React.useEffect(() => {
        document.title = "Authors";
    }, []);

    return (
        <div className="bg-grey h-100">
            <Header />
            <section className="content-area mt-4">
                <Sidebar />
                <div className="Right-content">
                    <div className="main-content">
                        <AuthorList />
                    </div>
                    <Footer />
                </div>
            </section>
        </div>
    );
};

export default Authors;
