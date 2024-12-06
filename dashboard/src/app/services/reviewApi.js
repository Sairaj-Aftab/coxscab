// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
  }),
  tagTypes: ["Review"],
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: ({ search, status, typeFilter, page = 1, limit = 10 }) => ({
        url: "/review/all",
        method: "GET",
        params: {
          search,
          status,
          typeFilter,
          page,
          limit,
        },
      }),
      providesTags: (result) =>
        // is result available?
        result?.reviews
          ? // successful query
            [
              ...result.reviews.map(({ id }) => ({
                type: "Review",
                id,
              })),
              { type: "Review", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "Review", id: "LIST" }],
    }),
    updateReviewStatus: builder.mutation({
      query(data) {
        return {
          url: `/review/status/${data.id}`,
          method: "PUT",
          body: {
            status: data.status,
          },
        };
      },
      // Invalidates all queries that subscribe to this Post `id` only.
      // In this case, `getPost` will be re-run. `getPosts` *might*  rerun, if this id was under its results.
      invalidatesTags: (result, error, { id }) => [
        { type: "Review", id },
        { type: "Review", id: "LIST" },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetReviewsQuery, useUpdateReviewStatusMutation } = reviewApi;
