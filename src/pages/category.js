import React from "react";
import Header from "../common/Header";
import Sidebar from "../common/sidebar";
import Footer from "../common/Footer";
import CategoryList from "../section/home/Category/CategoryList";

const Category = () => {
  React.useEffect(() => {
    document.title = "All Category";
  }, []);

  return (
    <div className="bg-grey h-100">
      <Header />

      <section className="content-area mt-4">
        <Sidebar />
        <div className="Right-content">
          <div className="main-content">
            <CategoryList/>
            </div>
          <Footer />
        </div>
      </section>
    </div>
  );
};

export default Category;
