import { api } from "../api";

const appointmentsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAppointments: builder.query({
            query: (params) => ({
                url: `/api/appointments/admin/all`,
                method: 'GET',
                params: params,
            }),
            providesTags: ['Appointment']
        }),
        getAppointmentById: builder.query({
            query: (id , params) => ({
                url: `/api/appointments/admin/details/${id}`,
                method: 'GET',
                params: params,
            }),
            providesTags: ['Appointment']
        }),
    }),
});

export const { useGetAppointmentsQuery, useGetAppointmentByIdQuery } = appointmentsApi;