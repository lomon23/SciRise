import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../scripts/API_endPoint/profile/user_types';

interface ProfileHeaderProps {
  user: User | null;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const navigate = useNavigate();

  if (!user) return null;

  // Дані
  const displayName = (user.first_name && user.last_name) 
    ? `${user.first_name} ${user.last_name}` 
    : user.username;
  
  const avatarUrl = user.profile.avatar 
    ? `http://localhost:8000${user.profile.avatar}` 
    : null;

  const role = user.profile.role || 'Student';
  const bio = user.profile.bio || 'No bio yet. Write something about yourself in settings!';
  const phone = user.profile.phone_number;

  return (
    <div style={styles.card}>
      
      <div style={styles.topRow}>
        {/* --- АВАТАРКА --- */}
        <div style={styles.avatarContainer}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="Profile" style={styles.avatarImg} />
          ) : (
            <div style={styles.avatarPlaceholder}>{displayName[0].toUpperCase()}</div>
          )}
        </div>

        {/* --- ОСНОВНА ІНФА --- */}
        <div style={styles.mainInfo}>
          <div style={styles.nameRow}>
            <h1 style={styles.name}>{displayName}</h1>
            <span style={styles.roleBadge}>{role}</span>
          </div>
          <div style={styles.username}>@{user.username}</div>
          
          {/* БІОГРАФІЯ */}
          <p style={styles.bio}>
            {bio}
          </p>

          {/* КОНТАКТИ (Грід) */}
          <div style={styles.contactGrid}>
            <div style={styles.contactItem}>
              <span style={styles.icon}>✉️</span>
              <span>{user.email}</span>
            </div>
            
            {phone && (
              <div style={styles.contactItem}>
                <span style={styles.icon}>📞</span>
                <span>{phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* --- КНОПКА EDIT --- */}
        <div style={styles.actionColumn}>
          <button 
            onClick={() => navigate('/workspace/settings')}
            style={styles.editBtn}
          >
            Edit Profile
          </button>
        </div>
      </div>

    </div>
  );
};

// --- STYLES ---
const styles: { [key: string]: React.CSSProperties } = {
  card: {
    backgroundColor: 'white',
    borderRadius: '24px',
    padding: '30px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    border: '1px solid #f0f0f0',
    marginBottom: '40px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden'
  },
  topRow: {
    display: 'flex',
    gap: '30px',
    alignItems: 'flex-start',
    flexWrap: 'wrap' // Щоб на мобільних переносилось
  },
  // Аватар
  avatarContainer: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: '#F3F0FF',
    border: '4px solid white',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    flexShrink: 0
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#6A5ACD'
  },
  // Інфо
  mainInfo: {
    flex: 1,
    paddingTop: '10px'
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '5px'
  },
  name: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#1a1a1a',
    margin: 0
  },
  roleBadge: {
    padding: '4px 12px',
    backgroundColor: '#F3F0FF',
    color: '#6A5ACD',
    fontSize: '12px',
    fontWeight: 'bold',
    borderRadius: '20px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  username: {
    fontSize: '14px',
    color: '#888',
    marginBottom: '15px'
  },
  bio: {
    fontSize: '15px',
    color: '#555',
    lineHeight: '1.6',
    marginBottom: '20px',
    maxWidth: '600px',
    backgroundColor: '#FAFAFA',
    padding: '10px 15px',
    borderRadius: '10px',
    fontStyle: 'italic'
  },
  contactGrid: {
    display: 'flex',
    gap: '25px',
    flexWrap: 'wrap'
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#444',
    backgroundColor: 'white',
    border: '1px solid #eee',
    padding: '6px 12px',
    borderRadius: '8px'
  },
  icon: {
    fontSize: '16px'
  },
  // Дії
  actionColumn: {
    marginLeft: 'auto'
  },
  editBtn: {
    padding: '10px 20px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '12px',
    color: '#333',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
  }
};

export default ProfileHeader;