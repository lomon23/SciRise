import React from 'react';

const SettingsPage: React.FC = () => {
  const containerStyle = {
    display: 'flex',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const menuCardStyle = {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    height: 'fit-content'
  };

  const contentCardStyle = {
    flex: 3,
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '40px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  };

  const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '20px',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px'
  };

  const inputGroupStyle = {
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 500,
    fontSize: '14px',
    color: '#555'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    outline: 'none',
    fontSize: '14px',
    backgroundColor: '#F9F9F9'
  };

  const menuItemStyle = (isActive: boolean) => ({
    padding: '12px 15px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '5px',
    backgroundColor: isActive ? '#F0EEFA' : 'transparent',
    color: isActive ? '#6A5ACD' : '#333',
    fontWeight: isActive ? 'bold' : 'normal' as 'normal'
  });

  return (
    <div style={{ paddingBottom: '50px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ margin: 0 }}>Settings</h1>
        <p style={{ color: '#888', marginTop: '5px' }}>Manage your account settings and preferences.</p>
      </div>

      <div style={containerStyle}>
        
        <div style={menuCardStyle}>
          <div style={menuItemStyle(true)}>General</div>
          <div style={menuItemStyle(false)}>Account</div>
          <div style={menuItemStyle(false)}>Notifications</div>
          <div style={menuItemStyle(false)}>Appearance</div>
          <div style={menuItemStyle(false)}>Privacy & Security</div>
          <div style={menuItemStyle(false)}>Billing</div>
        </div>

        <div style={contentCardStyle}>
          
          <div style={{ marginBottom: '40px' }}>
            <div style={sectionTitleStyle}>Public Profile</div>
            
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#E0E0E0' }}></div>
              <div>
                <button style={{ backgroundColor: 'white', border: '1px solid #ddd', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}>Change Picture</button>
                <button style={{ backgroundColor: 'white', border: 'none', color: '#d9534f', cursor: 'pointer' }}>Delete</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ ...inputGroupStyle, flex: 1 }}>
                <label style={labelStyle}>First Name</label>
                <input type="text" style={inputStyle} defaultValue="User" />
              </div>
              <div style={{ ...inputGroupStyle, flex: 1 }}>
                <label style={labelStyle}>Last Name</label>
                <input type="text" style={inputStyle} defaultValue="Name" />
              </div>
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Bio</label>
              <textarea style={{ ...inputStyle, height: '80px', resize: 'none' }} defaultValue="Student at University. Learning React and TypeScript." />
            </div>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <div style={sectionTitleStyle}>Contact Info</div>
            
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Email Address</label>
              <input type="email" style={inputStyle} defaultValue="username@example.com" />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Phone Number</label>
              <input type="tel" style={inputStyle} defaultValue="+380 99 123 45 67" />
            </div>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <div style={sectionTitleStyle}>Preferences</div>
            
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Language</label>
              <select style={inputStyle}>
                <option>English (United States)</option>
                <option>Ukrainian</option>
                <option>German</option>
              </select>
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Timezone</label>
              <select style={inputStyle}>
                <option>(GMT+02:00) Eastern European Time (Kyiv)</option>
                <option>(GMT+00:00) London</option>
                <option>(GMT-05:00) Eastern Time (US & Canada)</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={sectionTitleStyle}>Notifications</div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
              <div>
                <div style={{ fontWeight: 500 }}>Email Notifications</div>
                <div style={{ fontSize: '12px', color: '#888' }}>Receive emails about your account activity.</div>
              </div>
              <input type="checkbox" checked readOnly style={{ transform: 'scale(1.2)' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
              <div>
                <div style={{ fontWeight: 500 }}>Push Notifications</div>
                <div style={{ fontSize: '12px', color: '#888' }}>Receive push notifications on your device.</div>
              </div>
              <input type="checkbox" readOnly style={{ transform: 'scale(1.2)' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
              <div>
                <div style={{ fontWeight: 500 }}>Weekly Digest</div>
                <div style={{ fontSize: '12px', color: '#888' }}>Get a weekly summary of your learning progress.</div>
              </div>
              <input type="checkbox" checked readOnly style={{ transform: 'scale(1.2)' }} />
            </div>
          </div>

          <div style={{ marginTop: '30px', textAlign: 'right' }}>
            <button style={{ backgroundColor: 'transparent', border: '1px solid #ccc', padding: '10px 20px', borderRadius: '5px', marginRight: '10px', cursor: 'pointer' }}>Cancel</button>
            <button style={{ backgroundColor: '#6A5ACD', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>Save Changes</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;