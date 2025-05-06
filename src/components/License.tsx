import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import CopyableCodeBlock from './CopyableCodeBlock';

const License = () => {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('/LICENSE.md')
      .then(response => response.text())
      .then(text => setContent(text))
      .catch(error => console.error('Error loading markdown:', error));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="markdown-content">
          <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            components={{
              h1: ({...props}) => <h1 className="text-3xl font-bold mb-6 text-gray-900" {...props} />,
              h2: ({...props}) => <h2 className="text-2xl font-bold mb-4 text-gray-900" {...props} />,
              h3: ({...props}) => <h3 className="text-xl font-bold mb-3 text-gray-900" {...props} />,
              code: ({inline, children, ...props}: any) => {
                // Only apply CopyableCodeBlock to non-inline code blocks
                if (inline) {
                  return <code className="bg-gray-100 px-1 py-0.5 rounded text-red-600" {...props}>{children}</code>;
                }

                // For block code, use our CopyableCodeBlock component
                return (
                  <CopyableCodeBlock>
                    {String(children).replace(/\n$/, '')}
                  </CopyableCodeBlock>
                );
              }
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default License;

