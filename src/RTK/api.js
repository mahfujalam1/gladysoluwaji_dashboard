
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const BASE_URL = "https://api.wecurehealth.com";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error && result.error.status === 401) {
    const publicPaths = ['/login', '/terms', '/privacy', '/terms-and-conditions', '/privacy-policy', '/contact', '/contact-us', '/forgot-password', '/otp', '/reset-password'];
    const isPublic = publicPaths.some((p) => window.location.pathname.startsWith(p));
    if (!isPublic) {
      // Token expired or invalid
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
  }
  return result;
};

export const api = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  refetchOnFocus: false,
  refetchOnReconnect: false,
  tagTypes: ['Profile', 'Doctors', 'NewDoctors', 'DoctorAppointments', 'DoctorBookingDetails', 'Users', 'Specialists', 'WellnessTips', 'LegalContent', 'AuditLogs'],
  endpoints: (builder) => ({}),
});
