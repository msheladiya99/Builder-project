import { useState, useEffect } from "react";
import { ArrowLeft, Layers, Plus, ChevronDown, Check, Home, AlertCircle, Edit2, Trash2, X } from "lucide-react";
import { ProjectView } from "./ProjectManagementModule";
import { useProjects, Tower } from "./ProjectContext";

interface TowerManagementProps {
  projectId: string;
  onNavigate: (view: ProjectView, projectId?: string) => void;
}

const mockTowers = [
  {
    id: "T-A",
    name: "Tower A",
    status: "Under Construction",
    floors: 14,
    unitsPerFloor: 4,
    progress: 85,
    wings: ["Wing A1", "Wing A2"],
    completion: "Oct 2024"
  },
  {
    id: "T-B",
    name: "Tower B",
    status: "Foundation",
    floors: 14,
    unitsPerFloor: 4,
    progress: 25,
    wings: ["Wing B1"],
    completion: "May 2025"
  },
  {
    id: "T-C",
    name: "Tower C (Commercial)",
    status: "Planning",
    floors: 7,
    unitsPerFloor: 8,
    progress: 0,
    wings: [],
    completion: "Dec 2025"
  }
];

export function TowerManagement({ projectId, onNavigate }: TowerManagementProps) {
  const { getProject, addTower, deleteTower, updateTower } = useProjects();
  const project = getProject(projectId);
  
  const towers = project?.towers || [];
  const [selectedTower, setSelectedTower] = useState<string | null>(null);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTower, setNewTower] = useState({
    name: "", status: "Planning", floors: 10, unitsPerFloor: 4, wings: "Wing A", progress: 0, completion: "Dec 2025"
  });

  const [editingTowerId, setEditingTowerId] = useState<string | null>(null);
  const [editTowerForm, setEditTowerForm] = useState<{
    name: string;
    status: string;
    floors: number;
    unitsPerFloor: number;
    wings: string;
    progress: number;
    completion: string;
  } | null>(null);

  useEffect(() => {
    if (towers.length > 0 && !selectedTower) {
      setSelectedTower(towers[0].id);
    }
  }, [towers, selectedTower]);

  const handleAddTower = () => {
    if (!newTower.name.trim()) return;
    addTower(projectId, {
      ...newTower,
      wings: newTower.wings.split(',').map(w => w.trim()).filter(Boolean)
    });
    setShowAddForm(false);
    setNewTower({ name: "", status: "Planning", floors: 10, unitsPerFloor: 4, wings: "Wing A", progress: 0, completion: "Dec 2025" });
  };

  const handleStartEdit = (tower: Tower) => {
    setEditingTowerId(tower.id);
    setEditTowerForm({
      name: tower.name,
      status: tower.status,
      floors: tower.floors,
      unitsPerFloor: tower.unitsPerFloor,
      wings: tower.wings.join(", "),
      progress: tower.progress,
      completion: tower.completion
    });
  };

  const handleSaveEdit = (towerId: string) => {
    if (!editTowerForm || !editTowerForm.name.trim()) return;
    updateTower(projectId, towerId, {
      name: editTowerForm.name,
      status: editTowerForm.status,
      floors: editTowerForm.floors,
      unitsPerFloor: editTowerForm.unitsPerFloor,
      wings: editTowerForm.wings.split(',').map(w => w.trim()).filter(Boolean),
      progress: editTowerForm.progress,
      completion: editTowerForm.completion
    });
    setEditingTowerId(null);
    setEditTowerForm(null);
  };

  const handleCancelEdit = () => {
    setEditingTowerId(null);
    setEditTowerForm(null);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate("overview", projectId)}
            className="p-2 border border-border rounded-lg bg-card hover:bg-muted transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tower & Wing Management</h1>
            <p className="text-sm text-muted-foreground">Configure structural details for {project?.name || "Project"}</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Add Tower
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6 bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Add New Tower</h3>
            <button onClick={() => setShowAddForm(false)} className="text-muted-foreground hover:text-foreground"><X size={20}/></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Tower Name</label>
              <input type="text" value={newTower.name} onChange={e => setNewTower({...newTower, name: e.target.value})} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" placeholder="e.g. Tower A" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Status</label>
              <select value={newTower.status} onChange={e => setNewTower({...newTower, status: e.target.value})} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
                <option>Planning</option>
                <option>Foundation</option>
                <option>Under Construction</option>
                <option>Completed</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Total Floors</label>
              <input type="number" value={newTower.floors} onChange={e => setNewTower({...newTower, floors: parseInt(e.target.value) || 0})} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Units per Floor</label>
              <input type="number" value={newTower.unitsPerFloor} onChange={e => setNewTower({...newTower, unitsPerFloor: parseInt(e.target.value) || 0})} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setShowAddForm(false)} className="px-4 py-2 text-sm text-muted-foreground">Cancel</button>
            <button 
              onClick={handleAddTower} 
              disabled={!newTower.name.trim()}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                newTower.name.trim() ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              Save Tower
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tower List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="font-semibold text-sm mb-3">Structures</h3>
          {towers.length === 0 ? (
            <div className="text-center p-6 border border-dashed rounded-xl text-muted-foreground text-sm">
              No towers added yet. Click Add Tower to begin.
            </div>
          ) : (
            towers.map(tower => (
              <div 
                key={tower.id}
                onClick={() => setSelectedTower(tower.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedTower === tower.id 
                    ? "bg-primary/5 border-primary shadow-sm" 
                    : "bg-card border-border hover:border-primary/50"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold flex items-center gap-2">
                    <Layers size={16} className={selectedTower === tower.id ? "text-primary" : "text-muted-foreground"} />
                    {tower.name}
                  </h4>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide ${
                    tower.status === "Planning" ? "bg-info/10 text-info" :
                    tower.status === "Foundation" ? "bg-warning/10 text-warning" :
                    "bg-success/10 text-success"
                  }`}>
                    {tower.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                  <span>{tower.floors} Floors</span>
                  <span>{tower.unitsPerFloor} Units/fl</span>
                  <span>{tower.wings.length} Wings</span>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span>Progress</span>
                    <span className="font-bold">{tower.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${tower.progress}%` }} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Tower Details */}
        <div className="lg:col-span-2 space-y-6">
          {towers.filter(t => t.id === selectedTower).map(tower => (
            <div key={tower.id} className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
                <div>
                  <h2 className="text-xl font-bold">{tower.name} Details</h2>
                  <p className="text-sm text-muted-foreground">Manage units, floors and inventory</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleStartEdit(tower)}
                    className={`p-2 rounded-lg transition-colors ${
                      editingTowerId === tower.id 
                        ? "bg-primary/10 text-primary hover:bg-primary/20" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => {
                      deleteTower(projectId, tower.id);
                      setSelectedTower(null);
                    }} 
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {editingTowerId === tower.id && editTowerForm ? (
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Tower Name</label>
                      <input 
                        type="text" 
                        value={editTowerForm.name} 
                        onChange={e => setEditTowerForm({...editTowerForm, name: e.target.value})} 
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                        placeholder="e.g. Tower A" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Status</label>
                      <select 
                        value={editTowerForm.status} 
                        onChange={e => setEditTowerForm({...editTowerForm, status: e.target.value})} 
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        <option>Planning</option>
                        <option>Foundation</option>
                        <option>Under Construction</option>
                        <option>Completed</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Total Floors</label>
                      <input 
                        type="number" 
                        value={editTowerForm.floors} 
                        onChange={e => setEditTowerForm({...editTowerForm, floors: parseInt(e.target.value) || 0})} 
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Units per Floor</label>
                      <input 
                        type="number" 
                        value={editTowerForm.unitsPerFloor} 
                        onChange={e => setEditTowerForm({...editTowerForm, unitsPerFloor: parseInt(e.target.value) || 0})} 
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Wings (comma separated)</label>
                      <input 
                        type="text" 
                        value={editTowerForm.wings} 
                        onChange={e => setEditTowerForm({...editTowerForm, wings: e.target.value})} 
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                        placeholder="e.g. Wing A1, Wing A2" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Progress (%)</label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={editTowerForm.progress} 
                          onChange={e => setEditTowerForm({...editTowerForm, progress: parseInt(e.target.value) || 0})} 
                          className="flex-1 accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer" 
                        />
                        <span className="text-sm font-bold w-12 text-right">{editTowerForm.progress}%</span>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Expected Completion</label>
                      <input 
                        type="text" 
                        value={editTowerForm.completion} 
                        onChange={e => setEditTowerForm({...editTowerForm, completion: e.target.value})} 
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                        placeholder="e.g. Dec 2025" 
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-border">
                    <button 
                      onClick={handleCancelEdit} 
                      className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleSaveEdit(tower.id)} 
                      disabled={!editTowerForm.name.trim()}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        editTowerForm.name.trim() 
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm" 
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      }`}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Total Floors</p>
                      <p className="text-lg font-bold">{tower.floors}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Units per Floor</p>
                      <p className="text-lg font-bold">{tower.unitsPerFloor}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Total Inventory</p>
                      <p className="text-lg font-bold">{tower.floors * tower.unitsPerFloor}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Expected Completion</p>
                      <p className="text-lg font-bold">{tower.completion}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm">Floor Plan Grid (Mock)</h3>
                      <div className="flex gap-3 text-xs">
                        <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-success/20 border border-success" /> Sold</span>
                        <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-background border border-border" /> Available</span>
                        <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-warning/20 border border-warning" /> Hold</span>
                      </div>
                    </div>

                    <div className="border border-border rounded-lg p-4 bg-muted/10 overflow-x-auto">
                      <div className="min-w-[400px] space-y-2">
                        {/* Generating a mock grid for floors */}
                        {Array.from({ length: Math.min(tower.floors, 10) }).map((_, floorIndex) => {
                          const floorNum = tower.floors - floorIndex;
                          return (
                            <div key={floorIndex} className="flex items-center gap-4">
                              <div className="w-12 text-xs font-medium text-muted-foreground text-right">
                                Fl {floorNum}
                              </div>
                              <div className="flex-1 flex gap-2">
                                {Array.from({ length: tower.unitsPerFloor }).map((_, unitIndex) => {
                                  // Randomize status for visual variety
                                  const isSold = (floorNum + unitIndex) % 3 === 0;
                                  const isHold = (floorNum + unitIndex) % 7 === 0 && !isSold;
                                  
                                  return (
                                    <div 
                                      key={unitIndex}
                                      className={`flex-1 h-8 rounded-md flex items-center justify-center text-[10px] font-medium cursor-pointer transition-colors ${
                                        isSold ? "bg-success/10 border border-success/30 text-success hover:bg-success/20" :
                                        isHold ? "bg-warning/10 border border-warning/30 text-warning hover:bg-warning/20" :
                                        "bg-background border border-border text-foreground hover:bg-muted"
                                      }`}
                                      title={`Unit ${floorNum}0${unitIndex + 1}`}
                                    >
                                      {floorNum}0{unitIndex + 1}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                        {tower.floors > 10 && (
                          <div className="text-center py-2 text-xs text-muted-foreground italic">
                            ... {tower.floors - 10} more floors hidden in preview
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}