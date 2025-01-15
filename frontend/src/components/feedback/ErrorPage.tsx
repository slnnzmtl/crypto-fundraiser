import React, { ReactNode } from "react";
import { Card } from "@components/ui";

interface ErrorPageProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark-900 text-white">
      <Card className="max-w-md w-full p-8 text-center space-y-6 bg-dark-800 border border-dark-700">
        <div className="w-24 h-24 mx-auto p-4 rounded-full bg-gradient-to-br from-orange-400/10 to-orange-600/10">
          {icon}
        </div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="text-gray-400">{description}</p>
        {action &&
          (action.href ? (
            <a
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {action.label}
            </a>
          ) : (
            <button
              onClick={action.onClick}
              className="inline-block bg-primary hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {action.label}
            </button>
          ))}
      </Card>
    </div>
  );
};

export default ErrorPage;
