import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      className={`border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}`}
      {...props}
    />
  </div>
);

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, className = '', ...props }) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <textarea
      className={`border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[100px] ${className}`}
      {...props}
    />
  </div>
);