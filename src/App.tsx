import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './screens/Dashboard';
import RoomsCalendar from './screens/RoomsCalendar';
import BookingsList from './screens/BookingsList';
import CheckInOut from './screens/CheckInOut';
import Payments from './screens/Payments';
import { DataProvider } from './context/DataContext';

const USER = {
  name: 'Alex Rivera',
  role: 'Front Desk Manager',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlgB8xIr_N9ucE4MPUjR_Cmf8DehxIzBJXtVUEBMQfatwGKRIlhALNpNyZKHNB8NclbfSOwllXMqDMlCPkXBfD1SyJ1NlZavW13Lxmmnpx-TOAYAf_ERkxHmcnDnirUp-QRTMXnt6XOea4FrU40lfCpY8JaLw9JAWU5W5YK_6qQmBgF3THXR6os-dsyWASNSF41s0tLM8YWd4rJbWw4sASWI-wLYOaf95y9fWhUNotOmZg_GnjZdf3rWz6Q_SiJs3HY_KmJzj2G_Ij'
};

export default function App() {
  const [activeScreen, setActiveScreen] = useState('dashboard');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <Dashboard />;
      case 'calendar':
        return <RoomsCalendar />;
      case 'bookings':
        return <BookingsList />;
      case 'checkinout':
        return <CheckInOut />;
      case 'payments':
        return <Payments />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <DataProvider>
      <Layout activeScreen={activeScreen} setActiveScreen={setActiveScreen} user={USER}>
        {renderScreen()}
      </Layout>
    </DataProvider>
  );
}
