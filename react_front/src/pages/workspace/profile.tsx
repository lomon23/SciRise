import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../../scripts/API_endPoint/profile/user.service';
import { fetchNotes } from '../../scripts/API_endPoint/note/note_service';
import type { User } from '../../scripts/API_endPoint/profile/user_types';
import type { Note } from '../../scripts/API_endPoint/note/note_types';


// Імпорти компонентів
import ProfileHeader from '../../components/profile/ProfileHeader'; // <--- НОВИЙ
import StatsWidget from '../../components/profile/StatsWidget'; // <--- NEW
import NoteCard from '../../components/profile/Note_Card';
import NoteListItem from '../../components/profile//Note_List_Item';
import CalendarWidget from '../../components/profile/CalendarWidget'; // <--- НОВИЙ

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userData, notesData] = await Promise.all([
          getCurrentUser(),
          fetchNotes()
        ]);
        
        setUser(userData);
        const sorted = notesData.sort((a, b) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        setNotes(sorted);
      } catch (err) {
        console.error("Failed to load profile data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div style={{ padding: '40px' }}>Loading...</div>;

  const recentNotes = notes.slice(0, 3);

  return (
    <div style={{ padding: '30px', fontFamily: "'Inter', sans-serif", maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* 1. НОВА ВЕЛИКА ПЛИТКА ПРОФІЛЮ */}
      <ProfileHeader user={user} />

      {/* 2. GRID LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
        
        {/* --- ЛІВА КОЛОНКА (2/3) --- */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* Last Opened */}
            <div>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>Last Opened</h2>
                {recentNotes.length > 0 ? (
                    <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '15px' }} className="hide-scrollbar">
                    {recentNotes.map(note => (
                        <NoteCard key={note.id} note={note} />
                    ))}
                    </div>
                ) : (
                    <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '10px', color: '#888' }}>
                    No notes yet.
                    </div>
                )}
            </div>

            {/* All Notes */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>All Notes collection</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {notes.map(note => (
                    <NoteListItem key={note.id} note={note} />
                    ))}
                </div>
            </div>
        </div>

        {/* --- ПРАВА КОЛОНКА (1/3) --- */}
        <div style={{ gridColumn: 'span 1' }}>
            
            <StatsWidget totalNotes={notes.length} />

            <div style={{ marginBottom: '30px' }}>
                <CalendarWidget />
            </div>

          

        </div>

      </div>
    </div>
  );
};

export default ProfilePage;