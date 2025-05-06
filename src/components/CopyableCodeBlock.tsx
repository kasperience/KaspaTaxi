// src/components/CopyableCodeBlock.tsx
import React, { useState } from 'react';
import { Copy, CheckCheck } from 'lucide-react';

interface CopyableCodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

const CopyableCodeBlock: React.FC<CopyableCodeBlockProps> = ({ children, className }) => {
  const [copied, setCopied] = useState(false);

  // Convert children to string for copying
  const codeString = React.Children.toArray(children)
    .map(child => (typeof child === 'string' ? child : ''))
    .join('');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="relative group">
      <pre className={`${className || ''} rounded-md overflow-x-auto p-3 my-2 bg-gray-800 text-white`}>
        <div className="absolute top-1 right-1 z-10">
          <button
            onClick={handleCopy}
            className="p-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            title="Copy code"
          >
            {copied ? (
              <CheckCheck className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-gray-500" />
            )}
          </button>
        </div>
        <code className="block">{children}</code>
      </pre>
    </div>
  );
};

export default CopyableCodeBlock;
