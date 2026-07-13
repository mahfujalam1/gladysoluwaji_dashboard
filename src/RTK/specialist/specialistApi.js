import { api } from '../api';

export const specialistApi = api.enhanceEndpoints({ addTagTypes: ['Specialist'] }).injectEndpoints({
    endpoints: (builder) => ({
        getSpecialists: builder.query({
            query: () => '/api/specialist',
            providesTags: ['Specialist'],
        }),
        addSpecialist: builder.mutation({
            query: (specialistData) => ({
                url: '/api/specialist',
                method: 'POST',
                body: specialistData,
            }),
            invalidatesTags: ['Specialist'],
        }),
        updateSpecialist: builder.mutation({
            query: ({ id, data }) => ({
                url: `/api/specialist/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Specialist'],
        }),
        deleteSpecialist: builder.mutation({
            query: (id) => ({
                url: `/api/specialist/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Specialist'],
        }),
    }),
});

export const {
    useGetSpecialistsQuery,
    useAddSpecialistMutation,
    useUpdateSpecialistMutation,
    useDeleteSpecialistMutation
} = specialistApi;
