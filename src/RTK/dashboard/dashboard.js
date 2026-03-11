import { api } from "../api";

const dashboardApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getDashboard: builder.query({
            query: () => '/api/admin/dashboard',
            providesTags: ['Dashboard'],
        }),
    }),
    tagTypes: ['Dashboard'],
});

export const { useGetDashboardQuery } = dashboardApi;