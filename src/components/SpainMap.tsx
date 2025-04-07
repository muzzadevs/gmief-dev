
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Region, regions } from '../lib/mockData';
import "./SpainMap.css";

const SpainMap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [hoveredRegion, setHoveredRegion] = useState<Region | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const container = containerRef.current;
      if (!container) return;
      
      // Set canvas dimensions to match container
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      
      // Redraw the map
      drawMap();
    };

    const drawMap = () => {
      if (!ctx) return;

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set base background for Spain
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Scale factor for responsiveness
      const scaleX = canvas.width / 450;
      const scaleY = canvas.height / 350;

      // Draw each region
      regions.forEach(region => {
        ctx.beginPath();
        
        // Scale coordinates to fit canvas
        region.pathCoordinates.forEach((coord, i) => {
          const [x, y] = coord;
          const scaledX = x * scaleX;
          const scaledY = y * scaleY;
          
          if (i === 0) {
            ctx.moveTo(scaledX, scaledY);
          } else {
            ctx.lineTo(scaledX, scaledY);
          }
        });
        
        // Close the path
        ctx.closePath();
        
        // Fill with color (highlight if hovered)
        ctx.fillStyle = region === hoveredRegion ? '#1E3A8A' : '#93C5FD';
        ctx.fill();
        
        // Draw border
        ctx.strokeStyle = '#1E3A8A';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Add region label
        const centerX = region.pathCoordinates.reduce((sum, [x]) => sum + x, 0) / region.pathCoordinates.length * scaleX;
        const centerY = region.pathCoordinates.reduce((sum, [_, y]) => sum + y, 0) / region.pathCoordinates.length * scaleY;
        
        ctx.font = '14px Poppins, sans-serif';
        ctx.fillStyle = region === hoveredRegion ? '#ffffff' : '#1E3A8A';
        ctx.textAlign = 'center';
        ctx.fillText(region.name, centerX, centerY);
      });
    };

    // Check if point is inside a region
    const isPointInRegion = (x: number, y: number, region: Region): boolean => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return false;
      
      const scaleX = canvas.width / 450;
      const scaleY = canvas.height / 350;
      
      ctx.beginPath();
      region.pathCoordinates.forEach((coord, i) => {
        const [coordX, coordY] = coord;
        const scaledX = coordX * scaleX;
        const scaledY = coordY * scaleY;
        
        if (i === 0) {
          ctx.moveTo(scaledX, scaledY);
        } else {
          ctx.lineTo(scaledX, scaledY);
        }
      });
      ctx.closePath();
      
      return ctx.isPointInPath(x, y);
    };

    // Handle mouse move for hover effects
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Check which region is being hovered
      let hovered: Region | null = null;
      for (const region of regions) {
        if (isPointInRegion(x, y, region)) {
          hovered = region;
          break;
        }
      }
      
      // Update hovered region state
      setHoveredRegion(hovered);
      
      // Update tooltip
      const tooltip = tooltipRef.current;
      if (tooltip) {
        if (hovered) {
          tooltip.innerHTML = hovered.name;
          tooltip.style.left = `${e.clientX - rect.left + 10}px`;
          tooltip.style.top = `${e.clientY - rect.top + 10}px`;
          tooltip.classList.add('visible');
        } else {
          tooltip.classList.remove('visible');
        }
      }
      
      // Update cursor style
      canvas.style.cursor = hovered ? 'pointer' : 'default';
      
      // Redraw the map with hover effect
      drawMap();
    };

    // Handle click on regions
    const handleClick = (e: MouseEvent) => {
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Check which region was clicked
      for (const region of regions) {
        if (isPointInRegion(x, y, region)) {
          router.push(`/region/${region.id}`);
          break;
        }
      }
    };

    // Initial draw
    resizeCanvas();
    
    // Add event listeners
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, [router, hoveredRegion]);

  return (
    <div ref={containerRef} className="spain-map-container">
      <canvas ref={canvasRef} className="spain-map-canvas" />
      <div ref={tooltipRef} className="map-tooltip" />
    </div>
  );
};

export default SpainMap;
