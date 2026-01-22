import React, { useState, useRef, useEffect } from 'react';
import { IntegratedPageHeader } from './IntegratedPageHeader';
import { Footer } from '../../components/Footer';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  headerIcon?: React.ReactNode;
  backgroundImage?: React.ReactNode;
  globalActions?: React.ReactNode;
  pageActions?: React.ReactNode;
  headerContent?: React.ReactNode; // Content for dynamic island stats
  accentColor?: string;
  contentClassName?: string;
  backgroundPosition?: 'left' | 'center' | 'right';
  briefingMode?: 'morning' | 'evening';
  
  // Customization Props
  onCustomize?: () => void;
  isCustomizing?: boolean;
  onSaveCustomization?: () => void;
  onCancelCustomization?: () => void;
}

export function PageLayout({ 
  children, 
  headerContent,
  contentClassName = "flex-1 overflow-y-auto",
  ...headerProps 
}: PageLayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setIsScrolled(scrollRef.current.scrollTop > 20);
      }
    };

    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
       <IntegratedPageHeader isScrolled={isScrolled} headerContent={headerContent} {...headerProps} />
       <div ref={scrollRef} className={`${contentClassName} flex flex-col min-h-0 gap-8`}>
         <div className="flex-grow flex-shrink-0 basis-auto min-h-0">
            {children}
         </div>
         <div className="flex-shrink-0 mt-auto">
            <Footer />
         </div>
       </div>
    </div>
  );
}