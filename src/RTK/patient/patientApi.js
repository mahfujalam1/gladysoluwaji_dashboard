import { api } from '../api'

const patientApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getPatients: builder.query({
            query: (params) => ({
                url: '/api/users?role=USER',
                method: 'GET',
                params: params,
            }),
            providesTags: ['Patient']
        }),
        getPatientById: builder.query({
            query: (id) => `/api/users/${id}`,
            providesTags: ['Patient']
        }),
        togglePatientStatus: builder.mutation({
            query: (id) => ({
                url: `/api/users/${id}/toggle-status`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Patient']
        }),
    }),
});

export const { useGetPatientsQuery, useGetPatientByIdQuery, useTogglePatientStatusMutation } = patientApi;