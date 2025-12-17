import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../../scripts/API_endPoint/profile/user.service'; // Перевір шлях
import type { User } from '../../scripts/API_endPoint/profile/user_types'; // Перевір шлях
// Додаємо MessageSquare для чату
import { User as UserIcon, Home, Settings, LogOut, MessageSquare, ChevronRight } from 'lucide-react';

const Sidebar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();

  useEffect(() => {
    getCurrentUser()
      .then(data => setUser(data))
      .catch(err => console.error("Sidebar user load error:", err));
  }, []);

  const avatarUrl = user?.profile?.avatar 
    ? `http://localhost:8000${user.profile.avatar}` 
    : null;

  const displayName = (user?.first_name && user?.last_name) 
    ? `${user.first_name} ${user.last_name}` 
    : user?.username || "Guest";

  return (
    <div 
      style={{
        width: '280px',
        height: '100vh',
        background: 'linear-gradient(180deg, #6A5ACD 0%, #5842b5 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
        boxSizing: 'border-box',
        // ВАЖЛИВО: Тепер він не фіксований поверх, а просто займає місце
        flexShrink: 0, 
        position: 'sticky', // Щоб залишався при скролі, якщо треба
        top: 0
      }}
    >
      {/* --- БЛОК ПРОФІЛЮ --- */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '40px', 
        marginTop: '10px',
        padding: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        
        {/* Аватарка */}
        <div style={{ 
          width: '48px', height: '48px', 
          borderRadius: '14px', 
          backgroundColor: 'rgba(255,255,255,0.2)', 
          marginRight: '12px', 
          overflow: 'hidden', 
          flexShrink: 0,
          border: '2px solid rgba(255,255,255,0.3)'
        }}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>
              {displayName[0]?.toUpperCase()}
            </div>
          )}
        </div>

        {/* Текст */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ fontWeight: '700', fontSize: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {displayName}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '2px' }}>
            @{user?.username}
          </div>
        </div>
      </div>

      {/* --- НАВІГАЦІЯ --- */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        
        <SidebarItem 
          to="/workspace" 
          icon={<Home size={20} />} 
          label="Home" 
          isActive={location.pathname === '/workspace' || location.pathname === '/workspace/'}
        />

        <SidebarItem 
          to="/workspace/profile" 
          icon={<UserIcon size={20} />} 
          label="My Profile" 
          isActive={location.pathname === '/workspace/profile'}
        />

        {/* --- НОВИЙ ПУНКТ: CHAT --- */}
        <SidebarItem 
          to="/workspace/chat" 
          icon={<MessageSquare size={20} />} 
          label="Messages" 
          isActive={location.pathname === '/workspace/chat'}
        />

        <SidebarItem 
          to="/workspace/settings" 
          icon={<Settings size={20} />} 
          label="Settings" 
          isActive={location.pathname === '/workspace/settings'}
        />
      </nav>

      {/* --- FOOTER --- */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
        <SidebarItem 
          to="/login" 
          icon={<LogOut size={20} />} 
          label="Logout" 
          isActive={false}
          isDanger={true}
        />
      </div>
    </div>
  );
};

// --- Допоміжний компонент ---
interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isDanger?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, isActive,}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      to={to}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        textDecoration: 'none',
        borderRadius: '12px',
        transition: 'all 0.2s ease',
        backgroundColor: isActive 
          ? 'white' 
          : isHovered 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'transparent',
        
        color: isActive ? '#6A5ACD' : 'white',
        fontWeight: isActive ? '700' : '500',
        transform: isHovered ? 'translateX(4px)' : 'none',
      }}
    >
      <span style={{ opacity: isActive ? 1 : 0.8, display: 'flex', alignItems: 'center' }}>
        {icon}
      </span>
      <span style={{ marginLeft: '12px', fontSize: '15px' }}>{label}</span>
      
      {isActive && (
        <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: 0.5 }} />
      )}
    </Link>
  );
};

export default Sidebar;