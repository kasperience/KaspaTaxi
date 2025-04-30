import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

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
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default License;

