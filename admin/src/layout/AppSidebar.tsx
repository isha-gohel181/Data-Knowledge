import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

// Assume these icons are imported from an icon library
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  TableIcon,
  UserCircleIcon,
  VideoIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { Tag, UserCircle2Icon, Bell, MessageCircle, Bot, Instagram, Trophy } from "lucide-react";

type NavSubItem = {
  name: string;
  path: string;
  pro?: boolean;
  new?: boolean;
  subItems?: NavSubItem[];
};

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: NavSubItem[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <ListIcon />,
    name: "Courses",
    path: "/courses/all/courses",
  },
  {
    icon: <BoxCubeIcon />,
    name: "Categories",
    path: "/categories",
  },
  {
    icon: <PageIcon />,
    name: "Banner",
    path: "/banner",
  },
  {
    icon: <CalenderIcon />,
    name: "Events",
    path: "/events",
  },
  {
    icon: <UserCircleIcon />,
    name: "Jobs",
    path: "/jobs",
  },
  {
    icon: <PageIcon />,
    name: "News",
    path: "/news",
  },
  {
    icon: <PageIcon />,
    name: "Forums",
    path: "/forum",
  },
  {
    icon: <UserCircleIcon />,
    name: "Students",
    path: "/students/all",
  },
  {
    icon: <UserCircleIcon />,
    name: "Add Reporter",
    path: "/reporters/add",
  },
  {
    icon: <TableIcon />,
    name: "Assignment Submissions",
    path: "/assignments/submissions",
  },
  {
    icon: <UserCircle2Icon />,
    name: "Student Queries",
    path: "/queries/all",
  },
  {
    icon: <TableIcon />,
    name: "Support Requests",
    path: "/requests",
  },
  {
    icon: <CalenderIcon />,
    name: "Consultations",
    subItems: [
      { name: "Manage Slots", path: "/consultations/slots" },
      { name: "Bookings", path: "/consultations/bookings" },
    ],
  },
  {
    icon: <MessageCircle />,
    name: "Chat",
    path: "/chat",
  },
  {
    icon: <Tag />,
    name: "Coupons",
    path: "/coupons/all",
  },
  {
    icon: <TableIcon />,
    name: "Device Approvals",
    path: "/device-approvals",
  },
  {
    icon: <MessageCircle />,
    name: "Testimonials",
    path: "/testimonials",
  },
  {
    icon: <Instagram />,
    name: "Placement Stories",
    path: "/placement-stories",
  },
  {
    icon: <Trophy className="w-5 h-5" />,
    name: "Proven Results",
    path: "/proven-results",
  },
  {
    icon: <Bot />,
    name: "AI Tool",
    path: "/ai-tool",
  },
  {
    icon: <PieChartIcon />,
    name: "Leaderboard Settings",
    path: "/leaderboard-setting",
  },
  {
    icon: <PageIcon />,
    name: "Security",
    subItems: [
      { name: "Incidents", path: "/security/incidents" },
    ],
  },
  {
    icon: <TableIcon />,
    name: "Sales Analytics",
    subItems: [
      { name: "User", path: "/sales/user" },
      { name: "Course", path: "/sales/course" },
      { name: "Bundle", path: "/sales/bundle" },
    ],
  },
  {
    icon: <Bell />,
    name: "Notifications",
    subItems: [
      { name: "Send Notifications", path: "/send-notification" },
      { name: "Notification History", path: "/notification-history" },
    ],
  },
  {
    icon: <PieChartIcon />,
    name: "Certifications",
    subItems: [
      {
        name: "All Templates",
        path: "/certificates-template/all",
      },
      { name: "Add Template", path: "/certificates-template/add" },
    ],
  },
  {
    icon: <VideoIcon />,
    name: "Live Classes",
    path: "/live-classes",
  },
];

const othersItems: NavItem[] = [];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [userRole] = useState<string | null>(() => {
    try {
      let role = localStorage.getItem("role");
      if (!role) {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          try {
            const parsed = JSON.parse(userStr);
            role = parsed?.role;
          } catch (e) {}
        }
      }
      return role ? String(role).trim() : null;
    } catch (e) {
      return null;
    }
  });

  const [openSubmenu, setOpenSubmenu] = useState<string[]>([]);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const hasActiveSubItem = useCallback(
    (subItems: NavSubItem[]): boolean => {
      return subItems.some((subItem) => {
        if (isActive(subItem.path)) return true;
        if (subItem.subItems) return hasActiveSubItem(subItem.subItems);
        return false;
      });
    },
    [isActive]
  );

  useEffect(() => {
    const activeMenus: string[] = [];

    const checkMenuItems = (items: NavItem[], prefix: string) => {
      items.forEach((nav, index) => {
        const menuKey = `${prefix}-${index}`;
        if (nav.subItems && hasActiveSubItem(nav.subItems)) {
          activeMenus.push(menuKey);

          nav.subItems.forEach((subItem, subIndex) => {
            const subMenuKey = `${menuKey}-${subIndex}`;
            if (subItem.subItems && hasActiveSubItem(subItem.subItems)) {
              activeMenus.push(subMenuKey);
            }
          });
        }
      });
    };

    checkMenuItems(navItems, "main");
    setOpenSubmenu(activeMenus);
  }, [location, hasActiveSubItem]);

  useEffect(() => {
    openSubmenu.forEach((key) => {
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    });
  }, [openSubmenu]);

  const handleSubmenuToggle = (menuKey: string) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (prevOpenSubmenu.includes(menuKey)) {
        return prevOpenSubmenu.filter((key) => key !== menuKey);
      }
      return [...prevOpenSubmenu, menuKey];
    });
  };

  const renderSubItems = (
    subItems: NavSubItem[],
    parentKey: string,
    level: number = 1
  ) => {
    return subItems.map((subItem, index) => {
      const subMenuKey = `${parentKey}-${index}`;
      const marginLeft = level === 1 ? "ml-9" : `ml-${9 + (level - 1) * 4}`;

      return (
        <li key={subItem.name}>
          {subItem.subItems ? (
            <>
              <button
                onClick={() => handleSubmenuToggle(subMenuKey)}
                className={`menu-dropdown-item cursor-pointer w-full text-left ${
                  openSubmenu.includes(subMenuKey) ||
                  hasActiveSubItem(subItem.subItems || [])
                    ? "menu-dropdown-item-active"
                    : "menu-dropdown-item-inactive"
                }`}
              >
                <span className="flex items-center justify-between gap-4 w-full">
                  <span>{subItem.name}</span>
                  <span className="flex items-center gap-1">
                    {subItem.new && (
                      <span className="menu-dropdown-badge menu-dropdown-badge-active">
                        new
                      </span>
                    )}
                    {subItem.pro && (
                      <span className="menu-dropdown-badge menu-dropdown-badge-active">
                        pro
                      </span>
                    )}
                    <ChevronDownIcon
                      className={`w-4 h-4 text-white/80 transition-transform duration-200 ${
                        openSubmenu.includes(subMenuKey) ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                </span>
              </button>
              <div
                ref={(el) => {
                  subMenuRefs.current[subMenuKey] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height: openSubmenu.includes(subMenuKey)
                    ? `${subMenuHeight[subMenuKey]}px`
                    : "0px",
                }}
              >
                <ul className={`mt-2 space-y-1 ${marginLeft}`}>
                  {renderSubItems(subItem.subItems, subMenuKey, level + 1)}
                </ul>
              </div>
            </>
          ) : (
            <Link
              to={subItem.path}
              className={`menu-dropdown-item ${
                isActive(subItem.path)
                  ? "menu-dropdown-item-active"
                  : "menu-dropdown-item-inactive"
              }`}
            >
              <span>{subItem.name}</span>
              <span className="flex items-center gap-1 ml-auto">
                {subItem.new && (
                  <span className="menu-dropdown-badge menu-dropdown-badge-active">
                    new
                  </span>
                )}
                {subItem.pro && (
                  <span className="menu-dropdown-badge menu-dropdown-badge-active">
                    pro
                  </span>
                )}
              </span>
            </Link>
          )}
        </li>
      );
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-2">
      {items.map((nav, index) => {
        const menuKey = `${menuType}-${index}`;

        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(menuKey)}
                className={`menu-item group ${
                  openSubmenu.includes(menuKey) ||
                  hasActiveSubItem(nav.subItems)
                    ? "menu-item-active"
                    : "menu-item-inactive"
                } cursor-pointer ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    openSubmenu.includes(menuKey) ||
                    hasActiveSubItem(nav.subItems)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text text-sm font-semibold truncate text-white">
                    {nav.name}
                  </span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`ml-auto w-4 h-4 text-white/80 transition-transform duration-200 ${
                      openSubmenu.includes(menuKey)
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  to={nav.path}
                  className={`menu-item group ${
                    isActive(nav.path)
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  }`}
                >
                  <span
                    className={`menu-item-icon-size ${
                      isActive(nav.path)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text text-sm font-semibold truncate text-white">
                      {nav.name}
                    </span>
                  )}
                </Link>
              )
            )}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[menuKey] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height: openSubmenu.includes(menuKey)
                    ? `${subMenuHeight[menuKey]}px`
                    : "0px",
                }}
              >
                <ul className="mt-1.5 space-y-1 ml-6 border-l border-white/20 pl-3">
                  {renderSubItems(nav.subItems, menuKey)}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  const filteredNavItems =
    userRole === "news_editor"
      ? navItems.filter((nav) => nav.name === "News")
      : navItems;

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-4 left-0 bg-gradient-to-b from-[#1b6294] via-[#16517a] to-[#103a58] text-white h-screen transition-all duration-300 ease-in-out z-50 border-r border-blue-900/40 shadow-2xl
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Brand Header with Large Logo */}
      <div
        className={`py-5 border-b border-white/15 mb-3 flex items-center ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/" className="flex items-center gap-3 group">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="h-12 w-12 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
                src="/images/logo/logo.png"
                alt="Data Knowledge"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-lg font-extrabold tracking-tight text-white leading-tight truncate">
                  Data Knowledge
                </span>
                <span className="text-[10px] font-bold text-cyan-200 tracking-wider uppercase font-mono">
                  Admin Console
                </span>
              </div>
            </>
          ) : (
            <img
              className="h-10 w-10 object-contain drop-shadow-md"
              src="/images/logo/logo.png"
              alt="Data Knowledge"
            />
          )}
        </Link>
      </div>

      {/* Navigation Scrollable Area */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar pb-8">
        <nav className="mb-6 space-y-4">
          <div>
            <h2
              className={`mb-3 text-[11px] font-bold uppercase tracking-wider text-white/60 font-mono flex items-center ${
                !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
              }`}
            >
              {isExpanded || isHovered || isMobileOpen ? (
                "Main Navigation"
              ) : (
                <HorizontaLDots className="size-5 text-white/60" />
              )}
            </h2>
            {renderMenuItems(filteredNavItems, "main")}
          </div>

          {userRole !== "news_editor" && othersItems.length > 0 && (
            <div>
              <h2
                className={`mb-3 text-[11px] font-bold uppercase tracking-wider text-white/60 font-mono flex items-center ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots className="size-5 text-white/60" />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
