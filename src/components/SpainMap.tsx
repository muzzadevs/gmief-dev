
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Region, regions } from '../lib/mockData';

const SpainMap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [hoveredRegion, setHoveredRegion] = useState<Region | null>(null);
  const mapImage = "public/lovable-uploads/11336ff5-f7d7-4857-be3a-ad7cbc5023f0.png";
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Create an overlay for each region
    const createRegionOverlays = () => {
      // Remove any existing overlays
      const existingOverlays = container.querySelectorAll('.region-overlay');
      existingOverlays.forEach(overlay => overlay.remove());
      
      // Create new overlays based on current container size
      regions.forEach(region => {
        const overlay = document.createElement('div');
        overlay.className = `region-overlay absolute ${
          region === hoveredRegion 
            ? 'bg-primary/30 border-primary' 
            : 'bg-blue-300/30 hover:bg-blue-300/40 border-blue-400/50'
        } backdrop-blur-sm border-2 cursor-pointer transition-all duration-200`;
        
        // Calculate position based on container dimensions
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        
        // This is a simple example - in a real app, you'd want to precisely map coordinates
        // based on actual map regions, possibly using SVG or canvas with proper coordinates
        let styles: Record<string, string> = {};
        
        switch(region.id) {
          case "norte":
            styles = {
              top: '15%',
              left: '45%',
              width: '30%',
              height: '25%',
              borderRadius: '40% 60% 50% 50% / 40% 50% 50% 60%'
            };
            break;
          case "centro":
            styles = {
              top: '35%',
              left: '40%',
              width: '30%',
              height: '25%',
              borderRadius: '40% 50% 30% 60% / 40% 50% 40% 50%'
            };
            break;
          case "este":
            styles = {
              top: '25%',
              left: '65%',
              width: '25%',
              height: '30%',
              borderRadius: '60% 70% 40% 30% / 50% 60% 40% 50%'
            };
            break;
          case "sur":
            styles = {
              top: '60%',
              left: '45%',
              width: '35%',
              height: '25%',
              borderRadius: '40% 50% 60% 50% / 30% 60% 70% 40%'
            };
            break;
          case "oeste":
            styles = {
              top: '30%',
              left: '15%',
              width: '25%',
              height: '30%',
              borderRadius: '40% 60% 50% 40% / 30% 50% 60% 70%'
            };
            break;
        }
        
        // Apply styles
        Object.entries(styles).forEach(([key, value]) => {
          overlay.style[key as any] = value;
        });
        
        // Add event listeners
        overlay.addEventListener('mouseenter', () => {
          setHoveredRegion(region);
          if (tooltipRef.current) {
            tooltipRef.current.innerHTML = region.name;
            tooltipRef.current.classList.add('visible');
          }
        });
        
        overlay.addEventListener('mouseleave', () => {
          setHoveredRegion(null);
          if (tooltipRef.current) {
            tooltipRef.current.classList.remove('visible');
          }
        });
        
        overlay.addEventListener('mousemove', (e) => {
          if (tooltipRef.current) {
            tooltipRef.current.style.left = `${e.clientX - container.getBoundingClientRect().left + 10}px`;
            tooltipRef.current.style.top = `${e.clientY - container.getBoundingClientRect().top + 10}px`;
          }
        });
        
        overlay.addEventListener('click', () => {
          navigate(`/region/${region.id}`);
        });
        
        container.appendChild(overlay);
      });
    };
    
    // Initial creation
    createRegionOverlays();
    
    // Re-create on resize
    const handleResize = () => {
      createRegionOverlays();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [navigate, hoveredRegion]);

  return (
    <div ref={containerRef} className="spain-map-container relative rounded-xl overflow-hidden shadow-lg">
      <img 
        src={mapImage} 
        alt="Mapa de España" 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-[1px]"></div>
      <div ref={tooltipRef} className="map-tooltip glass text-primary-foreground z-20"></div>
    </div>
  );
};

export default SpainMap;
