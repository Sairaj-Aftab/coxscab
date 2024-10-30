// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const chartApi = createApi({
  reducerPath: "chartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
  }),
  tagTypes: ["Chart"],
  endpoints: (builder) => ({
    getCharts: builder.query({
      query: () => ({
        url: "/chart",
        method: "GET",
      }),
      transformResponse: (response) => ({
        vehicleTypeCounts: response.vehicleTypeCounts,
        vehicleConditionCounts: response.vehicleConditionCounts,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.vehicleTypeCounts.map(({ type }) => ({
                type: "Chart",
                id: type,
              })),
              ...result.vehicleConditionCounts.map(({ condition }) => ({
                type: "Chart",
                id: condition,
              })),
              { type: "Chart", id: "LIST" },
            ]
          : [{ type: "Chart", id: "LIST" }],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetChartsQuery } = chartApi;