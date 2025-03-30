import React from 'react';

interface Props {
  params: { id: string };
}

const StorageTransferDetailPage: React.FC<Props> = ({ params }) => {
  const { id } = params;

  return (
    <div>
      <h1>Storage Transfer Detail</h1>
      <p>ID: {id}</p>
    </div>
  );
};

export default StorageTransferDetailPage;
