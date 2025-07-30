import React, { useState, useCallback, type ReactNode } from 'react';
import { ChevronRight, ChevronDown, FolderIcon, FileIcon } from 'lucide-react';

interface TreeNodeData {
  /**
   * Unique identifier for the node
   */
  id: string;
  /**
   * Label to display for the node
   */
  label: string;
  /**
   * Child nodes
   */
  children?: TreeNodeData[];
  /**
   * Whether the node is expanded by default
   */
  defaultExpanded?: boolean;
  /**
   * Whether the node is disabled
   */
  disabled?: boolean;
  /**
   * Custom icon for the node
   */
  icon?: ReactNode;
  /**
   * Additional data for the node
   */
  data?: any;
}

interface TreeProps {
  /**
   * Data for the tree nodes
   */
  data: TreeNodeData[];
  /**
   * Callback when a node is selected
   */
  onNodeSelect?: (node: TreeNodeData, path: string[]) => void;
  /**
   * Callback when a node is expanded or collapsed
   */
  onNodeToggle?: (node: TreeNodeData, expanded: boolean) => void;
  /**
   * Default selected node ID
   */
  defaultSelectedId?: string;
  /**
   * Selected node ID (controlled)
   */
  selectedId?: string;
  /**
   * Whether to show icons for nodes
   */
  showIcons?: boolean;
  /**
   * Whether to show lines connecting nodes
   */
  showLines?: boolean;
  /**
   * Whether to expand all nodes by default
   */
  defaultExpandAll?: boolean;
  /**
   * Custom class name for the container
   */
  className?: string;
  /**
   * Custom class name for nodes
   */
  nodeClassName?: string;
}

export function Tree({
  data,
  onNodeSelect,
  onNodeToggle,
  defaultSelectedId,
  selectedId,
  showIcons = true,
  showLines = true,
  defaultExpandAll = false,
  className = '',
  nodeClassName = '',
}: TreeProps) {
  // State for selected node (for uncontrolled component)
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(defaultSelectedId);

  // Determine if component is controlled or uncontrolled
  const isControlled = selectedId !== undefined;
  const currentSelectedId = isControlled ? selectedId : selectedNodeId;

  // Handle node selection
  const handleNodeSelect = useCallback(
    (node: TreeNodeData, path: string[]) => {
      if (!isControlled) {
        setSelectedNodeId(node.id);
      }
      onNodeSelect?.(node, path);
    },
    [isControlled, onNodeSelect]
  );

  // Container classes
  const containerClasses = `
    tree
    select-none
    ${className}
  `;

  return (
    <div className={containerClasses} role="tree">
      {data.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          level={0}
          path={[node.id]}
          selectedId={currentSelectedId}
          onNodeSelect={handleNodeSelect}
          onNodeToggle={onNodeToggle}
          showIcons={showIcons}
          showLines={showLines}
          defaultExpandAll={defaultExpandAll}
          nodeClassName={nodeClassName}
          isLastChild={node === data[data.length - 1]}
        />
      ))}
    </div>
  );
}

interface TreeNodeProps {
  node: TreeNodeData;
  level: number;
  path: string[];
  selectedId?: string;
  onNodeSelect?: (node: TreeNodeData, path: string[]) => void;
  onNodeToggle?: (node: TreeNodeData, expanded: boolean) => void;
  showIcons: boolean;
  showLines: boolean;
  defaultExpandAll: boolean;
  nodeClassName: string;
  isLastChild: boolean;
}

function TreeNode({
  node,
  level,
  path,
  selectedId,
  onNodeSelect,
  onNodeToggle,
  showIcons,
  showLines,
  defaultExpandAll,
  nodeClassName,
  isLastChild,
}: TreeNodeProps) {
  // Determine if node has children
  const hasChildren = node.children && node.children.length > 0;

  // State for expanded status
  const [expanded, setExpanded] = useState(
    defaultExpandAll || node.defaultExpanded || false
  );

  // Handle toggle
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasChildren || node.disabled) return;

    const newExpanded = !expanded;
    setExpanded(newExpanded);
    onNodeToggle?.(node, newExpanded);
  };

  // Handle click
  const handleClick = () => {
    if (node.disabled) return;
    onNodeSelect?.(node, path);
  };

  // Determine if node is selected
  const isSelected = selectedId === node.id;

  // Node classes
  const nodeClasses = `
    tree-node
    flex
    items-center
    py-1
    px-1
    rounded
    ${isSelected ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}
    ${node.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${nodeClassName}
  `;

  // Get appropriate icon
  const getIcon = () => {
    if (node.icon) return node.icon;
    if (hasChildren) return <FolderIcon className="h-4 w-4 text-yellow-500" />;
    return <FileIcon className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div className="tree-node-container">
      <div
        className={nodeClasses}
        style={{ paddingLeft: `${level * 20}px` }}
        onClick={handleClick}
        role="treeitem"
        aria-expanded={hasChildren ? expanded : undefined}
        aria-selected={isSelected}
        aria-disabled={node.disabled}
      >
        {/* Toggle icon or spacer */}
        <div
          className="tree-node-toggle mr-1 w-4 flex-shrink-0"
          onClick={handleToggle}
        >
          {hasChildren ? (
            expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          ) : null}
        </div>

        {/* Node icon */}
        {showIcons && (
          <div className="tree-node-icon mr-2 flex-shrink-0">{getIcon()}</div>
        )}

        {/* Node label */}
        <div className="tree-node-label truncate">{node.label}</div>
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div className="tree-node-children relative">
          {/* Connector lines */}
          {showLines && level > 0 && (
            <div
              className="absolute border-l border-gray-300"
              style={{
                left: `${level * 20 + 2}px`,
                top: 0,
                bottom: isLastChild ? '50%' : 0,
              }}
            />
          )}

          {node.children!.map((childNode, index) => (
            <TreeNode
              key={childNode.id}
              node={childNode}
              level={level + 1}
              path={[...path, childNode.id]}
              selectedId={selectedId}
              onNodeSelect={onNodeSelect}
              onNodeToggle={onNodeToggle}
              showIcons={showIcons}
              showLines={showLines}
              defaultExpandAll={defaultExpandAll}
              nodeClassName={nodeClassName}
              isLastChild={index === node.children!.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}