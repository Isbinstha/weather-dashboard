// import { Link, useLocation } from "react-router-dom";
// import { SidebarProvider, 
//   SidebarMenuItem,
//   SidebarMenuButton,
//   SidebarMenu, 
//   SidebarHeader,
//   SidebarGroupContent,
//   SidebarGroup,
//   SidebarContent } from "./ui/sidebar"; // use correct path

// // Placeholder icons
// const HomeIcon = () => <span className="inline-block w-4 h-4">🏠</span>;
// const DatabaseIcon = () => <span className="inline-block w-4 h-4">📊</span>;
// const CloudIcon = () => <span className="inline-block w-6 h-6 text-blue-600">☁️</span>;

// const menuItems = [
//   {
//     title: "Home",
//     icon: HomeIcon,
//     id: "home",
//     path: "/"
//   },
//   {
//     title: "Data",
//     icon: DatabaseIcon,
//     id: "data",
//     path: "/data"
//   },
// ];

// export function Sidebar() {
//   const location = useLocation();

//   return (
//     <SidebarProvider>
//       <aside className="glass-blue border-blue-200 shadow-lg min-h-screen w-64">
//         <SidebarHeader className="border-b border-blue-200">
//           <div className="flex items-center gap-2 px-4 py-2">
//             <CloudIcon />
//             <span className="font-semibold text-lg text-blue-900">Weather Dashboard</span>
//           </div>
//         </SidebarHeader>
//         <SidebarContent>
//           <SidebarGroup>
//             <SidebarGroupContent>
//               <SidebarMenu>
//                 {menuItems.map((item) => (
//                   <SidebarMenuItem key={item.id}>
//                     <Link to={item.path} style={{ textDecoration: 'none' }}>
//                       <SidebarMenuButton
//                         isActive={location.pathname === item.path || (item.path === "/" && location.pathname === "")}
//                       >
//                         <item.icon />
//                         <span>{item.title}</span>
//                       </SidebarMenuButton>
//                     </Link>
//                   </SidebarMenuItem>
//                 ))}
//               </SidebarMenu>
//             </SidebarGroupContent>
//           </SidebarGroup>
//         </SidebarContent>
//       </aside>
//     </SidebarProvider>
//   );
// }
// export default Sidebar;

import { Link, useLocation } from "react-router-dom";
import { Home, Database, Cloud } from "lucide-react"
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar"


const menuItems = [
  {
    title: "Home",
    icon: Home,
    id: "home",
    path:"/"
  },
  {
    title: "Data",
    icon: Database,
    id: "data",
    path:"/data"
  },
]

export function Sidebar() {
  const location = useLocation();
  return (
    <SidebarPrimitive className="glass-blue border-blue-200 shadow-lg">
      <SidebarHeader className="border-b border-blue-200">
        <div className="flex items-center gap-2 px-4 py-2">
          <Cloud className="h-6 w-6 text-blue-600" />
          <span className="font-semibold text-lg text-blue-900">Weather Dashboard</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
          <SidebarMenu>
               {menuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                     <Link to={item.path} style={{ textDecoration: 'none' }}>
                       <SidebarMenuButton
                         isActive={location.pathname === item.path || (item.path === "/" && location.pathname === "")}
                       >
                         <item.icon />
                         <span>{item.title}</span>
                       </SidebarMenuButton>
                     </Link>
                   </SidebarMenuItem>
                 ))}
               </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarPrimitive>
  )
}
export default Sidebar;