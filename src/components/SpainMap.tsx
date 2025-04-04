
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchZonas, Zona } from '../lib/api';
import './SpainMap.css';

const SpainMap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [hoveredZone, setHoveredZone] = useState<Zona | null>(null);
  
  // Fetch zonas data
  const { data: zones = [] } = useQuery({
    queryKey: ['zones'],
    queryFn: fetchZonas,
  });
  
  // Currently we only have Cantabria zone in the database
  // Hard-coding the path coordinates for Cantabria
  const zoneCoordinates: Record<string, Array<[number, number]>> = {
    // Cantabria region coordinates (rough estimation)
    '1': [
      [150, 80], [200, 60], [250, 70], [270, 100], [250, 130], [200, 140], [150, 120]
    ]
  };

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
      if (!ctx || !canvas) return;

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set base background for Spain
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Scale factor for responsiveness
      const scaleX = canvas.width / 450;
      const scaleY = canvas.height / 350;

      // Draw each zone (currently only Cantabria)
      zones.forEach(zone => {
        const pathCoordinates = zoneCoordinates[zone.id.toString()];
        
        if (pathCoordinates) {
          ctx.beginPath();
          
          // Scale coordinates to fit canvas
          pathCoordinates.forEach((coord, i) => {
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
          ctx.fillStyle = zone === hoveredZone ? '#1E3A8A' : '#93C5FD';
          ctx.fill();
          
          // Draw border
          ctx.strokeStyle = '#1E3A8A';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Add zone label
          if (pathCoordinates.length > 0) {
            const centerX = pathCoordinates.reduce((sum, [x]) => sum + x, 0) / pathCoordinates.length * scaleX;
            const centerY = pathCoordinates.reduce((sum, [_, y]) => sum + y, 0) / pathCoordinates.length * scaleY;
            
            ctx.font = '14px Poppins, sans-serif';
            ctx.fillStyle = zone === hoveredZone ? '#ffffff' : '#1E3A8A';
            ctx.textAlign = 'center';
            ctx.fillText(zone.nombre, centerX, centerY);
          }
        }
      });
    };

    // Check if point is inside a zone
    const isPointInZone = (x: number, y: number, zone: Zona): boolean => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return false;
      
      const pathCoordinates = zoneCoordinates[zone.id.toString()];
      if (!pathCoordinates) return false;
      
      const scaleX = canvas.width / 450;
      const scaleY = canvas.height / 350;
      
      ctx.beginPath();
      pathCoordinates.forEach((coord, i) => {
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
      
      // Check which zone is being hovered
      let hovered: Zona | null = null;
      for (const zone of zones) {
        if (isPointInZone(x, y, zone)) {
          hovered = zone;
          break;
        }
      }
      
      // Update hovered zone state
      setHoveredZone(hovered);
      
      // Update tooltip
      const tooltip = tooltipRef.current;
      if (tooltip) {
        if (hovered) {
          tooltip.innerHTML = hovered.nombre;
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

    // Handle click on zones
    const handleClick = (e: MouseEvent) => {
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Check which zone was clicked
      for (const zone of zones) {
        if (isPointInZone(x, y, zone)) {
          navigate(`/zone/${zone.id}`);
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
  }, [navigate, hoveredZone, zones]);

  return (
    <div ref={containerRef} className="spain-map-container">
      <canvas ref={canvasRef} className="spain-map-canvas" />
      <div ref={tooltipRef} className="map-tooltip" />
    </div>
  );
};

export default SpainMap;
