import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw'; // Allows rendering raw HTML from markdown

// Custom heading components to handle specific IDs
const createHeadingComponent = (level: number) => {
  // Properly type the component props
  return ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    // Only process h2 headings (section titles)
    if (level === 2 && typeof children === 'string') {
      // Map section titles to their corresponding anchor IDs
      if (children.includes('Key Features (MVP')) {
        return React.createElement(`h${level}`, { id: 'key-features-mvp', ...props }, children);
      }
      else if (children.includes('Getting Started')) {
        return React.createElement(`h${level}`, { id: 'getting-started', ...props }, children);
      }
      else if (children.includes('Contribution Guidelines')) {
        return React.createElement(`h${level}`, { id: 'contribution-guidelines', ...props }, children);
      }
      else if (children.includes('License')) {
        return React.createElement(`h${level}`, { id: 'license', ...props }, children);
      }
      else if (children.includes('Donations')) {
        return React.createElement(`h${level}`, { id: 'donations', ...props }, children);
      }
    }

    return React.createElement(`h${level}`, props, children);
  };
};

const Readme = () => {
  const [content, setContent] = useState('');
  const location = useLocation(); // Get location object to access the hash

  useEffect(() => {
    fetch('/README.md') // Fetch the raw README.md file
     .then(response => response.text())
     .then(text => {
        // Keep the original text - rehypeRaw will handle HTML
        setContent(text);
      })
     .catch(error => console.error('Error loading markdown:', error));
  }, []);

  // Effect to handle scrolling to hash links
  useEffect(() => {
    // Only run if content is loaded and there's a hash in the URL
    if (location.hash && content) {
      // Decode URI component just in case hash contains encoded characters
      const id = decodeURIComponent(location.hash.substring(1)); // Remove the '#'

      // Use a longer timeout to ensure the DOM has fully updated and rendered
      // This is especially important for markdown content with images
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          // Scroll with smooth behavior and add a small offset from the top
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          // Add a visual highlight effect to the target element
          const originalBackground = element.style.backgroundColor;
          element.style.backgroundColor = 'rgba(241, 196, 15, 0.2)'; // Light yellow highlight

          // Remove the highlight after a short delay
          setTimeout(() => {
            element.style.backgroundColor = originalBackground;
          }, 2000);
        } else {
          console.warn(`Readme.tsx: Could not find element with ID: ${id}`);
        }
      }, 300); // Increased delay for more reliable rendering
    }
  }, [location.hash, content]); // Re-run this effect if the hash or content changes

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">
      <div className="bg-white shadow-md rounded-lg p-6 md:p-10 max-w-4xl mx-auto">
        {/* Set width back to 150px */}
        <div className="prose max-w-none [&_div[align='center']_img]:w-[200px] [&_div[align='center']_img]:mx-auto">
          <ReactMarkdown
            rehypePlugins={[rehypeRaw]} // Use rehypeRaw to handle HTML tags like <img> and <div>
            components={{
              h1: createHeadingComponent(1),
              h2: createHeadingComponent(2),
              h3: createHeadingComponent(3),
              h4: createHeadingComponent(4),
              h5: createHeadingComponent(5),
              h6: createHeadingComponent(6),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default Readme;
