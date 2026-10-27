import { api } from "../api";

const doctorApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getDoctors: builder.query({
            query: (params) => ({
                url: '/api/doctors/admin/all',
                method: 'GET',
                params: params,
            }),
            providesTags: ['Doctors']
        }),
        getDoctorById: builder.query({
            query: (id) => ({
                url: `/api/doctors/admin/${id}`,
                method: 'GET',
            }),
            providesTags: ['Doctors']
        }),
        updateDoctorStatus: builder.mutation({
            query: ({ id, status, note }) => ({
                url: `/api/doctors/${id}/status`,
                method: 'PATCH',
                body: { status, note }
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Doctors', id },
                'Doctors',
                'NewDoctors'
            ]
        }),
        suspendDoctor: builder.mutation({
            query: ({ id, note }) => ({
                url: `/api/doctors/${id}/status`,
                method: 'PATCH',
                body: { status: 'SUSPENDED', note: note }
            }),
            invalidatesTags: ['Doctors', 'NewDoctors']
        }),
        unsuspendDoctor: builder.mutation({
            query: (id) => ({
                url: `/api/doctors/${id}/status`,
                method: 'PATCH',
                body: { status: 'VERIFIED', note: 'Your account has been unsuspended by admin.' }
            }),
            invalidatesTags: ['Doctors']
        }),
        getDoctorAppointments: builder.query({
            query: (id) => ({
                url: `/api/appointments/admin/doctor/${id}`,
                method: 'GET',
            }),
            providesTags: ['DoctorAppointments']
        }),
        getDoctorBookingDetailsById: builder.query({
            query: (id, params) => ({
                url: `/api/appointments/admin/details/${id}`,
                method: 'GET',
                params: params,
            }),
            providesTags: ['DoctorBookingDetails']
        }),
    })
})

export const { useGetDoctorsQuery,
    useGetDoctorByIdQuery,
    useUpdateDoctorStatusMutation,
    useSuspendDoctorMutation,
    useUnsuspendDoctorMutation,
    useGetDoctorAppointmentsQuery,
    useGetDoctorBookingDetailsByIdQuery } = doctorApi;