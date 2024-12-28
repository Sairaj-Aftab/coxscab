// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: ({ search, status, role, page, limit }) => ({
        url: "/user/all-users",
        method: "GET",
        params: {
          search,
          status,
          role,
          page,
          limit,
        },
      }),
      providesTags: (result) =>
        // is result available?
        result?.users
          ? // successful query
            [
              ...result.users.map(({ id }) => ({
                type: "User",
                id,
              })),
              { type: "User", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "User", id: "LIST" }],
    }),
    updateUserStatus: builder.mutation({
      query(data) {
        return {
          url: `/user/status/${data.id}`,
          method: "PUT",
          body: {
            status: data.status,
          },
        };
      },
      // Invalidates all queries that subscribe to this Post `id` only.
      // In this case, `getPost` will be re-run. `getPosts` *might*  rerun, if this id was under its results.
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),
    // createAuth: builder.mutation({
    //   query: (body) => ({
    //     url: "/auth",
    //     method: "POST",
    //     body,
    //   }),
    //   invalidatesTags: [{ type: "authUsers", id: "LIST" }],
    // }),
    // updateAuth: builder.mutation({
    //   query({ id, data }) {
    //     return {
    //       url: `/auth/${id}`,
    //       method: "PUT",
    //       body: data,
    //     };
    //   },
    //   // Invalidates all queries that subscribe to this Post `id` only.
    //   // In this case, `getPost` will be re-run. `getPosts` *might*  rerun, if this id was under its results.
    //   invalidatesTags: (result, error, { id }) => [{ type: "authUsers", id }],
    // }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAllUsersQuery, useUpdateUserStatusMutation } = userApi;
