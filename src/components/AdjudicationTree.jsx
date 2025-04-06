import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronRight, ChevronDown } from 'react-feather';
import { CSSTransition } from 'react-transition-group';
import '../styles/AdjudicationTree.css';

const TreeNode = ({ node, depth = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.then || node.else;
  
  const toggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div className={`tree-node my-1 ${hasChildren ? 'has-children' : ''}`}>
      <div 
        className={`
          node-content flex items-center p-2 rounded-lg transition-colors duration-200
          ${hasChildren ? 'cursor-pointer hover:bg-blue-50' : ''}
          ${depth === 0 ? 'bg-blue-50' : ''}
          ${node.action ? 'action-node' : ''}
        `}
        onClick={hasChildren ? toggleExpand : undefined}
      >
        {/* Expand/Collapse Icon */}
        {hasChildren && (
          <span 
            className={`
              mr-2 text-gray-500 chevron-rotate
              ${isExpanded ? 'chevron-rotate-expanded' : ''}
            `}
          >
            <ChevronRight className="w-4 h-4" />
          </span>
        )}
        
        {/* Node Content */}
        <div className="flex-1">
          {/* Condition */}
          {node.condition && (
            <div className="flex items-center">
              <span className="text-xs font-semibold text-blue-600 mr-2 bg-blue-50 px-2 py-0.5 rounded">
                IF
              </span>
              <span className="font-medium">{node.condition}</span>
            </div>
          )}
          
          {/* Action (for terminal nodes) */}
          {node.action && (
            <div className="flex items-center mt-1">
              <span className="text-xs font-semibold text-green-600 mr-2 bg-green-50 px-2 py-0.5 rounded">
                ACTION
              </span>
              <span className="text-green-700">{node.action}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Children (Then/Else branches) */}
      <CSSTransition
        in={isExpanded}
        timeout={200}
        classNames="tree-node"
        unmountOnExit
      >
        <div className="ml-6 pl-4 depth-line">
          {/* Then branch */}
          {node.then && (
            <div className="my-2">
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded inline-block mb-2">
                THEN
              </span>
              {Array.isArray(node.then) ? (
                node.then.map((childNode, index) => (
                  <TreeNode 
                    key={`then-${index}`}
                    node={childNode}
                    depth={depth + 1}
                  />
                ))
              ) : (
                <TreeNode 
                  node={node.then}
                  depth={depth + 1}
                />
              )}
            </div>
          )}
          
          {/* Else branch */}
          {node.else && (
            <div className="my-2">
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded inline-block mb-2">
                ELSE
              </span>
              <TreeNode 
                node={node.else}
                depth={depth + 1}
              />
            </div>
          )}
        </div>
      </CSSTransition>
    </div>
  );
};

TreeNode.propTypes = {
  node: PropTypes.shape({
    condition: PropTypes.string,
    action: PropTypes.string,
    then: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object
    ]),
    else: PropTypes.object
  }).isRequired,
  depth: PropTypes.number
};

const AdjudicationTree = ({ data }) => {
  return (
    <div className="p-4 bg-white rounded-xl shadow-sm">
      <TreeNode node={data} />
    </div>
  );
};

AdjudicationTree.propTypes = {
  data: PropTypes.object.isRequired
};

export default AdjudicationTree; 