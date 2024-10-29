// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const vehicleConditionApi = createApi({
  reducerPath: "vehicleConditionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
  }),
  tagTypes: ["Condition"],
  endpoints: (builder) => ({
    getVehicleConditions: builder.query({
      query: () => ({
        url: "/vehicle-condition",
        method: "GET",
      }),
      providesTags: (result) =>
        // is result available?
        result?.conditions
          ? // successful query
            [
              ...result.conditions.map(({ id }) => ({
                type: "Condition",
                id,
              })),
              { type: "Condition", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "Condition", id: "LIST" }],
    }),
    createVehicleCondition: builder.mutation({
      query: (body) => ({
        url: "/vehicle-condition",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Condition", id: "LIST" }],
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
    //   invalidatesTags: (result, error, { id }) => [{ type: "Condition", id }],
    // }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetVehicleConditionsQuery,
  useCreateVehicleConditionMutation,
} = vehicleConditionApi;
