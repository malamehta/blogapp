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
              Create New Blog
            </button>
          </div>

          {loading ? (
            <div className="blog-list__loading">Loading blogs...</div>
          ) : blogs.length === 0 ? (
            <div className="blog-list__empty">
              <div className="empty-state">
                Empty state
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
