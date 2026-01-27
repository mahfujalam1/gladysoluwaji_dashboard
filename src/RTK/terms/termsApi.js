import { api } from '../api';

const termsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTerms: builder.query({
      query: () => '/api/legal-content/terms-and-conditions',
    }),
    updateTerms: builder.mutation({
      query: (data) => ({
        url: '/api/legal-content',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Terms'],
    }),
  }),
});

export const { useGetTermsQuery, useUpdateTermsMutation } = termsApi;
