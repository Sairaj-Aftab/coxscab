// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const driverApi = createApi({
  reducerPath: "driverApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
  }),
  tagTypes: ["Drivers"],
  endpoints: (builder) => ({
    getDrivers: builder.query({
      query: ({ typeId, search, page = 1, limit = 10 }) => ({
        url: "/driver",
        method: "GET",
        params: {
          typeId,
          search,
          page,
          limit,
        },
      }),
      providesTags: (result) =>
        // is result available?
        result?.drivers
          ? // successful query
            [
              ...result.drivers.map(({ id }) => ({
                type: "Drivers",
                id,
              })),
              { type: "Drivers", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "Drivers", id: "LIST" }],
    }),
    createDriver: builder.mutation({
      query: (body) => ({
        url: "/driver",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Drivers", id: "LIST" }],
    }),
    updateDriver: builder.mutation({
      query(data) {
        const { id, formData } = data;
        console.log(formData);

        return {
          url: `/driver/${id}`,
          method: "PUT",
          body: formData,
        };
      },
      // Invalidates all queries that subscribe to this Post `id` only.
      // In this case, `getPost` will be re-run. `getPosts` *might*  rerun, if this id was under its results.
      invalidatesTags: (result, error, { id }) => [
        { type: "Drivers", id },
        { type: "Drivers", id: "LIST" },
      ],
    }),
    deleteDriver: builder.mutation({
      query(id) {
        return {
          url: `/driver/delete/${id}`,
          method: "DELETE",
        };
      },
      // Invalidates all queries that subscribe to this Post `id` only.
      invalidatesTags: (result, error, id) => [
        { type: "Drivers", id },
        { type: "Drivers", id: "LIST" },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetDriversQuery,
  useCreateDriverMutation,
  useUpdateDriverMutation,
  useDeleteDriverMutation,
} = driverApi;
