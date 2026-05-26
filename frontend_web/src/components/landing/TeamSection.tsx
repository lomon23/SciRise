import './TeamSection.scss';

export const TeamSection = () => {
  const team = [
    { name: 'Крочак Остап', role: 'Team Lead / Systems' },
    { name: 'Леньо Андрій', role: 'Desktop / C++' },
    { name: 'Клевець Олександра', role: 'Frontend' },
    { name: 'Скрипнюк Михайло', role: 'Backend' },
    { name: 'Глинка Максим', role: 'QA' },
  ];

  return (
    <section className="team-section">
      <div className="section-header">
        <h2>Наша Команда</h2>
        <p>Люди, які створюють SciRise</p>
      </div>
      <div className="team-grid">
        {team.map((member, i) => (
          <div key={i} className="member-card">
            <div className="avatar">
              <img 
                src={`https://ui-avatars.com/api/?name=${member.name}&background=1a1a1a&color=fff&size=128&font-size=0.33`} 
                alt={member.name} 
              />
            </div>
            <h4>{member.name}</h4>
            <span>{member.role}</span>
          </div>
        ))}
      </div>
    </section>
  );
};