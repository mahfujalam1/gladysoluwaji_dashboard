import { api } from '../api';

const adminApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAdmins: builder.query({
            query: () => '/api/users?role=ADMIN',
            providesTags: ['Admins'],
        }),
        toggleAdminStatus: builder.mutation({
            query: (id) => ({
                url: `/api/users/${id}/toggle-status`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Admins'],
        }),
        addAdmin: builder.mutation({
            query: (adminData) => ({
                url: '/api/users/admin',
                method: 'POST',
                body: adminData,
            }),
            invalidatesTags: ['Admins'],
        }),
    }),
    tagTypes: ['Admins'],
});

export const { useGetAdminsQuery, useToggleAdminStatusMutation, useAddAdminMutation } = adminApi;
