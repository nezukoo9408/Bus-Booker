import React from 'react';
import { Bus, Search } from 'lucide-react';

const HomePageTest: React.FC = () => {
  return (
    <div className="bg-blue-500 text-white p-12">
      <div className="flex items-center gap-4 mb-4">
        <Bus size={32} />
        <h1 className="text-3xl font-bold">HomePage Test</h1>
      </div>
      <p className="mb-4">Testing Tailwind CSS classes</p>
      <div className="flex items-center gap-2">
        <Search size={20} />
        <p>Testing Lucide icons</p>
      </div>
    </div>
  );
};

export default HomePageTest;
