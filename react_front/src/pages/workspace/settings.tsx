import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, updateUserProfile } from '../../scripts/API_endPoint/profile/user.service';
//import type { User } from '../../scripts/API_endPoint/profile/user_types';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Стейт форми
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  
  // Пароль
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Аватарка
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // 1. Завантаження
  useEffect(() => {
    getCurrentUser()
      .then(user => {
        setFirstName(user.first_name || '');
        setLastName(user.last_name || '');
        setEmail(user.email || '');
        setBio(user.profile.bio || '');
        
        if (user.profile.avatar) {
          setAvatarPreview(`http://localhost:8000${user.profile.avatar}`);
        }
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  // 2. Вибір файлу
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // 3. Збереження
  const handleSave = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setSaving(true);
    const formData = new FormData();
    
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('email', email);
    formData.append('bio', bio);
    
    if (newPassword) {
      formData.append('password', newPassword);
    }

    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    try {
      await updateUserProfile(formData);
      setNewPassword(''); // Очищаємо поле паролю
      setConfirmPassword('');
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to save changes');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // 4. Видалення акаунту
  const handleDeleteAccount = async () => {
    if (confirm("Are you sure? This action cannot be undone. All your notes will be lost.")) {
      try {
        await fetch('http://localhost:8000/api/user/me/', { 
            method: 'DELETE',
            credentials: 'include' 
        });
        alert("Account deleted.");
        navigate('/login'); // Викидаємо на логін
      } catch (error) {
        console.error("Failed to delete", error);
      }
    }
  };

  if (loading) return <div className="p-10">Loading settings...</div>;

  const labelStyle = "block text-sm font-semibold text-gray-700 mb-2";
  const inputStyle = "w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#6A5ACD] transition-colors bg-white";

  return (
    <div className="flex min-h-screen bg-[#F8F9FC] font-sans justify-center">
      
      <div className="w-full max-w-4xl p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Settings</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-10">
          
          {/* --- PROFILE SECTION --- */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-6">Profile Details</h2>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl font-bold">
                    {firstName[0]}
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                  Change Picture
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className={labelStyle}>First Name</label>
                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className={inputStyle} />
              </div>
              <div>
                <label className={labelStyle}>Last Name</label>
                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className={inputStyle} />
              </div>
            </div>

            <div className="mb-6">
               <label className={labelStyle}>Email Address</label>
               <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputStyle} />
            </div>

            <div>
              <label className={labelStyle}>Bio</label>
              <textarea rows={3} value={bio} onChange={e => setBio(e.target.value)} className={inputStyle} placeholder="Tell us about yourself..." />
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* --- PASSWORD SECTION --- */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-6">Change Password</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className={labelStyle}>New Password</label>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className={inputStyle} placeholder="Min 6 characters" />
               </div>
               <div>
                  <label className={labelStyle}>Confirm Password</label>
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputStyle} placeholder="Repeat password" />
               </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* --- DANGER ZONE --- */}
          <div>
            <h2 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h2>
            <p className="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
            <button 
              onClick={handleDeleteAccount}
              className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition"
            >
              Delete Account
            </button>
          </div>

          {/* --- SAVE BUTTONS --- */}
          <div className="flex justify-end pt-6 border-t border-gray-100">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-[#6A5ACD] text-white rounded-xl text-sm font-bold hover:bg-[#5842b5] transition shadow-lg shadow-indigo-200 disabled:opacity-70"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;