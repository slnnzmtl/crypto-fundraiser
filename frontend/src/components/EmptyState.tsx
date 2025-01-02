import React from 'react';
import { Button, Card } from './ui/primitives';

interface Props {
  onCreateClick: () => void;
}

const EmptyState: React.FC<Props> = ({ onCreateClick }) => {
  return (
    <Card className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <h2 className="text-xl font-semibold mb-2">No active campaigns</h2>
      <p className="text-gray-400 text-center mb-6">
        Create your first fundraising campaign
      </p>
      <Button onClick={onCreateClick}>
        Create campaign
      </Button>
    </Card>
  );
};

export default EmptyState; 