
import React from 'react';
import { Toolbar } from '@/components/Toolbar';
import { ColorPicker } from '@/components/ColorPicker';
import { Canvas } from '@/components/Canvas';
import { useCanvas } from '@/hooks/useCanvas';
import { useRef } from 'react';

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    activeTool,
    setActiveTool,
    activeColor,
    setActiveColor,
    strokeWidth,
    setStrokeWidth,
    undo,
    redo,
    clearCanvas,
    canUndo,
    canRedo
  } = useCanvas(canvasRef);

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="w-full mb-6 animate-fade-in">
        <div className="container">
          <h1 className="text-3xl font-light tracking-tight text-center">
            <span className="font-medium">White</span>board
          </h1>
          <p className="text-muted-foreground text-sm text-center mt-1">A minimalist drawing canvas</p>
        </div>
      </header>
      
      <main className="flex-1 container flex">
        <div className="hidden md:block mr-4">
          <Toolbar
            activeTool={activeTool}
            onToolChange={setActiveTool}
            onUndo={undo}
            onRedo={redo}
            onClear={clearCanvas}
            canUndo={canUndo}
            canRedo={canRedo}
          />
        </div>
        
        <div className="flex-1 flex flex-col">
          <div className="h-full relative">
            <Canvas />
          </div>
        </div>
        
        <div className="hidden md:block ml-4">
          <ColorPicker
            activeColor={activeColor}
            onColorChange={setActiveColor}
            strokeWidth={strokeWidth}
            onStrokeWidthChange={setStrokeWidth}
          />
        </div>
      </main>
      
      <div className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4 glass-panel p-2 rounded-full animate-scale-in">
        <Toolbar
          activeTool={activeTool}
          onToolChange={setActiveTool}
          onUndo={undo}
          onRedo={redo}
          onClear={clearCanvas}
          canUndo={canUndo}
          canRedo={canRedo}
        />
        <ColorPicker
          activeColor={activeColor}
          onColorChange={setActiveColor}
          strokeWidth={strokeWidth}
          onStrokeWidthChange={setStrokeWidth}
        />
      </div>
    </div>
  );
};

export default Index;
