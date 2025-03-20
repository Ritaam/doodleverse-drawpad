
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Toolbar } from '@/components/Toolbar';
import { ColorPicker } from '@/components/ColorPicker';
import { Canvas } from '@/components/Canvas';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Save, ArrowLeft, Download } from 'lucide-react';

const WhiteboardPage = () => {
  const { drawingId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [drawingName, setDrawingName] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isNewDrawing] = useState(drawingId === 'new');

  useEffect(() => {
    // Load drawing if existing
    if (isAuthenticated && drawingId && drawingId !== 'new') {
      const savedDrawings = localStorage.getItem(`drawings_${user?.id}`);
      if (savedDrawings) {
        try {
          const drawings = JSON.parse(savedDrawings);
          const drawing = drawings.find((d: any) => d.id === drawingId);
          if (drawing) {
            setDrawingName(drawing.name);
            // Load drawing content - this would be handled by the Canvas component
          }
        } catch (e) {
          console.error('Failed to load drawing:', e);
          toast.error("Failed to load drawing");
        }
      }
    }
  }, [drawingId, isAuthenticated, user]);

  const handleSave = () => {
    if (!canvasRef.current || !user) return;
    
    // Generate a thumbnail from the canvas
    const canvas = canvasRef.current;
    const thumbnail = canvas.toDataURL('image/png');
    
    // Save drawing to localStorage
    const newDrawing = {
      id: drawingId === 'new' ? Math.random().toString(36).substring(2, 9) : drawingId,
      name: drawingName || 'Untitled Drawing',
      thumbnail,
      createdAt: Date.now(),
      // In a real app, you'd save the full drawing data here
    };
    
    const savedDrawings = localStorage.getItem(`drawings_${user.id}`);
    let drawings = [];
    
    if (savedDrawings) {
      drawings = JSON.parse(savedDrawings);
      const existingIndex = drawings.findIndex((d: any) => d.id === newDrawing.id);
      if (existingIndex >= 0) {
        drawings[existingIndex] = newDrawing;
      } else {
        drawings.push(newDrawing);
      }
    } else {
      drawings = [newDrawing];
    }
    
    localStorage.setItem(`drawings_${user.id}`, JSON.stringify(drawings));
    toast.success("Drawing saved successfully!");
    setSaveDialogOpen(false);
    
    if (isNewDrawing) {
      navigate(`/whiteboard/${newDrawing.id}`, { replace: true });
    }
  };

  const handleExport = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const downloadLink = document.createElement('a');
    downloadLink.download = `${drawingName || 'whiteboard'}.png`;
    downloadLink.href = canvas.toDataURL('image/png');
    downloadLink.click();
    toast.success("Drawing exported as PNG");
  };

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="w-full mb-6 animate-fade-in flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-xl font-medium ml-2">{drawingName || 'Untitled Drawing'}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button size="sm" onClick={() => setSaveDialogOpen(true)}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </header>
      
      <main className="flex-1 container flex">
        <div className="hidden md:block mr-4">
          <Toolbar />
        </div>
        
        <div className="flex-1 flex flex-col">
          <div className="h-full relative">
            <Canvas canvasRef={canvasRef} />
          </div>
        </div>
        
        <div className="hidden md:block ml-4">
          <ColorPicker />
        </div>
      </main>
      
      <div className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4 glass-panel p-2 rounded-full animate-scale-in">
        <Toolbar />
        <ColorPicker />
      </div>
      
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save your drawing</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={drawingName}
              onChange={(e) => setDrawingName(e.target.value)}
              placeholder="Enter a name for your drawing"
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Drawing</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WhiteboardPage;
