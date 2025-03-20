
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Pen, Pencil, Eraser, Square, Circle, Type, ArrowUpRight, Undo2, Redo2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Tool = 'pen' | 'pencil' | 'eraser' | 'square' | 'circle' | 'text' | 'arrow';

interface ToolbarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTool,
  onToolChange,
  onUndo,
  onRedo,
  onClear,
  canUndo,
  canRedo
}) => {
  const tools = [
    { id: 'pen' as Tool, icon: <Pen size={20} />, label: 'Pen' },
    { id: 'pencil' as Tool, icon: <Pencil size={20} />, label: 'Pencil' },
    { id: 'eraser' as Tool, icon: <Eraser size={20} />, label: 'Eraser' },
    { id: 'square' as Tool, icon: <Square size={20} />, label: 'Square' },
    { id: 'circle' as Tool, icon: <Circle size={20} />, label: 'Circle' },
    { id: 'text' as Tool, icon: <Type size={20} />, label: 'Text' },
    { id: 'arrow' as Tool, icon: <ArrowUpRight size={20} />, label: 'Arrow' },
  ];

  return (
    <div className="glass-panel p-3 rounded-xl flex flex-col gap-3 animate-fade-in">
      <div className="flex flex-col gap-2">
        {tools.map((tool) => (
          <Tooltip key={tool.id}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn("tool-button transition-all", activeTool === tool.id && "active")}
                onClick={() => onToolChange(tool.id)}
                aria-label={tool.label}
              >
                {tool.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="animate-fade-in">
              {tool.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      
      <Separator />
      
      <div className="flex flex-col gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="tool-button"
              onClick={onUndo}
              disabled={!canUndo}
              aria-label="Undo"
            >
              <Undo2 size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="animate-fade-in">
            Undo
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="tool-button"
              onClick={onRedo}
              disabled={!canRedo}
              aria-label="Redo"
            >
              <Redo2 size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="animate-fade-in">
            Redo
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="tool-button text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={onClear}
              aria-label="Clear Canvas"
            >
              <Trash2 size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="animate-fade-in">
            Clear Canvas
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
