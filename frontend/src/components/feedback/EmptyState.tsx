import React from 'react';
import { Button, Card } from '@components/ui';

interface Props {
  title: string;
  description: string;
  action: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: React.FC<Props> = ({ title, description, action }) => {
  return (
    <Card className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-400 text-center mb-6">
        {description}
      </p>
      <Button onClick={action.onClick}>
        {action.label}
      </Button>
    </Card>
  );
};

export default EmptyState; 