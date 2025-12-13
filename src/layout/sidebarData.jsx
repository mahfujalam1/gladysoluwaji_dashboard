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
    label: "Appointment Status",
    path: "/appointments",
    icon: <LuCalendarDays />,
  },
  {
    label: "New Doctor Request",
    path: "/doctor-requests",
    icon: <LuUserPlus />,
  },
  {
    label: "Doctor Management",
    path: "/doctors",
    icon: <FaUserDoctor />,
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
  // {
  //   label: "Subscription Plan",
  //   path: "/subscription",
  //   icon: <LuFileText />,
  // },
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

