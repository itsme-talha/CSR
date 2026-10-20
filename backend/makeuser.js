// "use client";

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import NotificationBell from './NotificationBell';

// interface DashboardNavbarProps {
//   userRole: string;
//   // Yeh function mobile sidebar open karne ke liye use hoga (Next step mein add karenge)
//   onMenuClick?: () => void; 
// }

// export default function DashboardNavbar({ userRole, onMenuClick }: DashboardNavbarProps) {
//   const router = useRouter();
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [userName, setUserName] = useState('User');

//   // Simple English: Check who is logged in
//   useEffect(() => {
//     // Agar humne localStorage mein name save kiya hai, toh wo utha lein
//     const storedName = localStorage.getItem('userName');
//     if (storedName) {
//       setUserName(storedName);
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear(); // Sab data clear karo
//     router.push('/login'); // Wapas login par bhejo
//   };

//   return (
//     <nav className="flex items-center justify-between w-full h-20 px-4 md:px-8 bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30 transition-all duration-300">
      
//       {/* LEFT SIDE: Mobile Menu Button & Title */}
//       <div className="flex items-center gap-4">
//         {/* Hamburger Icon for Mobile (Only shows on small screens) */}
//         <button 
//           onClick={onMenuClick}
//           className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
//           aria-label="Open Menu"
//         >
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//           </svg>
//         </button>

//         {/* Dashboard Title in Simple English */}
//         <div>
//           <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
//             Welcome Back!
//           </h1>
//           <p className="text-xs md:text-sm font-medium text-slate-500 capitalize">
//             {userRole.toLowerCase()} Panel
//           </p>
//         </div>
//       </div>
      
//       {/* RIGHT SIDE: Notifications & Profile */}
//       <div className="flex items-center gap-3 md:gap-6">
        
//         {/* Notification Bell */}
//         <div className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-50 transition-colors cursor-pointer">
//           <NotificationBell />
//         </div>

//         {/* Divider Line */}
//         <div className="hidden sm:block h-8 w-px bg-slate-200"></div>
        
//         {/* User Profile Dropdown */}
//         <div className="relative">
//           <button 
//             onClick={() => setIsProfileOpen(!isProfileOpen)}
//             className="flex items-center gap-3 focus:outline-none"
//           >
//             {/* User Info (Hidden on very small mobile screens) */}
//             <div className="hidden sm:block text-right">
//               <p className="text-sm font-bold text-slate-800 leading-none">{userName}</p>
//               <p className="text-xs text-brand-action mt-1 font-medium capitalize">{userRole.toLowerCase()}</p>
//             </div>
            
//             {/* Avatar Circle */}
//             <div className="w-10 h-10 rounded-full bg-brand-light text-brand-action border-2 border-brand-action/20 flex items-center justify-center font-bold shadow-sm transition-transform hover:scale-105">
//               {userName.charAt(0).toUpperCase()}
//             </div>
//           </button>

//           {/* Dropdown Menu */}
//           {isProfileOpen && (
//             <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50 animate-fade-in-down">
//               <div className="p-3 border-b border-slate-100 sm:hidden">
//                 <p className="text-sm font-bold text-slate-800">{userName}</p>
//                 <p className="text-xs text-brand-action capitalize">{userRole.toLowerCase()}</p>
//               </div>
//               <button 
//                 onClick={handleLogout}
//                 className="w-full text-left px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2"
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                 </svg>
//                 Log Out
//               </button>
//             </div>
//           )}
//         </div>

//       </div>
//     </nav>
//   );
// }