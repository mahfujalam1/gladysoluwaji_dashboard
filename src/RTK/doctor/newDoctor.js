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
        getDoctorReviewDetails: builder.query({
            query: (id) => ({
                url: `/api/doctors/admin/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Doctors', id }, 'Doctors', 'NewDoctors']
        }),
        updateDoctorStatus: builder.mutation({
            query: ({ id, status, note }) => ({
                url: `/api/doctors/${id}/status`,
                method: 'PATCH',
                body: { status, note }
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Doctors', id },
                'NewDoctors',
                'Doctors'
            ]
        }),
        approveDoctor: builder.mutation({
            query: (payload) => {
                const id = typeof payload === 'object' ? payload.id : payload;
                const note = (typeof payload === 'object' && payload.note) 
                    ? payload.note 
                    : 'MDCN registration and current practising licence reviewed.';
                return {
                    url: `/api/doctors/${id}/status`,
                    method: 'PATCH',
                    body: { status: 'VERIFIED', note }
                };
            },
            invalidatesTags: (result, error, payload) => {
                const id = typeof payload === 'object' ? payload.id : payload;
                return [{ type: 'Doctors', id }, 'NewDoctors', 'Doctors'];
            }
        }),
        rejectDoctor: builder.mutation({
            query: ({ id, note }) => ({
                url: `/api/doctors/${id}/status`,
                method: 'PATCH',
                body: { status: 'REJECTED', note }
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Doctors', id },
                'NewDoctors',
                'Doctors'
            ]
        }),
        suspendDoctor: builder.mutation({
            query: ({ id, note }) => ({
                url: `/api/doctors/${id}/status`,
                method: 'PATCH',
                body: { status: 'SUSPENDED', note }
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Doctors', id },
                'NewDoctors',
                'Doctors'
            ]
        }),
        returnDoctorToPending: builder.mutation({
            query: ({ id, note = 'Awaiting updated licence documents.' }) => ({
                url: `/api/doctors/${id}/status`,
                method: 'PATCH',
                body: { status: 'PENDING', note }
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Doctors', id },
                'NewDoctors',
                'Doctors'
            ]
        }),
    })
});

export const {
    useGetNewDoctorsQuery,
    useGetDoctorReviewDetailsQuery,
    useUpdateDoctorStatusMutation,
    useApproveDoctorMutation,
    useRejectDoctorMutation,
    useSuspendDoctorMutation,
    useReturnDoctorToPendingMutation
} = newDoctor;