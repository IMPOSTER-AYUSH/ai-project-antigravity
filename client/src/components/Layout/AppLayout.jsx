import React from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from './Topbar';
import './Layout.css';

export default function AppLayout() {
  return (
    <div className="app-layout no-sidebar">
      <div className="main-wrapper centered-wrapper">
        <Topbar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
