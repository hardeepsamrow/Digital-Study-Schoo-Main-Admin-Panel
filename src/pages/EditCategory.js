import React from "react";
import Header from "../common/Header";
import Sidebar from "../common/sidebar";
import Footer from "../common/Footer";
import EditCategoryList from "../section/home/Category/EditCategoryList";

const EditCategory = () => {
  React.useEffect(() => {
    document.title = "Edit Tag";
  }, []);

  return (
    <div className="bg-grey h-100">
      <Header />

      <section className="content-area mt-4">
        <Sidebar />
        <div className="Right-content">
          <div className="main-content">
            <EditCategoryList />
          </div>
          <Footer />
        </div>
      </section>
    </div>
  );
};

export default EditCategory;
