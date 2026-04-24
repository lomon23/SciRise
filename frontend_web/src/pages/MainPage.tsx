import { use_auth_store } from '../store/authStore';

const MainPage = () => {
  const token = use_auth_store((state) => state.access_token);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>SciRise MVP</h1>
      {token ? (
        <p>Вітаємо в системі. Ви авторизовані. Скоро тут будуть сокети.</p>
      ) : (
        <p>Будь ласка, увійдіть або зареєструйтесь, щоб почати роботу.</p>
      )}
    </div>
  );
};

export default MainPage;