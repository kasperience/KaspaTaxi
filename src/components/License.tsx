import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
              },
              a: ({href, children, ...props}: any) => {
                // Special case for Features link
                if (href && (
                  href === '#key-features-mvp' ||
                  href === '#key-features' ||
                  href.toLowerCase().includes('feature') ||
                  String(children).toLowerCase().includes('feature')
                )) {
                  return (
                    <Link to="/features" className="text-blue-600 hover:text-blue-800 underline" {...props}>
                      {children}
                    </Link>
                  );
                }

                // Handle internal links (those starting with /)
                if (href && href.startsWith('/')) {
                  return (
                    <Link to={href} className="text-[#1ABC9C] hover:text-[#16a085] font-medium" {...props}>
                      {children}
                    </Link>
                  );
                }

                // Handle anchor links (those starting with #)
                if (href && href.startsWith('#')) {
                  return (
                    <a
                      href={href}
                      className="text-[#1ABC9C] hover:text-[#16a085] font-medium"
                      onClick={(e) => {
                        e.preventDefault();
                        const id = href.substring(1); // Remove the '#'
                        const element = document.getElementById(id);
                        if (element) {
                          element.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                          });
                        }
                      }}
                      {...props}
                    >
                      {children}
                    </a>
                  );
                }

                // Handle external links
                return (
                  <a
                    href={href}
                    className="text-[#1ABC9C] hover:text-[#16a085] font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  >
                    {children}
                  </a>
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

