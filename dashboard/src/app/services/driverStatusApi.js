// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const driverStatusApi = createApi({
  reducerPath: "driverStatusApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
  }),
  tagTypes: ["Status"],
  endpoints: (builder) => ({
    getDriverStatus: builder.query({
      query: () => ({
        url: "/driver-status",
        method: "GET",
      }),
      providesTags: (result) =>
        // is result available?
        result?.status
          ? // successful query
            [
              ...result.status.map(({ id }) => ({
                type: "Status",
                id,
              })),
              { type: "Status", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "Status", id: "LIST" }],
    }),
    createDriverStatus: builder.mutation({
      query: (body) => ({
        url: "/driver-status",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Status", id: "LIST" }],
    }),
    // updateRole: builder.mutation({
    //   query(data) {
    //     const { id, ...body } = data;
    //     return {
    //       url: `/vehicle-type/${id}`,
    //       method: "PUT",
    //       body,
    //     };
    //   },
    //   // Invalidates all queries that subscribe to this Post `id` only.
    //   // In this case, `getPost` will be re-run. `getPosts` *might*  rerun, if this id was under its results.
    //   invalidatesTags: (result, error, { id }) => [{ type: "Type", id }],
    // }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetDriverStatusQuery, useCreateDriverStatusMutation } =
  driverStatusApi;
