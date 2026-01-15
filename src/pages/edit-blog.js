import React from "react";
import Footer from "../common/Footer";
import Header from "../common/Header";
import Sidebar from "../common/sidebar";
import EditBlogPost from "../section/home/blog/edit-blog-content";
const EditBlog = () => {
  React.useEffect(() => {
    document.title = "Edit Blogs";
  }, []);

  return (
    <div className="bg-grey h-100">
      <Header />
      
<section className="content-area mt-4">
    <Sidebar/>
    <div className="Right-content">
      <div className="main-content">
    <EditBlogPost/>
      </div> 
      <Footer />
    </div>
</section>
      
     
    </div>
  );
};

export default EditBlog;