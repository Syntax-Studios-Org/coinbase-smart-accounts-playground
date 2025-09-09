"use client";

import { LucideIcon } from "lucide-react";

interface ScreenHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

/**
 * Common header component for all main screens
 */
export default function ScreenHeader({ icon: Icon, title, description }: ScreenHeaderProps) {
  return (
    <div className="p-6 pb-0">
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-6 h-6 text-gray-700" />
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      </div>
      <div
        className="border-b border-dashed border-gray-300 mb-6"
        style={{
          borderBottomStyle: 'dashed',
          borderBottomWidth: '0.5px'
        }}
      />
      <div className="mx-[15%]">
        <p className="text-[#A3A3A3] text-xs font-normal tracking-tighter mb-6">{description}</p>
      </div>
    </div>
  );
}
