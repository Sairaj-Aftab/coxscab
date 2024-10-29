// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const garageApi = createApi({
  reducerPath: "garageApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
  }),
  tagTypes: ["Garage"],
  endpoints: (builder) => ({
    getGarages: builder.query({
      query: ({ search, page = 1, limit = 10 }) => ({
        url: "/garage",
        method: "GET",
        params: {
          search,
          page,
          limit,
        },
      }),
      providesTags: (result) =>
        // is result available?
        result?.garages
          ? // successful query
            [
              ...result.garages.map(({ id }) => ({
                type: "Garage",
                id,
              })),
              { type: "Garage", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "Garage", id: "LIST" }],
    }),
    createGarage: builder.mutation({
      query: (body) => ({
        url: "/garage",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Garage", id: "LIST" }],
    }),
    updateGarage: builder.mutation({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `/garage/${id}`,
          method: "PUT",
          body,
        };
      },
      // Invalidates all queries that subscribe to this Post `id` only.
      // In this case, `getPost` will be re-run. `getPosts` *might*  rerun, if this id was under its results.
      invalidatesTags: (result, error, { id }) => [
        { type: "Garage", id },
        { type: "Garage", id: "LIST" },
      ],
    }),
    deleteGarage: builder.mutation({
      query(id) {
        return {
          url: `/garage/delete/${id}`,
          method: "DELETE",
        };
      },
      // Invalidates all queries that subscribe to this Post `id` only.
      invalidatesTags: (result, error, id) => [
        { type: "Garage", id },
        { type: "Garage", id: "LIST" },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetGaragesQuery,
  useCreateGarageMutation,
  useUpdateGarageMutation,
  useDeleteGarageMutation,
} = garageApi;
