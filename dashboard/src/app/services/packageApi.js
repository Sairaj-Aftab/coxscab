// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const packageApi = createApi({
  reducerPath: "packageApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
  }),
  tagTypes: ["Package"],
  endpoints: (builder) => ({
    getPackages: builder.query({
      query: ({ search, page = 1, limit = 10 }) => ({
        url: "/package/get-all",
        method: "GET",
        params: {
          search,
          page,
          limit,
        },
      }),
      providesTags: (result) =>
        // is result available?
        result?.packages
          ? // successful query
            [
              ...result.packages.map(({ id }) => ({
                type: "Package",
                id,
              })),
              { type: "Package", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "Package", id: "LIST" }],
    }),
    createPackage: builder.mutation({
      query: (body) => ({
        url: "/package",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Package", id: "LIST" }],
    }),
    updatePackage: builder.mutation({
      query(data) {
        const { id, formData } = data;

        return {
          url: `/package/${id}`,
          method: "PUT",
          body: formData,
        };
      },
      // Invalidates all queries that subscribe to this Post `id` only.
      // In this case, `getPost` will be re-run. `getPosts` *might*  rerun, if this id was under its results.
      invalidatesTags: (result, error, { id }) => [
        { type: "Package", id },
        { type: "Package", id: "LIST" },
      ],
    }),
    deletePackage: builder.mutation({
      query(id) {
        return {
          url: `/package/delete/${id}`,
          method: "DELETE",
        };
      },
      // Invalidates all queries that subscribe to this Post `id` only.
      invalidatesTags: (result, error, id) => [
        { type: "Package", id },
        { type: "Package", id: "LIST" },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetPackagesQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} = packageApi;
