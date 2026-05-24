import { Outlet } from 'react-router-dom';
import { GroupSidebar } from '../../components/sidebar/groups/GroupSidebar';
import './GroupsLayout.scss';

export const GroupsLayout = () => {
  return (
    <div className="groups-layout">
      <GroupSidebar />
      <main className="groups-layout__main">
        {/* Сюди Роутер підставить конкретний канал (чат або дошку) */}
        <Outlet /> 
      </main>
    </div>
  );
};