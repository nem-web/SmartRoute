import React, { useState, useRef, useEffect } from "react";
import "./styles.css";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import { Button } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createData(Node, Distance, Parent, Neighbors) {
  return { Node, Distance, Parent, Neighbors };
}

const rows = [
  createData(1, 15, 6, [2, 4]),
  createData(2, 15, 6, [2, 4]),
  createData(3, 15, 6, [2, 4]),
  createData(4, 15, 6, [2, 4]),
  createData(5, 15, 6, [2, 4]),
  createData(6, 15, 6, [2, 4]),
];

const GraphCanvas = ({
  nodes,
  setNodes,
  edges,
  setEdges,
  nodeId,
  setNodeId,
  shortestPath,
  animationSpeed = 400, // Default to 300 if not provided
  isDirected,
  onNodeDoubleClick,
  currentHighlight = { node: null, edge: null, neighbors: [], blink: false },
}) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [editingEdge, setEditingEdge] = useState(null);
  const canvasRef = useRef(null);
  const [highlightedEdges, setHighlightedEdges] = useState([]);
  const [highlightedNodes, setHighlightedNodes] = useState([]);

  const visualDelay = 1000 - animationSpeed;

  const getNodeById = (id) => nodes.find((n) => n.id === id);

  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

  const canBeOpen = open && Boolean(anchorEl);
  const id = canBeOpen ? "transition-popper" : undefined;

  const handleWeightChange = (index, value) => {
    const weight = parseInt(value);
    if (!isNaN(weight) && weight > 0) {
      const updated = [...edges];
      updated[index].weight = weight;
      setEdges(updated);
    }
    setEditingEdge(null);
  };

  const handleCanvasClick = (e) => {
    if (
      e.target.classList.contains("node") ||
      ["foreignObject", "INPUT", "line", "text"].includes(e.target.tagName)
    )
      return;

    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setNodes([...nodes, { id: nodeId, x, y }]);
    setNodeId(nodeId + 1);
  };

  const handleNodeClick = (id) => {
    if (selectedNode === null) {
      setSelectedNode(id);
    } else if (selectedNode !== id) {
      setEdges([...edges, { from: selectedNode, to: id, weight: 1 }]);
      setSelectedNode(null);
    } else {
      setSelectedNode(null);
    }
  };

  const handleMouseDown = (e, id) => {
    e.stopPropagation();
    setDraggingNodeId(id);
  };

  const handleMouseMove = (e) => {
    if (draggingNodeId !== null) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setNodes((prev) =>
        prev.map((n) => (n.id === draggingNodeId ? { ...n, x, y } : n))
      );
    }
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  const handleRightClick = (e, id) => {
    e.preventDefault(); // prevent context menu

    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) =>
      prev.filter((edge) => edge.from !== id && edge.to !== id)
    );
    setSelectedNode(null);
  };

  // Highlight edges and nodes in the shortest path
  useEffect(() => {
    if (!shortestPath || shortestPath.length < 2) {
      setHighlightedEdges([]);
      setHighlightedNodes([]);
      return;
    }

    setHighlightedEdges([]);
    setHighlightedNodes([]);

    const newEdges = [];
    const newNodes = [];

    shortestPath.forEach((nodeId, index) => {
      setTimeout(() => {
        if (index > 0) {
          newEdges.push({
            from: shortestPath[index - 1],
            to: nodeId,
          });
          setHighlightedEdges([...newEdges]);
        }
        newNodes.push(nodeId);
        setHighlightedNodes([...newNodes]);
      }, visualDelay * index); // speed: 300ms per node
    });
  }, [shortestPath, visualDelay]);

  return (
    <>
      <div className="flex justify-end p-2">
        <Button
          className="!bg-[#8ef3ec] !text-[#000] !hover:!bg-[#f1c550] !hover:!text-[#000] !rounded-full !px-4 !py-2 !text-sm"
          aria-describedby={id}
          type="button"
          onClick={handleClick}
        >
          Show Logs
        </Button>
        <Popper id={id} open={open} anchorEl={anchorEl} transition>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Box sx={{ border: 1, p: 1, bgcolor: "background.paper" }} className="w-[380px]">
                <TableContainer component={Paper} className="max-h-[400px] overflow-y-auto rounded-[.6rem]">
                  <Table
                    sx={{ minWidth: 300 }}
                    size="small"
                    aria-label="a dense table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell className="!font-[600]">Node</TableCell>
                        <TableCell align="center" className="!font-[600]">Distance</TableCell>
                        <TableCell align="center" className="!font-[600]">Parent</TableCell>
                        <TableCell align="center" className="!font-[600]">Neighbors</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow
                          key={row.Node}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {row.Node}
                          </TableCell>
                          <TableCell align="center">{row.Distance}</TableCell>
                          <TableCell align="center">{row.Parent}</TableCell>
                          <TableCell align="center">{row.Neighbors}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Fade>
          )}
        </Popper>
      </div>
      <div
        ref={canvasRef}
        className="w-full h-full bg-gray-100 relative overflow-hidden"
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="8"
              refX="10"
              refY="4"
              orient="auto"
              markerUnits="userSpaceOnUse"
            >
              <polygon points="0 0, 10 4, 0 8" fill="black" />
            </marker>
          </defs>
          {edges.map((edge, idx) => {
            const from = getNodeById(edge.from);
            const to = getNodeById(edge.to);
            if (!from || !to) return null;

            // Highlight logic for blinking edge
            let edgeColor = "black";
            let edgeWidth = 2;
            if (
              currentHighlight.edge &&
              ((edge.from === currentHighlight.edge.from &&
                edge.to === currentHighlight.edge.to) ||
                (!isDirected &&
                  edge.from === currentHighlight.edge.to &&
                  edge.to === currentHighlight.edge.from))
            ) {
              edgeColor = currentHighlight.blink ? "#ffe066" : "#f1c550";
              edgeWidth = 6;
            } else if (
              highlightedEdges.some(
                (e) =>
                  (e.from === edge.from && e.to === edge.to) ||
                  (e.from === edge.to && e.to === edge.from)
              )
            ) {
              edgeColor = "orange";
              edgeWidth = 4;
            }

            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;

            const nodeRadius = 15;
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const len = Math.sqrt(dx * dx + dy * dy);
            const offsetX = (dx * nodeRadius) / len;
            const offsetY = (dy * nodeRadius) / len;

            return (
              <g key={idx}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x - offsetX}
                  y2={to.y - offsetY}
                  stroke={edgeColor}
                  strokeWidth={edgeWidth}
                  style={{ pointerEvents: "all", cursor: "pointer" }}
                  onDoubleClick={() => setEditingEdge(idx)}
                  markerEnd={isDirected ? "url(#arrowhead)" : null}
                />

                {editingEdge === idx ? (
                  <foreignObject
                    x={midX - 15}
                    y={midY - 10}
                    width="30"
                    height="20"
                    style={{ pointerEvents: "all" }}
                  >
                    <input
                      autoFocus
                      type="number"
                      defaultValue={edge.weight}
                      className="w-full h-full text-center text-xs border border-gray-400 rounded-sm outline-none bg-white"
                      onBlur={(e) => handleWeightChange(idx, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          handleWeightChange(idx, e.target.value);
                      }}
                    />
                  </foreignObject>
                ) : (
                  <text
                    x={midX}
                    y={midY}
                    className="transition-transform duration-200 hover:scale-110 cursor-pointer"
                    onDoubleClick={() => setEditingEdge(idx)}
                    fill="red"
                    fontSize="14"
                    fontWeight="bold"
                    textAnchor="middle"
                    style={{ pointerEvents: "all" }}
                  >
                    {edge.weight}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {nodes.map((node) => {
          // Highlight logic for blinking node and neighbors
          let nodeClass = "";
          if (currentHighlight.node === node.id) {
            nodeClass = currentHighlight.blink
              ? "bg-[#f5f198] animate-pulse"
              : "bg-[#f5eb26]";
          } else if (
            currentHighlight.neighbors &&
            currentHighlight.neighbors.includes(node.id)
          ) {
            nodeClass = "bg-[#fc84c9]";
          } else if (highlightedNodes.includes(node.id)) {
            nodeClass = "bg-[#f95b06]";
          } else if (selectedNode === node.id) {
            nodeClass = "bg-[#4cf181]";
          } else {
            nodeClass = "bg-[#007bff] hover:bg-[#0056b3] hover:scale-110";
          }

          return (
            <div
              key={node.id}
              className={`node absolute w-[30px] h-[30px] rounded-full flex items-center justify-center text-white font-bold cursor-pointer transition-all duration-300 select-none ${nodeClass}`}
              style={{
                top: node.y - 15 + "px",
                left: node.x - 15 + "px",
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleNodeClick(node.id);
              }}
              onContextMenu={(e) => handleRightClick(e, node.id)}
              onMouseDown={(e) => handleMouseDown(e, node.id)}
              onDoubleClick={() =>
                onNodeDoubleClick && onNodeDoubleClick(node.id)
              }
            >
              {node.id}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default GraphCanvas;
