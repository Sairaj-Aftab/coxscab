// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const driverActivitiesApi = createApi({
  reducerPath: "driverActivitiesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
  }),
  tagTypes: ["Activities"],
  endpoints: (builder) => ({
    getDriverActivities: builder.query({
      query: () => ({
        url: "/driver-activities",
        method: "GET",
      }),
      providesTags: (result) =>
        // is result available?
        result?.activities
          ? // successful query
            [
              ...result.activities.map(({ id }) => ({
                type: "Activities",
                id,
              })),
              { type: "Activities", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "Activities", id: "LIST" }],
    }),
    createDriverActivities: builder.mutation({
      query: (body) => ({
        url: "/driver-activities",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Activities", id: "LIST" }],
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
export const {
  useGetDriverActivitiesQuery,
  useCreateDriverActivitiesMutation,
} = driverActivitiesApi;
