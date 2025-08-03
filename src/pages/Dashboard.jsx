// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBlogs,
  addBlog,
  updateBlog,
  deleteBlog,
} from '../redux/slices/blogSlice';
import Header from '../components/Header';
import Popup from '../components/Popup';
import BlogForm from '../components/BlogForm';
import '../assets/scss/pages/_dashboard.scss';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { blogs, loading } = useSelector((state) => state.blogs);

  const [editingBlog, setEditingBlog] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const handleSubmit = async (blogData) => {
    setIsSubmitting(true);
    
    try {
      if (editingBlog) {
        await dispatch(updateBlog(blogData));
        setEditingBlog(null);
      } else {
        await dispatch(addBlog(blogData));
      }
      
      // Close popup after successful submission
      setIsPopupOpen(false);
    } catch (error) {
      console.error('Error submitting blog:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setIsPopupOpen(true);
  };

  const handleCreateNew = () => {
    setEditingBlog(null);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setEditingBlog(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      dispatch(deleteBlog(id));
    }
  };

  return (
    <div className="dashboard-container">
      <Header />

      <main className="dashboard-content">
        {/* Blog List Section - Full Width */}
        <section className="blog-list-section">
          <div className="blog-list-header">
            <h2 className="blog-list__title">My Blogs</h2>
            <button 
              className="create-blog-button"
              onClick={handleCreateNew}
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M12 5V19M5 12H19" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              Create New Blog
            </button>
          </div>

          {loading ? (
            <div className="blog-list__loading">Loading blogs...</div>
          ) : blogs.length === 0 ? (
            <div className="blog-list__empty">
              <div className="empty-state">
                <svg 
                  width="64" 
                  height="64" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  <path 
                    d="M14 2V8H20" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
                <h3>No blogs yet</h3>
                <p>Create your first blog post to get started!</p>
                <button 
                  className="empty-state-button"
                  onClick={handleCreateNew}
                >
                  Create Your First Blog
                </button>
              </div>
            </div>
          ) : (
            <div className="blog-list__container">
              {blogs.map((blog) => (
                <div key={blog.id} className="blog-card">
                  <h3 className="blog-card__title">{blog.title}</h3>
                  <p className="blog-card__content">{blog.body}</p>
                  <p className="blog-card__author">Author ID: {blog.userId}</p>
                  <div className="blog-actions">
                    <button 
                      className="action-button action-button--edit" 
                      onClick={() => handleEdit(blog)}
                    >
                      Edit
                    </button>
                    <button 
                      className="action-button action-button--delete" 
                      onClick={() => handleDelete(blog.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Blog Form Popup */}
      <Popup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        title={editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
        size="large"
      >
        <BlogForm
          editingBlog={editingBlog}
          onSubmit={handleSubmit}
          onCancel={handleClosePopup}
          loading={isSubmitting}
        />
      </Popup>
    </div>
  );
};

export default Dashboard;
