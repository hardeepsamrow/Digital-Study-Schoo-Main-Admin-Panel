import React from "react";
import Header from "../common/Header";
import Sidebar from "../common/sidebar";
import Footer from "../common/Footer";
import AddCategoryList from "../section/home/Category/AddCategoryList";

const AddCategory = () => {
  React.useEffect(() => {
    document.title = "Add category";
  }, []);

  return (
    <div className="bg-grey h-100">
      <Header />

      <section className="content-area mt-4">
        <Sidebar />
        <div className="Right-content">
          <div className="main-content">
            <AddCategoryList/>
            </div>
          <Footer />
        </div>
      </section>
    </div>
  );
};

export default AddCategory;
