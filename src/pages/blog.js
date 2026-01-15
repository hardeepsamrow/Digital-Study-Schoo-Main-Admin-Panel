import React from "react";
import Footer from "../common/Footer";
import Header from "../common/Header";
import Sidebar from "../common/sidebar";
import BlogList from "../section/home/blog/blog-listing";
const Blogs = () => {
  React.useEffect(() => {
    document.title = "Blogs";
  }, []);

  return (
    <div className="bg-grey h-100">
      <Header />
      
<section className="content-area mt-4">
    <Sidebar/>
    <div className="Right-content">
      <div className="main-content">
      <BlogList/>
    
      </div> 
      <Footer />
    </div>
</section>
      
     
    </div>
  );
};

export default Blogs;