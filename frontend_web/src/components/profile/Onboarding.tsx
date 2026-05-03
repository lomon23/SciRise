import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';

const Onboarding = () => {
    const navigate = useNavigate();
    const [date_of_birth, set_date_of_birth] = useState('');
    const [gender, set_gender] = useState('');
    const [bio, set_bio] = useState('');
    const [is_loading, set_is_loading] = useState(false);

    const handleOnboardingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        set_is_loading(true);

        try {
            // TODO: Коли Міша зробить ендпоінт, розкоментувати і налаштувати запит
            /*
            const payload = {
                date_of_birth,
                gender,
                bio
            };
            await axios.post('/api/user/onboarding', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            */
            
            // Імітація затримки мережі
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Після успішного заповнення кидаємо юзера на головну (або в дашборд)
            navigate('/');
        } catch (error) {
            console.error("Onboarding error:", error);
        } finally {
            set_is_loading(false);
        }
    };

    const handleSkip = () => {
        // Якщо юзер не хоче заповнювати зараз, просто пускаємо його далі
        navigate('/');
    };

    return (
        <div className="onboarding-container">
            <div className="onboarding-box">
                <h2 className="onboarding-title">Tell us about yourself</h2>
                <p className="onboarding-subtitle">
                    Let's personalize your SciRise experience. You can always change this later in your profile.
                </p>

                <form onSubmit={handleOnboardingSubmit}>
                    <div className="form-group">
                        <label className="form-label">Date of Birth</label>
                        <input 
                            className="form-input"
                            type="date" 
                            value={date_of_birth} 
                            onChange={e => set_date_of_birth(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Gender</label>
                        <select 
                            className="form-select"
                            value={gender} 
                            onChange={e => set_gender(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select your gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer_not_to_say">Prefer not to say</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Bio (Optional)</label>
                        <textarea 
                            className="form-textarea"
                            placeholder="Tell us a little bit about your work or interests..."
                            value={bio} 
                            onChange={e => set_bio(e.target.value)} 
                        />
                    </div>

                    <button 
                        className="btn-submit"
                        type="submit" 
                        disabled={is_loading}
                    >
                        {is_loading ? 'Saving...' : 'Complete Profile'}
                    </button>

                    <button 
                        type="button" 
                        className="btn-skip"
                        onClick={handleSkip}
                    >
                        Skip for now
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Onboarding;