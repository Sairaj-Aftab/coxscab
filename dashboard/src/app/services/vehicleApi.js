// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const vehicleApi = createApi({
  reducerPath: "vehicleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
  }),
  tagTypes: ["Vehicles"],
  endpoints: (builder) => ({
    getVehicles: builder.query({
      query: ({ typeId, search, page = 1, limit = 10 }) => ({
        url: "/vehicle",
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
        result?.roles
          ? // successful query
            [
              ...result.roles.map(({ id }) => ({
                type: "Vehicles",
                id,
              })),
              { type: "Vehicles", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "Vehicles", id: "LIST" }],
    }),
    createVehicle: builder.mutation({
      query: (body) => ({
        url: "/vehicle",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Vehicles", id: "LIST" }],
    }),
    getVehicle: builder.query({
      query: (id) => `/vehicle/getsingle/${id}`,
      providesTags: (result, error, id) => [{ type: "Vehicles", id }],
    }),
    updateVehicle: builder.mutation({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `/vehicle/${id}`,
          method: "PUT",
          body,
        };
      },
      // Invalidates all queries that subscribe to this Post `id` only.
      // In this case, `getPost` will be re-run. `getPosts` *might*  rerun, if this id was under its results.
      invalidatesTags: (result, error, { id }) => [
        { type: "Vehicles", id },
        { type: "Vehicles", id: "LIST" },
      ],
    }),
    deleteVehicle: builder.mutation({
      query(id) {
        return {
          url: `/vehicle/delete/${id}`,
          method: "DELETE",
        };
      },
      // Invalidates all queries that subscribe to this Post `id` only.
      invalidatesTags: (result, error, id) => [
        { type: "Vehicles", id },
        { type: "Vehicles", id: "LIST" },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetVehiclesQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useGetVehicleQuery,
  useDeleteVehicleMutation,
} = vehicleApi;
