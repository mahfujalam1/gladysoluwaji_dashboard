import { api } from "../api";

export const contactSupportApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getContactSupport: builder.query({
            query: () => '/api/contact',
            providesTags: ['ContactSupport'],
        }),
        getContactSupportById: builder.query({
            query: (id) => `/api/contact/${id}`,
            providesTags: ['ContactSupport'],
        }),
        deleteContactSupport: builder.mutation({
            query: (id) => ({
                url: `/api/contact/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['ContactSupport'],
        }),
    }),
});

export const { useGetContactSupportQuery, useGetContactSupportByIdQuery, useDeleteContactSupportMutation } = contactSupportApi;