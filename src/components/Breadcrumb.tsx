
"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary"
          >
            <Home className="w-4 h-4 mr-2" />
            Inicio
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={item.path}>
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <Link
                href={item.path}
                className={`ml-1 text-sm font-medium md:ml-2 ${
                  index === items.length - 1
                    ? "text-primary"
                    : "text-gray-700 hover:text-primary"
                }`}
                aria-current={index === items.length - 1 ? "page" : undefined}
              >
                {item.label}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};
