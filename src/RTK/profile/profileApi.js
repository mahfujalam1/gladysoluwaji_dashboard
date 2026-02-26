import { api } from "../api";

export const profileApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getProfile: builder.query({
            query: () => '/api/users/me',
            providesTags: ['Profile'],
        }),
        updateProfile: builder.mutation({
            query: (data) => ({
                url: '/api/users/profile',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Profile'],
        }),
    }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi;