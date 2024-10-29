// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const roleApi = createApi({
  reducerPath: "roleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
  }),
  tagTypes: ["Roles"],
  endpoints: (builder) => ({
    getRoles: builder.query({
      query: () => ({
        url: "/role",
        method: "GET",
      }),
      providesTags: (result) =>
        // is result available?
        result?.roles
          ? // successful query
            [
              ...result.roles.map(({ id }) => ({
                type: "Roles",
                id,
              })),
              { type: "Roles", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "Roles", id: "LIST" }],
    }),
    createRole: builder.mutation({
      query: (body) => ({
        url: "/role",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Roles", id: "LIST" }],
    }),
    updateRole: builder.mutation({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `/role/${id}`,
          method: "PUT",
          body,
        };
      },
      // Invalidates all queries that subscribe to this Post `id` only.
      // In this case, `getPost` will be re-run. `getPosts` *might*  rerun, if this id was under its results.
      invalidatesTags: (result, error, { id }) => [{ type: "Roles", id }],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
} = roleApi;
