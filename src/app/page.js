"use client"
import React, { useCallback } from 'react';


import Header from './components/Header';
import '../app/styles/index.scss';

import ReactFlow, { Handle, Position, useNodesState, useEdgesState, addEdge } from 'reactflow';
import 'reactflow/dist/style.css';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { useState, useEffect } from 'react';
import { debounce } from 'lodash';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const nodeTypes = [{ label: 'Message' }];


// Define your custom node component
const CustomNode = ({ data }) => {
  
  return (
    <div className='custom-node'>
      <div className='node-header'>
         Send Message
      </div>
      <div className='node-body'>
        {data?.label}
      </div>
      {/* Left handle */}
      <Handle
        type="source"
        position={Position.Left}
        style={{ background: '#555' }}
      />
      {/* Right handle */}
      <Handle
        type="target"
        position={Position.Right}
        style={{ background: '#555' }}
      />
    </div>
  );
};

// Define the initial nodes and edges
const initialNodes = [
  {
    id: '1',
    position: { x: 250, y: 0 },
    data: { label: 'Text message 1' },
    type: "customNode"
  },
];

const initialEdges = [];

 
export default function App() {

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState('');
  const [message, setMessage] = useState('');

  const onNodeClick = (node) => {
      console.log(node, "node")
      alert("adfsdfs")
  }
 
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );
  const handleDragEnd = (result) => {
      
       setNodes([...nodes, 
        {
          id: String(nodes?.length + 1),
          type: 'customNode', // Type should match the custom node type
          position: { x: mousePosition.x, y: mousePosition.y },
          data: { label: `Text message ${nodes?.length + 1}` },
        },
       ])
  }

  useEffect(() => {
      if (!selectedNodeId) return;
      const selectedNode = nodes.find((item) => item.id === selectedNodeId);
      setMessage(selectedNode?.data?.label);
  }, [selectedNodeId])

  useEffect(() => {
    const handleMouseMove = debounce((event) => {
      let rec = event.target.getBoundingClientRect();
      setMousePosition({ x: event.clientX - rec.x , y: event.clientY - rec.y });
    }, 100);

    window.addEventListener('mouseover', handleMouseMove);
    return () => {
      window.removeEventListener('mouseover', handleMouseMove);
    };
  }, []);

  const handleClick = () => {
      const newNodes = nodes.map((item)=> {
        return {
           ...item,
           data: item.id === selectedNodeId ? { label: message } : item.data,
        }
      })
      setNodes(newNodes);
      setSelectedNodeId(null)
  }

  const onError  = () => {
     toast("Cannot save flow");
  }

  console.log(edges, "edges")
  console.log(nodes, "nodes")

  const handleClick2 = () => {
     const nodemap = {};

     edges.forEach((obj) => {
        nodemap[obj.source] = true;
        nodemap[obj.target] = true;
     })
     let count = 0;
     nodes.forEach((item) => {
       if (!nodemap[item.id]) {
         count++;
       }
     })
     if (count > 1) {
       toast.error('Cannot save changes');
       return;
     }
  }
 
  return (
     <DragDropContext onDragEnd={handleDragEnd}>
        <Header buttonText='Save Changes' handleClick={!selectedNodeId ? handleClick2 : handleClick} onError={onError}/>
            <div className='react-flow-main'>
            <Droppable droppableId='droppable-1'>
            {
              (provided) => (
                <div className='react-flow-main-left' ref={provided.innerRef} {...provided.droppableProps}> 

                 <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onPaneClick={() => { setSelectedNodeId(null); }}
                  onNodeClick={(data) => { console.log(data.target.getAttribute('data-id'), "data")
                     setSelectedNodeId(data.target.getAttribute('data-id'));
                  }}
                  onElementClick={() => {
                     alert("sdfds")
                  }}
                  onConnect={onConnect}
                   style={{ backgroundColor: '#ffffff' }}
                  />
                </div>
              )
            }
            </Droppable>
            <Droppable droppableId='droppable-2'>
                {
                  (provided) => (
                    <div className='react-flow-main-right' {...provided.droppableProps} ref={provided.innerRef}>
                       <Draggable draggableId='draggable-1'>
                       {!selectedNodeId ? (provided) => (
                         nodeTypes.map((item) => (
                          <div className='message-container' ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
                             {item.label}
                          </div>
                         ))
                       ) : () => <div> 
                          <textarea value={message} onChange={(e)=> { setMessage(e.target.value) }} style={{ background: 'white', color: 'black' }}/>
                        </div>}
                       </Draggable>
                       {provided.placeholder}
                    </div>
                  )
                }
            </Droppable>
            </div>
            <ToastContainer/>
     </DragDropContext>
  );
}
