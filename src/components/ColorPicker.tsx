
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { PaintBucket } from "lucide-react";

interface ColorPickerProps {
  activeColor: string;
  onColorChange: (color: string) => void;
  strokeWidth: number;
  onStrokeWidthChange: (width: number) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  activeColor,
  onColorChange,
  strokeWidth,
  onStrokeWidthChange
}) => {
  const colors = [
    '#000000', // Black
    '#555555', // Dark Gray
    '#0C63E7', // Blue
    '#3DD5F3', // Light Blue
    '#28A745', // Green
    '#FFC107', // Yellow
    '#DC3545', // Red
    '#6F42C1', // Purple
    '#FD7E14', // Orange
    '#E83E8C', // Pink
    '#FFFFFF', // White
  ];

  return (
    <div className="glass-panel p-3 rounded-xl animate-fade-in">
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-secondary transition-all"
            style={{ backgroundColor: activeColor === '#FFFFFF' ? '#F8F9FA' : activeColor }}
            aria-label="Select Color"
          >
            <PaintBucket size={20} className={activeColor === '#000000' ? 'text-white' : 'text-black'} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 glass-panel animate-scale-in rounded-xl p-4" align="start" side="right">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {colors.map((color) => (
                <button
                  key={color}
                  className={cn(
                    "color-swatch", 
                    activeColor === color && "active",
                    color === '#FFFFFF' && "border-border"
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => onColorChange(color)}
                  aria-label={`Select ${color} color`}
                />
              ))}
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Stroke Width</p>
              <Slider
                value={[strokeWidth]}
                min={1}
                max={20}
                step={1}
                onValueChange={(value) => onStrokeWidthChange(value[0])}
                className="py-2"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
