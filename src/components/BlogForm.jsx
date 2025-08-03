// src/components/BlogForm.jsx
import { useState, useEffect } from 'react';
import '../assets/scss/components/_blog-form.scss';

const BlogForm = ({ 
  editingBlog = null, 
  onSubmit, 
  onCancel,
  loading = false 
}) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (editingBlog) {
      setTitle(editingBlog.title);
      setBody(editingBlog.body);
    } else {
      setTitle('');
      setBody('');
    }
    setErrors({});
  }, [editingBlog]);

  // Validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    
    if (!body.trim()) {
      newErrors.body = 'Content is required';
    } else if (body.trim().length < 10) {
      newErrors.body = 'Content must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const blogData = {
      title: title.trim(),
      body: body.trim(),
      userId: 1, // dummy ID for mock API
    };

    if (editingBlog) {
      onSubmit({ ...editingBlog, ...blogData });
    } else {
      onSubmit(blogData);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setBody('');
    setErrors({});
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="blog-form">
      {/* Title Field */}
      <div className="form-group">
        <label className="form-label" htmlFor="blog-title">
          Title <span className="form-required">*</span>
        </label>
        <input
          id="blog-title"
          type="text"
          className={`form-input ${errors.title ? 'form-input--error' : ''}`}
          placeholder="Enter an engaging title for your blog..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          autoFocus
        />
        {errors.title && (
          <span className="form-error">{errors.title}</span>
        )}
      </div>

      {/* Content Field */}
      <div className="form-group">
        <label className="form-label" htmlFor="blog-content">
          Content <span className="form-required">*</span>
        </label>
        <textarea
          id="blog-content"
          className={`form-textarea ${errors.body ? 'form-textarea--error' : ''}`}
          placeholder="Write your blog content here... Share your thoughts, ideas, or story with the world!"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={loading}
          rows={8}
        />
        {errors.body && (
          <span className="form-error">{errors.body}</span>
        )}
        <div className="form-hint">
          Character count: {body.length}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="form-actions">
        <button
          type="button"
          className="form-button form-button--secondary"
          onClick={handleCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="form-button form-button--primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="button-spinner"></span>
              {editingBlog ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            editingBlog ? 'Update Blog' : 'Create Blog'
          )}
        </button>
      </div>
    </form>
  );
};

export default BlogForm;