import './LoginPage.css';
import LoginForm from '../../features/auth/LoginForm';

const LoginPage = () => {
    return (
        <div className="login-page-wrapper">
            <div className="login-card">
                <div className="login-visual">
                    {/* Тут буде твоя картинка або логотип */}
                    <div style={{color: '#666', fontWeight: 'bold'}}>IMAGE PLACEHOLDER</div>
                </div>
                
                <div className="login-content">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;