import { api } from "../api";

const wellnessApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getWellness: builder.query({
            query: () => '/api/wellness-tips',
            providesTags: ['Wellness'],
        }),
        addWellness: builder.mutation({
            query: (data) => ({
                url: '/api/wellness-tips',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Wellness'],
        }),
        updateWellness: builder.mutation({
            query: ({ id, data }) => ({
                url: `/api/wellness-tips/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Wellness'],
        }),
        deleteWellness: builder.mutation({
            query: (id) => ({
                url: `/api/wellness-tips/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Wellness'],
        }),
    }),
});

export const { useGetWellnessQuery, useAddWellnessMutation, useUpdateWellnessMutation, useDeleteWellnessMutation } = wellnessApi;