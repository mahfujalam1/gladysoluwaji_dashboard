import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import DashboardPage from '../pages/dashboard/DashboardPage';
import AppointmentsPage from '../pages/appointment/AppointmentsPage';
import FundTransfer from '../pages/appointment/FundTransfer';
import FundReturn from '../pages/appointment/FundReturn';
import DoctorRequestDetails from '../pages/new-doctor-req/DoctorRequestDetails';
import DoctorRequestsPage from '../pages/new-doctor-req/DoctorRequestsPage';
import DoctorsPage from '../pages/doctor-manage/DoctorsPage';
import PatientsPage from '../pages/patient-manage/PatientsPage';
import AdminsPage from '../pages/admin/AdminsPage';
import WellnessTipsPage from '../pages/wellness-tips/WellnessTipsPage';
import SpecialtiesPage from '../pages/specialties/SpecialtiesPage';
// import SubscriptionPage from '../pages/subscription/SubscriptionPage';
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
import ProtectedRoute from './ProtectedRoute';
import DoctorAllAppointments from '../pages/doctor-manage/DoctorAllAppointments';
import AuditLog from '../pages/audit/AuditLog';
import PublicTermsPage from '../pages/public/PublicTermsPage';
import PublicPrivacyPage from '../pages/public/PublicPrivacyPage';
import PublicContactPage from '../pages/public/PublicContactPage';

const router = createBrowserRouter([
  // Public Routes (Accessible without login)
  {
    path: '/terms',
    element: <PublicTermsPage />,
  },
  {
    path: '/terms-and-conditions',
    element: <PublicTermsPage />,
  },
  {
    path: '/privacy',
    element: <PublicPrivacyPage />,
  },
  {
    path: '/privacy-policy',
    element: <PublicPrivacyPage />,
  },
  {
    path: '/contact',
    element: <PublicContactPage />,
  },
  {
    path: '/contact-us',
    element: <PublicContactPage />,
  },
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
    element: <ProtectedRoute><App /></ProtectedRoute>,
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
        path: '/fund-transfer',
        element: <FundTransfer />,
      },
      {
        path: '/fund-return',
        element: <FundReturn />,
      },
      {
        path: '/doctor-requests-details',
        element: <DoctorRequestDetails />,
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
        path: '/specialties',
        element: <SpecialtiesPage />,
      },
      {
        path: '/audit-log',
        element: <AuditLog />,
      },
      {
        path: '/support',
        element: <SupportPage />,
      },
      {
        path: '/settings/terms',
        element: <TermsPage />,
      },
      {
        path: '/terms/edit',
        element: <TermsPage />,
      },
      {
        path: '/settings/privacy',
        element: <PrivacyPage />,
      },
      {
        path: '/privacy/edit',
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

