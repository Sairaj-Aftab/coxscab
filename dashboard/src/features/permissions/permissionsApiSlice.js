import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Get All Permission
export const getAllPermission = createAsyncThunk(
  "permissions/getAllPermission",
  async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/permission`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// // Create Permission
export const createPermission = createAsyncThunk(
  "permissions/createPermission",
  async (name) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/permission`,
        { name },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// // Update permission status
export const updatePermissionStatus = createAsyncThunk(
  "permissions/updatePermissionStatus",
  async ({ id, status }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/permission/status/${id}`,
        { status: status },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// // Delete Permission
export const deletePermission = createAsyncThunk(
  "permissions/deletePermission",
  async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/permission/${id}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
