import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface CallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: {
    id: string;
    name: string;
    phone: string;
    company: string;
    status: string;
    notes?: string;
  } | null;
  onCallComplete: () => void;
}

export function CallModal({ open, onOpenChange, lead, onCallComplete }: CallModalProps) {
  const [callStatus, setCallStatus] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [outcome, setOutcome] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [callInProgress, setCallInProgress] = useState(false);
  const { toast } = useToast();
  const { userProfile } = useAuth();

  const startCall = () => {
    setCallInProgress(true);
    toast({
      title: "Call Initiated",
      description: `Calling ${lead?.name} at ${lead?.phone}`,
    });
    // In a real implementation, this would integrate with a telephony service
  };

  const endCall = () => {
    setCallInProgress(false);
    setCallStatus("answered"); // Auto-set since call was in progress
  };

  const handleSaveCall = async () => {
    if (!lead || !userProfile) return;

    setLoading(true);
    try {
      // Log the call
      const { error: callLogError } = await supabase
        .from('call_logs')
        .insert([{
          lead_id: lead.id,
          agent_id: userProfile.id,
          call_type: 'outbound',
          call_status: callStatus,
          duration: duration ? parseInt(duration) * 60 : 0, // Convert minutes to seconds
          notes,
          user_id: userProfile.id,
          created_at: new Date().toISOString()
        }]);

      if (callLogError) throw callLogError;

      // Update lead
      const updateData: any = {
        last_contact_date: new Date().toISOString(),
        last_interaction_type: 'call',
        interaction_count: 1, // In real app, increment existing count
        call_outcome: outcome,
        updated_at: new Date().toISOString()
      };

      if (followUpDate) {
        updateData.next_follow_up_date = new Date(followUpDate).toISOString();
      }

      // Update lead score based on call outcome
      if (outcome) {
        const scoreIncrement = outcome === 'interested' ? 10 : 
                             outcome === 'not_interested' ? -5 : 
                             outcome === 'callback_requested' ? 5 : 0;
        updateData.lead_score = scoreIncrement; // In real app, add to existing score
      }

      const { error: leadError } = await supabase
        .from('leads')
        .update(updateData)
        .eq('id', lead.id);

      if (leadError) throw leadError;

      toast({
        title: "Call Logged",
        description: "Call details saved successfully",
      });

      onCallComplete();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error saving call:', error);
      toast({
        title: "Error",
        description: "Failed to save call details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCallStatus("");
    setDuration("");
    setNotes("");
    setOutcome("");
    setFollowUpDate("");
    setCallInProgress(false);
  };

  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Call {lead.name}</DialogTitle>
          <DialogDescription>
            Initiate call and log interaction details
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted p-3 rounded">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{lead.name}</p>
                <p className="text-sm text-muted-foreground">{lead.company}</p>
                <p className="text-sm font-mono">{lead.phone}</p>
              </div>
              <Badge variant="outline">{lead.status}</Badge>
            </div>
            {lead.notes && (
              <p className="text-xs text-muted-foreground mt-2">{lead.notes}</p>
            )}
          </div>

          <div className="flex gap-2">
            {!callInProgress ? (
              <Button onClick={startCall} className="flex-1">
                📞 Start Call
              </Button>
            ) : (
              <Button onClick={endCall} variant="destructive" className="flex-1">
                📵 End Call
              </Button>
            )}
          </div>

          <div>
            <Label htmlFor="status">Call Status *</Label>
            <Select value={callStatus} onValueChange={setCallStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select call outcome" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="answered">Answered</SelectItem>
                <SelectItem value="no_answer">No Answer</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="voicemail">Voicemail</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {callStatus === "answered" && (
            <>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <input
                  type="number"
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="outcome">Call Outcome</Label>
                <Select value={outcome} onValueChange={setOutcome}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select outcome" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interested">Interested</SelectItem>
                    <SelectItem value="not_interested">Not Interested</SelectItem>
                    <SelectItem value="callback_requested">Callback Requested</SelectItem>
                    <SelectItem value="meeting_scheduled">Meeting Scheduled</SelectItem>
                    <SelectItem value="information_sent">Information Sent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="followup">Follow-up Date</Label>
                <input
                  type="datetime-local"
                  id="followup"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="notes">Call Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add call notes, key points discussed, next steps..."
              className="min-h-24"
            />
          </div>

          <div className="bg-primary/5 p-3 rounded border border-primary/20">
            <p className="text-sm text-primary font-medium">🤖 AI Call Assistant</p>
            <p className="text-xs text-muted-foreground mt-1">
              Real-time sentiment analysis and conversation insights will be available during the call.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveCall} 
            disabled={loading || !callStatus}
          >
            {loading ? "Saving..." : "Save Call"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}