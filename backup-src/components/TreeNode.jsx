import React, { useState } from 'react';
import './TreeViewer.css';

const TreeNode = ({ data, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = data && typeof data === 'object' && Object.keys(data).length > 0;

  const getNodeType = (value) => {
    if (Array.isArray(value)) return 'array';
    if (value === null) return 'null';
    return typeof value;
  };

  const renderValue = (value) => {
    const type = getNodeType(value);
    if (type === 'string') return `"${value}"`;
    if (type === 'null') return 'null';
    if (type === 'object' || type === 'array') {
      return type === 'array' ? '[]' : '{}';
    }
    return String(value);
  };

  return (
    <div className="tree-node">
      <div className="tree-content" onClick={() => hasChildren && setIsExpanded(!isExpanded)}>
        {hasChildren && (
          <span className="tree-icon">
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
        {Object.entries(data).map(([key, value], index) => {
          const type = getNodeType(value);
          return (
            <div key={key} className="tree-item">
              <span className="tree-label">{key}</span>
              <span>: </span>
              <span className={`tree-value ${type}`}>
                {renderValue(value)}
              </span>
              {index < Object.entries(data).length - 1 && <span>, </span>}
            </div>
          );
        })}
      </div>

      {isExpanded && hasChildren && (
        <div className="tree-children">
          {Object.entries(data).map(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
              return <TreeNode key={key} data={{ [key]: value }} level={level + 1} />;
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default TreeNode; 