import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// // Create User
export const getAllAuthUser = createAsyncThunk(
  "user/getAllAuthUser",
  async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// // Create User
export const createAuthUser = createAsyncThunk(
  "user/createAuthUser",
  async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
// Update Status status
export const updateAuthUser = createAsyncThunk(
  "user/updateAuthUser",
  async ({ id, data }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/auth/${id}`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
// // Delete User
export const deleteAuthUser = createAsyncThunk(
  "user/deleteAuthUser",
  async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/auth/${id}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
