// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const authUsersApi = createApi({
  reducerPath: "authUsersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
  }),
  tagTypes: ["authUsers"],
  endpoints: (builder) => ({
    getAuthUsers: builder.query({
      query: () => ({
        url: "/auth",
        method: "GET",
      }),
      providesTags: (result) =>
        // is result available?
        result?.users
          ? // successful query
            [
              ...result.users.map(({ id }) => ({
                type: "authUsers",
                id,
              })),
              { type: "authUsers", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "authUsers", id: "LIST" }],
    }),
    createAuth: builder.mutation({
      query: (body) => ({
        url: "/auth",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "authUsers", id: "LIST" }],
    }),
    updateAuth: builder.mutation({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `/auth/${id}`,
          method: "PUT",
          body,
        };
      },
      // Invalidates all queries that subscribe to this Post `id` only.
      // In this case, `getPost` will be re-run. `getPosts` *might*  rerun, if this id was under its results.
      invalidatesTags: (result, error, { id }) => [{ type: "authUsers", id }],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAuthUsersQuery,
  useCreateAuthMutation,
  useUpdateAuthMutation,
} = authUsersApi;
