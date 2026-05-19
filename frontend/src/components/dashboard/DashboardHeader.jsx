import React from 'react';
import { Search } from 'lucide-react';

const DashboardHeader = () => {
  return (
    <header className="dash-header-minimal">
      <div className="dash-search-glass">
        <Search size={16} className="text-gray-400" />
        <input type="text" placeholder="Search projects..." />
        <div className="search-shortcut">/</div>
      </div>
    </header>
  );
};

export default DashboardHeader;
