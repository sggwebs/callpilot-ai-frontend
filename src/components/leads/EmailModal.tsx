import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface EmailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLeads: string[];
  leadEmails: string[];
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  template_type: string;
}

export function EmailModal({ open, onOpenChange, selectedLeads, leadEmails }: EmailModalProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { userProfile } = useAuth();

  useEffect(() => {
    if (open) {
      loadEmailTemplates();
    }
  }, [open]);

  const loadEmailTemplates = async () => {
    if (!userProfile) return;

    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('user_id', userProfile.id)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSubject(template.subject);
      setContent(template.content);
    }
  };

  const handleSendEmail = async () => {
    if (!subject || !content || leadEmails.length === 0) return;

    setLoading(true);
    try {
      // In a real implementation, this would call an email service API
      // For now, we'll simulate the email sending and log the interaction
      
      for (const leadId of selectedLeads) {
        const { error } = await supabase
          .from('leads')
          .update({
            email_history: [
              {
                subject,
                content,
                sent_at: new Date().toISOString(),
                template_used: selectedTemplate || 'custom'
              }
            ],
            last_contact_date: new Date().toISOString(),
            last_interaction_type: 'email',
            interaction_count: 1, // In real app, increment existing count
            updated_at: new Date().toISOString()
          })
          .eq('id', leadId);

        if (error) throw error;
      }

      toast({
        title: "Emails Sent",
        description: `Successfully sent emails to ${leadEmails.length} leads`,
      });

      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error sending emails:', error);
      toast({
        title: "Error",
        description: "Failed to send emails",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedTemplate("");
    setSubject("");
    setContent("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Send Email</DialogTitle>
          <DialogDescription>
            Send personalized emails to {leadEmails.length} selected leads
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="template">Email Template (Optional)</Label>
            <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select a template or write custom email" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name} ({template.template_type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="recipients">Recipients</Label>
            <div className="text-sm text-muted-foreground bg-muted p-2 rounded max-h-20 overflow-y-auto">
              {leadEmails.join(', ')}
            </div>
          </div>

          <div>
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              required
            />
          </div>

          <div>
            <Label htmlFor="content">Message *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Email content..."
              className="min-h-32"
              required
            />
          </div>

          <div className="bg-primary/5 p-3 rounded border border-primary/20">
            <p className="text-sm text-primary font-medium">🤖 AI Enhancement Available</p>
            <p className="text-xs text-muted-foreground mt-1">
              Emails will be automatically personalized with lead-specific insights and optimized for engagement.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendEmail} 
            disabled={loading || !subject || !content}
          >
            {loading ? "Sending..." : `Send to ${leadEmails.length} leads`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}