import { api } from '../api';

const privacyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPrivacy: builder.query({
      query: () => '/api/legal-content/privacy-policy',
    }),
    updatePrivacy: builder.mutation({
      query: (data) => ({
        url: '/api/legal-content',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Privacy'],
    }),
  }),
});

export const { useGetPrivacyQuery, useUpdatePrivacyMutation } = privacyApi;
