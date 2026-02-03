import { api } from '../api';

const auditApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAuditLogs: builder.query({
            query: (params) => ({
                url: '/api/admin/audit-logs',
                method: 'GET',
                params: params,
            }),
            providesTags: ['AuditLogs'],
        }),
    }),
    tagTypes: ['AuditLogs'],
});

export const { useGetAuditLogsQuery } = auditApi;
