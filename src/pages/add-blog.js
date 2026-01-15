import React from "react";
import Footer from "../common/Footer";
import Header from "../common/Header";
import Sidebar from "../common/sidebar";
import AddBlogPost from "../section/home/blog/add-blog-content";
const AddBlog = () => {
  React.useEffect(() => {
    document.title = "Add Blogs";
  }, []);

  return (
    <div className="bg-grey h-100">
      <Header />

      <section className="content-area mt-4">
        <Sidebar />
        <div className="Right-content">
          <div className="main-content">
            <AddBlogPost />
          </div>
          <Footer />
        </div>
      </section>
    </div>
  );
};

export default AddBlog;
