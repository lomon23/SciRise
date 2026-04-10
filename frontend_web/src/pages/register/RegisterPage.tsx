
import '../login/LoginPage.css'; 
import RegisterForm from '../../features/auth/RegisterForm';

const RegisterPage = () => {
    return (
        <div className="login-page-wrapper">
            <div className="login-card">
                
                <div className="login-content">
                    <h2 style={{ marginBottom: '10px', fontSize: '28px', fontWeight: 'bold', color: '#1a1a1a' }}>Реєстрація</h2>
                    <p style={{ marginBottom: '30px', color: '#666', fontSize: '14px' }}>Створіть акаунт, щоб продовжити</p>
                    
                    <RegisterForm />
                </div>

                <div className="login-visual">
                    <div style={{color: '#666', fontWeight: 'bold'}}>IMAGE PLACEHOLDER</div>
                </div>

            </div>
        </div>
    );
};

export default RegisterPage;