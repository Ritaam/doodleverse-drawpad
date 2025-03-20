
import React, { useRef, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCanvas } from "@/hooks/useCanvas";

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
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
    canUndo,
    canRedo
  } = useCanvas(canvasRef);

  return (
    <>
      <div className="canvas-container animate-fade-in">
        <canvas
          ref={canvasRef}
          className="w-full h-full touch-none cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
      
      <Dialog open={!!textPosition} onOpenChange={(open) => !open && cancelTextInput()}>
        <DialogContent className="sm:max-w-md glass-panel animate-scale-in">
          <DialogHeader>
            <DialogTitle>Add Text</DialogTitle>
          </DialogHeader>
          <Input
            value={textInput}
            onChange={(e) => handleTextInputChange(e.target.value)}
            placeholder="Enter your text here..."
            className="mt-2"
            autoFocus
          />
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={cancelTextInput}>Cancel</Button>
            <Button onClick={addTextToCanvas}>Add Text</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
