import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import DashboardPage from '../pages/dashboard/DashboardPage';
import AppointmentsPage from '../pages/appointment/AppointmentsPage';
import DoctorRequestsPage from '../pages/new-doctor-req/DoctorRequestsPage';
import DoctorsPage from '../pages/doctor-manage/DoctorsPage';
import PatientsPage from '../pages/patient-manage/PatientsPage';
import AdminsPage from '../pages/admin/AdminsPage';
import WellnessTipsPage from '../pages/wellness-tips/WellnessTipsPage';
import SubscriptionPage from '../pages/subscription/SubscriptionPage';
import SupportPage from '../pages/setting/SupportPage';
import TermsPage from '../pages/setting/TermsPage';
import PrivacyPage from '../pages/setting/PrivacyPage';
import ProfilePage from '../pages/profile/ProfilePage';
import ChangePasswordPage from '../pages/profile/ChangePassword';
import EditProfile from '../pages/profile/EditProfile';
import LoginPage from '../pages/auth/LoginPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import OtpPage from '../pages/auth/OtpPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import DoctorAllAppointments from '../pages/doctor-manage/DoctorAllAppointments';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/otp',
    element: <OtpPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <DashboardPage />,
      },
     {
        path: '/appointments',
        element: <AppointmentsPage />,
      },
      {
        path: '/doctor-requests',
        element: <DoctorRequestsPage />,
      },
      {
        path: '/doctors',
        element: <DoctorsPage />,
      },
      {
        path: '/doctor-appointment-list',
        element: <DoctorAllAppointments />,
      },
      {
        path: '/patients',
        element: <PatientsPage />,
      },
      {
        path: '/admins',
        element: <AdminsPage />,
      },
      {
        path: '/wellness-tips',
        element: <WellnessTipsPage />,
      },
      {
        path: '/subscription',
        element: <SubscriptionPage />,
      },
      {
        path: '/support',
        element: <SupportPage />,
      },
      {
        path: '/terms',
        element: <TermsPage />,
      },
      {
        path: '/privacy',
        element: <PrivacyPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/change-password',
        element: <ChangePasswordPage />,
      },
      {
        path: '/edit-profile',
        element: <EditProfile />,
      }
    ],
  },
]);

export default router;

