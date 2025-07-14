import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BulkActionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLeads: string[];
  onActionComplete: () => void;
}

export function BulkActionsModal({ open, onOpenChange, selectedLeads, onActionComplete }: BulkActionsModalProps) {
  const [action, setAction] = useState("");
  const [status, setStatus] = useState("");
  const [assignedAgent, setAssignedAgent] = useState("");
  const [addNotes, setAddNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!action || selectedLeads.length === 0) return;

    setLoading(true);
    try {
      let updateData: any = {};

      switch (action) {
        case "update_status":
          if (status) updateData.status = status;
          break;
        case "assign_agent":
          if (assignedAgent) updateData.assigned_agent_id = assignedAgent;
          break;
        case "add_notes":
          if (notes) updateData.notes = notes;
          break;
        case "delete":
          const { error: deleteError } = await supabase
            .from('leads')
            .delete()
            .in('id', selectedLeads);

          if (deleteError) throw deleteError;
          
          toast({
            title: "Success",
            description: `Deleted ${selectedLeads.length} leads`,
          });
          break;
      }

      if (action !== "delete" && Object.keys(updateData).length > 0) {
        if (addNotes && notes) {
          updateData.notes = notes;
        }

        const { error } = await supabase
          .from('leads')
          .update({
            ...updateData,
            updated_at: new Date().toISOString()
          })
          .in('id', selectedLeads);

        if (error) throw error;

        toast({
          title: "Success",
          description: `Updated ${selectedLeads.length} leads`,
        });
      }

      onActionComplete();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast({
        title: "Error",
        description: "Failed to perform bulk action",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAction("");
    setStatus("");
    setAssignedAgent("");
    setAddNotes(false);
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk Actions</DialogTitle>
          <DialogDescription>
            Perform actions on {selectedLeads.length} selected leads
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="action">Action</Label>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger>
                <SelectValue placeholder="Select an action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="update_status">Update Status</SelectItem>
                <SelectItem value="assign_agent">Assign Agent</SelectItem>
                <SelectItem value="add_notes">Add Notes</SelectItem>
                <SelectItem value="delete">Delete Leads</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {action === "update_status" && (
            <div>
              <Label htmlFor="status">New Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="cold">Cold</SelectItem>
                  <SelectItem value="warm">Warm</SelectItem>
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {action === "assign_agent" && (
            <div>
              <Label htmlFor="agent">Assign to Agent</Label>
              <Select value={assignedAgent} onValueChange={setAssignedAgent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai-agent-1">AI Agent 1</SelectItem>
                  <SelectItem value="ai-agent-2">AI Agent 2</SelectItem>
                  <SelectItem value="human-agent-1">Sarah Wilson</SelectItem>
                  <SelectItem value="human-agent-2">Mike Davis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {(action === "add_notes" || addNotes) && (
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes to selected leads..."
              />
            </div>
          )}

          {action && action !== "add_notes" && action !== "delete" && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="add-notes"
                checked={addNotes}
                onCheckedChange={(checked) => setAddNotes(checked as boolean)}
              />
              <Label htmlFor="add-notes">Also add notes</Label>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !action}
            variant={action === "delete" ? "destructive" : "default"}
          >
            {loading ? "Processing..." : "Apply Action"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}