import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Import modals
import { AddLeadModal } from "@/components/leads/AddLeadModal";
import { BulkActionsModal } from "@/components/leads/BulkActionsModal";
import { EmailModal } from "@/components/leads/EmailModal";
import { CallModal } from "@/components/leads/CallModal";
import { EditLeadModal } from "@/components/leads/EditLeadModal";
import { UploadLeadsModal } from "@/components/leads/UploadLeadsModal";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  source: string;
  assigned_agent_id?: string;
  last_contact_date?: string;
  notes?: string;
  priority: number;
  estimated_value?: number;
  lead_score: number;
  created_at: string;
}

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { userProfile } = useAuth();

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    if (!userProfile) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', userProfile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error loading leads:', error);
      toast({
        title: "Error",
        description: "Failed to load leads",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "hot":
        return <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">🔥 Hot</Badge>;
      case "warm":
        return <Badge className="bg-warning/10 text-warning hover:bg-warning/20">☀️ Warm</Badge>;
      case "cold":
        return <Badge className="bg-primary/10 text-primary hover:bg-primary/20">❄️ Cold</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Legacy function kept for reference - now using UploadLeadsModal

  const downloadTemplate = () => {
    const csvContent = "name,email,phone,company,source,notes\nJohn Doe,john@example.com,+1234567890,Example Corp,Website,Sample lead";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    }
  };

  const handleSelectLead = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const getSelectedLeadEmails = () => {
    return filteredLeads
      .filter(lead => selectedLeads.includes(lead.id))
      .map(lead => lead.email)
      .filter(email => email && email.includes('@'));
  };

  const handleCall = (lead: Lead) => {
    setSelectedLead(lead);
    setShowCallModal(true);
  };

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setShowEditModal(true);
  };

  const handleDelete = async (lead: Lead) => {
    if (!window.confirm(`Are you sure you want to delete "${lead.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', lead.id)
        .eq('user_id', userProfile?.id);

      if (error) throw error;

      toast({
        title: "Lead Deleted",
        description: `Successfully deleted ${lead.name}`,
      });

      loadLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast({
        title: "Error",
        description: "Failed to delete lead",
        variant: "destructive",
      });
    }
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone?.includes(searchTerm)
  );

  const stats = {
    total: leads.length,
    hot: leads.filter(l => l.status === 'hot').length,
    converted: leads.filter(l => l.status === 'converted').length,
    unassigned: leads.filter(l => !l.assigned_agent_id).length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lead Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track your sales leads
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowUploadModal(true)}>
            📤 Upload File
          </Button>
          <Button variant="business" onClick={() => setShowAddModal(true)}>
            ➕ Add Lead
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-business-sm border-border/50">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Total Leads</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-xs text-success">Active leads</span>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-business-sm border-border/50">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-destructive">{stats.hot}</div>
            <p className="text-sm text-muted-foreground">Hot Leads</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span className="text-xs text-warning">Priority follow-up</span>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-business-sm border-border/50">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-success">{stats.converted}</div>
            <p className="text-sm text-muted-foreground">Converted</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-xs text-success">Success rate</span>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-business-sm border-border/50">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-primary">{stats.unassigned}</div>
            <p className="text-sm text-muted-foreground">Unassigned</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span className="text-xs text-warning">Need assignment</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions */}
      <Card className="shadow-business-sm border-border/50">
        <CardHeader>
          <CardTitle>Lead Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search leads by name, email, company, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowBulkModal(true)}
                disabled={selectedLeads.length === 0}
              >
                📊 Bulk Actions ({selectedLeads.length})
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowEmailModal(true)}
                disabled={getSelectedLeadEmails().length === 0}
              >
                📧 Send Email ({getSelectedLeadEmails().length})
              </Button>
              <Button variant="outline">
                👤 AI Auto-Assign
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Upload Instructions */}
      <Card className="shadow-business-sm border-border/50 bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">📋 File Upload Guidelines</CardTitle>
          <CardDescription>
            Upload leads efficiently using CSV or Excel files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Supported formats:</p>
              <ul className="text-sm space-y-1 text-foreground">
                <li>• CSV files (.csv)</li>
                <li>• Excel files (.xlsx, .xls)</li>
                <li>• Maximum file size: 10MB</li>
              </ul>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Required columns:</p>
              <ul className="text-sm space-y-1 text-foreground">
                <li>• Name (required)</li>
                <li>• Email (recommended)</li>
                <li>• Phone (recommended)</li>
                <li>• Company (optional)</li>
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={() => setShowUploadModal(true)}>
              📤 Upload File
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card className="shadow-business-sm border-border/50">
        <CardHeader>
          <CardTitle>Lead Database ({filteredLeads.length})</CardTitle>
          <CardDescription>
            Manage and track your sales prospects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Contact Info</TableHead>
                  <TableHead className="font-semibold">Company</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Score</TableHead>
                  <TableHead className="font-semibold">Source</TableHead>
                  <TableHead className="font-semibold">Last Contact</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      Loading leads...
                    </TableCell>
                  </TableRow>
                ) : filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      No leads found. Add your first lead to get started!
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((lead) => (
                    <TableRow key={lead.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <Checkbox
                          checked={selectedLeads.includes(lead.id)}
                          onCheckedChange={() => handleSelectLead(lead.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold text-foreground">{lead.name}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-48" title={lead.notes}>
                            {lead.notes || "No notes"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm text-foreground">{lead.email || "No email"}</div>
                          <div className="text-sm font-mono text-muted-foreground">{lead.phone || "No phone"}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{lead.company || "N/A"}</TableCell>
                      <TableCell>{getStatusBadge(lead.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-bold text-primary">{lead.lead_score || 0}</div>
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${Math.min((lead.lead_score || 0) / 100 * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {lead.source}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {lead.last_contact_date ? new Date(lead.last_contact_date).toLocaleDateString() : "Never"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleCall(lead)}
                            title="Make call"
                          >
                            📞
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setSelectedLeads([lead.id]);
                              setShowEmailModal(true);
                            }}
                            title="Send email"
                            disabled={!lead.email}
                          >
                            📧
                          </Button>
                           <Button 
                             variant="ghost" 
                             size="sm" 
                             className="h-8 w-8 p-0"
                             onClick={() => handleEdit(lead)}
                             title="Edit lead"
                           >
                             ✏️
                           </Button>
                           <Button 
                             variant="ghost" 
                             size="sm" 
                             className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                             onClick={() => handleDelete(lead)}
                             title="Delete lead"
                           >
                             🗑️
                           </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <AddLeadModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal}
        onLeadAdded={loadLeads}
      />
      
      <BulkActionsModal
        open={showBulkModal}
        onOpenChange={setShowBulkModal}
        selectedLeads={selectedLeads}
        onActionComplete={() => {
          loadLeads();
          setSelectedLeads([]);
        }}
      />
      
      <EmailModal
        open={showEmailModal}
        onOpenChange={setShowEmailModal}
        selectedLeads={selectedLeads}
        leadEmails={getSelectedLeadEmails()}
      />
      
      <CallModal
        open={showCallModal}
        onOpenChange={setShowCallModal}
        lead={selectedLead}
        onCallComplete={loadLeads}
      />
      
      <EditLeadModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        lead={selectedLead}
        onLeadUpdated={loadLeads}
      />
      
      <UploadLeadsModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={loadLeads}
      />
    </div>
  );
}