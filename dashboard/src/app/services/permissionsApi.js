// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const permissionApi = createApi({
  reducerPath: "permissionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
  }),
  tagTypes: ["Permissions"],
  endpoints: (builder) => ({
    getPermissions: builder.query({
      query: () => ({
        url: "/permission",
        method: "GET",
      }),
      providesTags: (result) =>
        // is result available?
        result?.permissions
          ? // successful query
            [
              ...result.permissions.map(({ id }) => ({
                type: "Permissions",
                id,
              })),
              { type: "Permissions", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "Permissions", id: "LIST" }],
    }),
    createPermission: builder.mutation({
      query: (body) => ({
        url: "/permission",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Permissions", id: "LIST" }],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetPermissionsQuery, useCreatePermissionMutation } =
  permissionApi;
