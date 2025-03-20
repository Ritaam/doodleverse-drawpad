
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { PlusCircle, LogOut, Trash2 } from 'lucide-react';

type SavedDrawing = {
  id: string;
  name: string;
  thumbnail: string;
  createdAt: number;
};

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [drawings, setDrawings] = useState<SavedDrawing[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      // Load saved drawings from localStorage
      const savedDrawings = localStorage.getItem(`drawings_${user?.id}`);
      if (savedDrawings) {
        try {
          setDrawings(JSON.parse(savedDrawings));
        } catch (e) {
          console.error('Failed to parse saved drawings:', e);
        }
      }
    }
  }, [isAuthenticated, user]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  const handleNewDrawing = () => {
    navigate('/whiteboard/new');
  };
  
  const handleOpenDrawing = (drawingId: string) => {
    navigate(`/whiteboard/${drawingId}`);
  };
  
  const handleDeleteDrawing = (drawingId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedDrawings = drawings.filter(drawing => drawing.id !== drawingId);
    setDrawings(updatedDrawings);
    localStorage.setItem(`drawings_${user?.id}`, JSON.stringify(updatedDrawings));
    toast.success("Drawing deleted successfully");
  };
  
  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="container flex justify-between items-center mb-8">
        <h1 className="text-3xl font-light tracking-tight">
          <span className="font-medium">White</span>board
        </h1>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground mr-2">
            Hello, {user?.name}
          </span>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>
      </header>
      
      <main className="container">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-medium">Your Drawings</h2>
          <Button onClick={handleNewDrawing}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Drawing
          </Button>
        </div>
        
        {drawings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-muted-foreground mb-4">You don't have any saved drawings yet</p>
            <Button onClick={handleNewDrawing}>Create your first drawing</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {drawings.map((drawing) => (
              <div
                key={drawing.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleOpenDrawing(drawing.id)}
              >
                <div className="aspect-video bg-slate-100 relative">
                  <img
                    src={drawing.thumbnail}
                    alt={drawing.name}
                    className="w-full h-full object-contain"
                  />
                  <button
                    className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full hover:bg-red-50 transition-colors"
                    onClick={(e) => handleDeleteDrawing(drawing.id, e)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
                <div className="p-3">
                  <p className="font-medium truncate">{drawing.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(drawing.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
