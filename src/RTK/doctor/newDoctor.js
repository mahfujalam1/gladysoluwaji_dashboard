import { api } from "../api";

const newDoctor = api.injectEndpoints({
    endpoints: (builder) => ({
        getNewDoctors: builder.query({
            query: (params) => ({
                url: '/api/doctors/admin/new-doctors',
                method: 'GET',
                params: params,
            }),
            providesTags: ['NewDoctors']
        }),
        approveDoctor: builder.mutation({
            query: (id) => ({
                url: `/api/doctors/${id}/status`,
                method: 'PATCH',
                body: { status: 'VERIFIED', note: 'Your request has been approved' }
            }),
            invalidatesTags: ['NewDoctors']
        }),
        rejectDoctor: builder.mutation({
            query: ({ id, note }) => ({
                url: `/api/doctors/${id}/status`,
                method: 'PATCH',
                body: { status: 'REJECTED', note: note }
            }),
            invalidatesTags: ['NewDoctors']
        })
    })
})

export const { useGetNewDoctorsQuery, useApproveDoctorMutation, useRejectDoctorMutation } = newDoctor;