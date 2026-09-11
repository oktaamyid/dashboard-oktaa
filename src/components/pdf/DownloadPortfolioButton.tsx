"use client";

import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PortfolioPDF } from './PortfolioPDF';
import { Project } from '@/app/types';
import { getProjects } from '@/lib/service';
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid';

interface DownloadPortfolioButtonProps {
  projects?: Project[];
  className?: string;
  size?: 'sm' | 'md';
}

export default function DownloadPortfolioButton({
  projects: initialProjects,
  className = '',
  size = 'sm'
}: DownloadPortfolioButtonProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects || []);
  const [loading, setLoading] = useState(!initialProjects || initialProjects.length === 0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!initialProjects || initialProjects.length === 0) {
      const fetchData = async () => {
        try {
          const data = await getProjects();
          setProjects(data);
        } catch (error) {
          console.error('Error fetching projects for PDF:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setProjects(initialProjects);
      setLoading(false);
    }
  }, [initialProjects]);

  const sizeClass = size === 'sm' ? 'px-3 py-1.5 text-[10px] h-8' : 'px-4 py-2 text-xs h-10';

  if (!mounted || loading) {
    return (
      <button
        disabled
        className={`btn btn-outline rounded-none font-bold uppercase tracking-widest border-white/20 text-zinc-500 opacity-50 cursor-not-allowed flex items-center gap-2 ${sizeClass} ${className}`}
      >
        <span className="loading loading-spinner loading-xs"></span>
        <span>Preparing PDF...</span>
      </button>
    );
  }

  return (
    <PDFDownloadLink
      document={<PortfolioPDF projects={projects} />}
      fileName="Firtiansyah_Okta_Portfolio.pdf"
      className={`btn btn-outline rounded-none font-bold uppercase tracking-widest text-white hover:bg-white hover:text-black border-white/30 transition-all duration-300 flex items-center gap-2 ${sizeClass} ${className}`}
    >
      {({ loading: pdfLoading }) => (
        <>
          {pdfLoading ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <ArrowDownTrayIcon className="h-3.5 w-3.5 shrink-0" />
          )}
          <span>{pdfLoading ? 'Generating PDF...' : 'Portfolio PDF'}</span>
        </>
      )}
    </PDFDownloadLink>
  );
}
