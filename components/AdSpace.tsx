import React from 'react';
import { SHOW_ADS } from '../constants';

interface AdSpaceProps {
  className?: string;
  label?: string;
}

export const AdSpace: React.FC<AdSpaceProps> = ({ className = '', label = "Ad Space" }) => {
  if (!SHOW_ADS) return null;

  return (
    <div className={`bg-gray-100 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm no-print ${className}`}>
      {label}
    </div>
  );
};