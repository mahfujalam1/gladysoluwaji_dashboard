import { FaHospitalUser, FaUserDoctor } from "react-icons/fa6";
import {
  LuLayoutDashboard,
  LuCalendarDays,
  LuUserPlus,
  LuUserCog,
  LuHeartPulse,
  LuFileText,
  LuSettings,
  LuLifeBuoy,
  LuShield,
} from "react-icons/lu";

export const sidebarLinks = [
  {
    label: "Dashboard",
    path: "/",
    icon: <LuLayoutDashboard />,
  },
  {
    label: "Appointments",
    path: "/appointments",
    icon: <LuCalendarDays />,
    activePaths: ["/fund-transfer", "/fund-return"],
  },
  {
    label: "New Doctor Request",
    path: "/doctor-requests",
    icon: <LuUserPlus />,
    activePaths: ["/doctor-requests-details"],
  },
  {
    label: "Doctor Management",
    path: "/doctors",
    icon: <FaUserDoctor />,
    activePaths: ["/doctor-appointment-list"],
  },
  {
    label: "Patient Management",
    path: "/patients",
    icon: <FaHospitalUser />,
  },
  {
    label: "Admin Management",
    path: "/admins",
    icon: <LuUserCog />,
  },
  {
    label: "Daily Wellness Tips",
    path: "/wellness-tips",
    icon: <LuHeartPulse />,
  },
  {
    label: "Audit Log",
    path: "/audit-log",
    icon: <LuFileText />,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: <LuSettings/>,
    children: [
      {
        label: "Support & Help",
        path: "/support",
        icon: <LuLifeBuoy />,
      },
      {
        label: "Terms & Conditions",
        path: "/terms",
        icon: <LuFileText />,
      },
      {
        label: "Privacy & Policy",
        path: "/privacy",
        icon: <LuShield />,
      },
    ],
  },
];

