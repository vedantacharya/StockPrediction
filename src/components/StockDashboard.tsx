import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // Plugin for GitHub Flavored Markdown (GFM) support

const StockDashboard = ({ data }: { data: any }) => {
  // Extract the markdown content from the backend response
  const markdownContent = data.content;

  // Custom components for ReactMarkdown to style markdown elements
  const markdownComponents = {
    h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-gray-900 mb-4" {...props} />,
    h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-gray-900 mb-4" {...props} />,
    h3: ({ node, ...props }) => <h3 className="text-xl font-semibold text-gray-800 mb-4" {...props} />,
    table: ({ node, ...props }) => (
      <table className="min-w-full divide-y divide-gray-200" {...props} />
    ),
    thead: ({ node, ...props }) => (
      <thead className="bg-gray-100" {...props} />
    ),
    th: ({ node, ...props }) => (
      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider" {...props} />
    ),
    td: ({ node, ...props }) => (
      <td className="px-4 py-3 text-sm text-gray-700" {...props} />
    ),
    a: ({ node, ...props }) => (
      <a
        className="text-blue-600 hover:text-blue-800 font-medium"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),
    p: ({ node, ...props }) => <p className="text-sm text-gray-600 mb-4" {...props} />,
    ul: ({ node, ...props }) => <ul className="list-disc list-inside text-sm text-gray-600 mb-4" {...props} />,
    li: ({ node, ...props }) => <li className="mb-2" {...props} />,
  };

  // Extract all hyperlinks from the markdown content
  const hyperlinks = extractHyperlinks(markdownContent);

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      {/* Render the entire markdown content dynamically */}
      <ReactMarkdown
        components={markdownComponents}
        remarkPlugins={[remarkGfm]} // Enable GitHub Flavored Markdown (GFM) support
      >
        {markdownContent}
      </ReactMarkdown>

      {/* Conditionally render the "Sources" section if hyperlinks exist */}
      {hyperlinks.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Sources</h3>
          <ul className="list-disc list-inside text-sm text-gray-600">
            {hyperlinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {link.name || link.url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Helper function to extract all hyperlinks from markdown content
const extractHyperlinks = (markdownContent: string) => {
  const hyperlinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g;
  const hyperlinks = [];
  let match;

  while ((match = hyperlinkRegex.exec(markdownContent)) !== null) {
    hyperlinks.push({ name: match[1], url: match[2] });
  }

  return hyperlinks;
};

export default StockDashboard;