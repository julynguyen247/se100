import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`
        rounded-2xl bg-white shadow-sm
        dark:bg-slate-800 dark:shadow-slate-900/50
        ${className}
      `}
    >
      {children}
    </div>
  );
};




