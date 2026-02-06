import React from 'react';
import { useParams } from 'react-router-dom';

const AdminEditBusPage = () => {
  const { busId } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Bus</h1>
      <div className="max-w-2xl">
        {/* Edit bus form will go here */}
      </div>
    </div>
  );
};

export default AdminEditBusPage;