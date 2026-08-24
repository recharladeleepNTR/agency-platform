import React from 'react';

export const ProtectedImage = ({ src, alt = '', className = '', imgClassName = '', ...props }) => {
  return (
    <div className={`relative overflow-hidden select-none ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover pointer-events-none select-none ${imgClassName}`}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        {...props}
      />
      {/* Invisible Shield Overlay: Intercepts right-clicks, long-presses, and taps */}
      <div
        className="absolute inset-0 z-20 bg-transparent select-none pointer-events-auto cursor-default"
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
};

export default ProtectedImage;
