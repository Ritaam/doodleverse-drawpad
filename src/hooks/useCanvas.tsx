
import { useState, useRef, useEffect, MouseEvent, RefObject } from 'react';
import { toast } from "sonner";

type Tool = 'pen' | 'pencil' | 'eraser' | 'square' | 'circle' | 'text' | 'arrow';

type DrawingAction = {
  tool: Tool;
  color: string;
  width: number;
  points?: { x: number; y: number }[];
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  text?: string;
  textX?: number;
  textY?: number;
};

type Position = {
  x: number;
  y: number;
};

export const useCanvas = (canvasRef: RefObject<HTMLCanvasElement>) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeTool, setActiveTool] = useState<Tool>('pen');
  const [activeColor, setActiveColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [drawingHistory, setDrawingHistory] = useState<DrawingAction[]>([]);
  const [redoStack, setRedoStack] = useState<DrawingAction[]>([]);
  const [textInput, setTextInput] = useState('');
  const [textPosition, setTextPosition] = useState<Position | null>(null);
  
  const currentAction = useRef<DrawingAction | null>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);

  // Initialize canvas context
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    ctx.current = canvas.getContext('2d');
    
    if (ctx.current) {
      ctx.current.lineCap = 'round';
      ctx.current.lineJoin = 'round';
    }
    
    // Set canvas size to match its display size
    const resizeCanvas = () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      
      // Set the canvas width and height to match its display size
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Redraw canvas after resize
      drawCanvas();
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    toast("Whiteboard ready!", {
      description: "Start drawing by selecting a tool from the toolbar.",
      duration: 3000,
    });
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  // Draw all actions on canvas
  const drawCanvas = () => {
    if (!ctx.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    ctx.current.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw white background
    ctx.current.fillStyle = '#FFFFFF';
    ctx.current.fillRect(0, 0, canvas.width, canvas.height);
    
    drawingHistory.forEach(action => {
      drawAction(action);
    });
  };
  
  const drawAction = (action: DrawingAction) => {
    if (!ctx.current) return;
    
    ctx.current.strokeStyle = action.color;
    ctx.current.lineWidth = action.width;
    
    switch (action.tool) {
      case 'pen':
      case 'pencil':
        if (!action.points || action.points.length < 2) return;
        
        ctx.current.beginPath();
        ctx.current.moveTo(action.points[0].x, action.points[0].y);
        
        for (let i = 1; i < action.points.length; i++) {
          ctx.current.lineTo(action.points[i].x, action.points[i].y);
        }
        
        if (action.tool === 'pencil') {
          ctx.current.globalAlpha = 0.7; // Lighter opacity for pencil
        } else {
          ctx.current.globalAlpha = 1;
        }
        
        ctx.current.stroke();
        ctx.current.globalAlpha = 1;
        break;
        
      case 'eraser':
        if (!action.points || action.points.length < 2) return;
        
        ctx.current.globalCompositeOperation = 'destination-out';
        ctx.current.beginPath();
        ctx.current.moveTo(action.points[0].x, action.points[0].y);
        
        for (let i = 1; i < action.points.length; i++) {
          ctx.current.lineTo(action.points[i].x, action.points[i].y);
        }
        
        ctx.current.stroke();
        ctx.current.globalCompositeOperation = 'source-over';
        break;
        
      case 'square':
        if (action.startX === undefined || action.startY === undefined || 
            action.endX === undefined || action.endY === undefined) return;
        
        const width = action.endX - action.startX;
        const height = action.endY - action.startY;
        
        ctx.current.beginPath();
        ctx.current.rect(action.startX, action.startY, width, height);
        ctx.current.stroke();
        break;
        
      case 'circle':
        if (action.startX === undefined || action.startY === undefined || 
            action.endX === undefined || action.endY === undefined) return;
        
        const radiusX = Math.abs(action.endX - action.startX) / 2;
        const radiusY = Math.abs(action.endY - action.startY) / 2;
        const centerX = Math.min(action.startX, action.endX) + radiusX;
        const centerY = Math.min(action.startY, action.endY) + radiusY;
        
        ctx.current.beginPath();
        ctx.current.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        ctx.current.stroke();
        break;
        
      case 'text':
        if (!action.text || action.textX === undefined || action.textY === undefined) return;
        
        ctx.current.font = `${action.width * 5}px Inter, sans-serif`;
        ctx.current.fillStyle = action.color;
        ctx.current.fillText(action.text, action.textX, action.textY);
        break;
        
      case 'arrow':
        if (action.startX === undefined || action.startY === undefined || 
            action.endX === undefined || action.endY === undefined) return;
        
        // Draw line
        ctx.current.beginPath();
        ctx.current.moveTo(action.startX, action.startY);
        ctx.current.lineTo(action.endX, action.endY);
        ctx.current.stroke();
        
        // Draw arrowhead
        const angle = Math.atan2(action.endY - action.startY, action.endX - action.startX);
        const arrowLength = 15;
        
        ctx.current.beginPath();
        ctx.current.moveTo(action.endX, action.endY);
        ctx.current.lineTo(
          action.endX - arrowLength * Math.cos(angle - Math.PI / 6),
          action.endY - arrowLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.current.moveTo(action.endX, action.endY);
        ctx.current.lineTo(
          action.endX - arrowLength * Math.cos(angle + Math.PI / 6),
          action.endY - arrowLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.current.stroke();
        break;
    }
  };
  
  const startDrawing = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (activeTool === 'text') {
      setTextPosition({ x, y });
      return;
    }
    
    setIsDrawing(true);
    
    currentAction.current = {
      tool: activeTool,
      color: activeColor,
      width: strokeWidth,
    };
    
    switch (activeTool) {
      case 'pen':
      case 'pencil':
      case 'eraser':
        currentAction.current.points = [{ x, y }];
        break;
        
      case 'square':
      case 'circle':
      case 'arrow':
        currentAction.current.startX = x;
        currentAction.current.startY = y;
        break;
    }
    
    setRedoStack([]);
  };
  
  const draw = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current || !currentAction.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    switch (activeTool) {
      case 'pen':
      case 'pencil':
      case 'eraser':
        if (!currentAction.current.points) {
          currentAction.current.points = [];
        }
        currentAction.current.points.push({ x, y });
        
        if (!ctx.current) return;
        
        // Draw the current stroke in real-time
        ctx.current.strokeStyle = activeTool === 'eraser' ? '#FFFFFF' : activeColor;
        ctx.current.lineWidth = strokeWidth;
        
        if (activeTool === 'eraser') {
          ctx.current.globalCompositeOperation = 'destination-out';
        } else if (activeTool === 'pencil') {
          ctx.current.globalAlpha = 0.7;
        }
        
        if (currentAction.current.points.length >= 2) {
          const lastIndex = currentAction.current.points.length - 1;
          
          ctx.current.beginPath();
          ctx.current.moveTo(
            currentAction.current.points[lastIndex - 1].x,
            currentAction.current.points[lastIndex - 1].y
          );
          ctx.current.lineTo(
            currentAction.current.points[lastIndex].x,
            currentAction.current.points[lastIndex].y
          );
          ctx.current.stroke();
        }
        
        if (activeTool === 'eraser') {
          ctx.current.globalCompositeOperation = 'source-over';
        } else if (activeTool === 'pencil') {
          ctx.current.globalAlpha = 1;
        }
        break;
        
      case 'square':
      case 'circle':
      case 'arrow':
        // Store the current end point
        currentAction.current.endX = x;
        currentAction.current.endY = y;
        
        // Redraw the canvas with the current shape
        drawCanvas();
        drawAction(currentAction.current);
        break;
    }
  };
  
  const stopDrawing = () => {
    if (!isDrawing || !currentAction.current) return;
    
    // Add the completed action to history
    setDrawingHistory(prevHistory => [...prevHistory, { ...currentAction.current! }]);
    
    setIsDrawing(false);
    currentAction.current = null;
  };
  
  const handleTextInputChange = (text: string) => {
    setTextInput(text);
  };
  
  const addTextToCanvas = () => {
    if (!textInput || !textPosition) return;
    
    const textAction: DrawingAction = {
      tool: 'text',
      color: activeColor,
      width: strokeWidth,
      text: textInput,
      textX: textPosition.x,
      textY: textPosition.y,
    };
    
    setDrawingHistory(prevHistory => [...prevHistory, textAction]);
    drawAction(textAction);
    
    // Reset text state
    setTextInput('');
    setTextPosition(null);
  };
  
  const cancelTextInput = () => {
    setTextInput('');
    setTextPosition(null);
  };
  
  const undo = () => {
    if (drawingHistory.length === 0) return;
    
    const lastAction = drawingHistory[drawingHistory.length - 1];
    setRedoStack(prevStack => [...prevStack, lastAction]);
    
    setDrawingHistory(prevHistory => prevHistory.slice(0, -1));
    drawCanvas();
  };
  
  const redo = () => {
    if (redoStack.length === 0) return;
    
    const action = redoStack[redoStack.length - 1];
    setDrawingHistory(prevHistory => [...prevHistory, action]);
    
    setRedoStack(prevStack => prevStack.slice(0, -1));
  };
  
  const clearCanvas = () => {
    setDrawingHistory([]);
    setRedoStack([]);
    
    if (!ctx.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    ctx.current.clearRect(0, 0, canvas.width, canvas.height);
    ctx.current.fillStyle = '#FFFFFF';
    ctx.current.fillRect(0, 0, canvas.width, canvas.height);
    
    toast("Canvas cleared!", {
      duration: 2000,
    });
  };
  
  useEffect(() => {
    drawCanvas();
  }, [drawingHistory]);
  
  return {
    activeTool,
    setActiveTool,
    activeColor,
    setActiveColor,
    strokeWidth,
    setStrokeWidth,
    textInput,
    textPosition,
    handleTextInputChange,
    addTextToCanvas,
    cancelTextInput,
    startDrawing,
    draw,
    stopDrawing,
    undo,
    redo,
    clearCanvas,
    canUndo: drawingHistory.length > 0,
    canRedo: redoStack.length > 0
  };
};
