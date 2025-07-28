import React from 'react';

const CardContent: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className = '', children }) => (
  <div className={`card-content ${className}`}>{children}</div>
);

export default CardContent;
