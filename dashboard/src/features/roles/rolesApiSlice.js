import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// // Get All Rules
export const getAllRoles = createAsyncThunk("roles/getRoles", async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/role`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

// // Create Role
export const createRole = createAsyncThunk("roles/createRole", async (data) => {
  console.log(data);
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/role`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

// // Delete Rule
export const deleteRole = createAsyncThunk("roles/deleteRole", async (id) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/role/${id}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
});

// // Update Rule status
export const updateRoleStatus = createAsyncThunk(
  "roles/updateRoleStatus",
  async ({ id, status }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/role/status/${id}`,
        { status: status },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

// // Edit Rule Info
export const editRole = createAsyncThunk(
  "roles/editRole",
  async ({ id, name, permissions }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/role/${id}`,
        { name, permissions },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);
