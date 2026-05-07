import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <Navbar />
      <div className="flex-grow-1 main-content p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
