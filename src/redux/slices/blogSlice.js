// src/features/blog/blogSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com/posts';
const POSTS_PER_PAGE = 10;

// Async Thunks
export const fetchBlogs = createAsyncThunk('blogs/fetch', async () => {
  const res = await axios.get(API_URL);
  return {
    blogs: res.data.slice(0, POSTS_PER_PAGE),
    hasMore: res.data.length > POSTS_PER_PAGE,
    currentPage: 1
  };
});

export const loadMoreBlogs = createAsyncThunk('blogs/loadMore', async (currentPage) => {
  const res = await axios.get(API_URL);
  const startIndex = currentPage * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const newBlogs = res.data.slice(startIndex, endIndex);
  
  return {
    blogs: newBlogs,
    hasMore: endIndex < res.data.length,
    currentPage: currentPage + 1
  };
});

export const addBlog = createAsyncThunk('blogs/add', async (newBlog) => {
  const res = await axios.post(API_URL, newBlog);
  return res.data;
});

export const updateBlog = createAsyncThunk('blogs/update', async (blog) => {
  const res = await axios.put(`${API_URL}/${blog.id}`, blog);
  return res.data;
});

export const deleteBlog = createAsyncThunk('blogs/delete', async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

const blogSlice = createSlice({
  name: 'blogs',
  initialState: {
    blogs: [],
    loading: false,
    loadingMore: false,
    error: null,
    hasMore: true,
    currentPage: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.blogs;
        state.hasMore = action.payload.hasMore;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Load More
      .addCase(loadMoreBlogs.pending, (state) => {
        state.loadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreBlogs.fulfilled, (state, action) => {
        state.loadingMore = false;
        state.blogs = [...state.blogs, ...action.payload.blogs];
        state.hasMore = action.payload.hasMore;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(loadMoreBlogs.rejected, (state, action) => {
        state.loadingMore = false;
        state.error = action.error.message;
      })

      // Add
      .addCase(addBlog.fulfilled, (state, action) => {
        state.blogs.unshift(action.payload);
      })

      // Update
      .addCase(updateBlog.fulfilled, (state, action) => {
        const index = state.blogs.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) state.blogs[index] = action.payload;
      })

      // Delete
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter((b) => b.id !== action.payload);
      });
  },
});

export default blogSlice.reducer;
