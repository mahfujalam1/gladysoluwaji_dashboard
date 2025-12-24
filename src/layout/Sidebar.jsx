import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { sidebarLinks } from "./sidebarData";
import "./Sidebar.css";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

const Sidebar = () => {
  const { pathname } = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(() => {
    const savedState = localStorage.getItem('settingsOpen');
    return savedState === 'true';
  });

  useEffect(() => {
    localStorage.setItem('settingsOpen', settingsOpen);
  }, [settingsOpen]);

  const handleSettingsClick = (e, link) => {
    if (link.label === "Settings") {
      e.preventDefault();
      setSettingsOpen((prev) => !prev);
    }
  };

  return (
    <div className="p-4 pr-0">
      <div className="sidebar rounded-xl shadow-xs p-6">

        {/* LOGO */}
        <div className="pb-6">
          <h1 className="font-bold text-2xl text-center text-[#006C93]">WeCure Health</h1>
        </div>

        {/* MENU */}
        <div className="sidebar-menu">
          <ul className="nav-links">
            {sidebarLinks.map((link) => {
              const isActive =
                pathname === link.path ||
                (link.activePaths && link.activePaths.includes(pathname));

              return (
                <li
                  key={link.label}
                  className={`${isActive ? "active" : ""} ${link.label === "Settings" ? "settings" : ""
                    }`}
                >
                  <Link
                    to={link.path}
                    onClick={(e) => handleSettingsClick(e, link)}
                    className="flex items-center justify-between w-full"
                  >
                    <div className="flex items-center space-x-3">
                      {link.icon}
                      <span>{link.label}</span>
                    </div>

                    {link.children &&
                      link.label === "Settings" &&
                      (settingsOpen ? (
                        <LuChevronUp />
                      ) : (
                        <LuChevronDown />
                      ))}
                  </Link>

                  {/* SETTINGS SUBMENU */}
                  {link.children &&
                    link.label === "Settings" &&
                    settingsOpen && (
                      <ul className="sub-menu">
                        {link.children.map((subLink) => (
                          <li
                            key={subLink.label}
                            className={pathname === subLink.path ? "active" : ""}
                          >
                            <Link to={subLink.path}>
                              {subLink.icon}
                              <span>{subLink.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
