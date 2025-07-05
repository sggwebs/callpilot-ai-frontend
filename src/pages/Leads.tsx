import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockLeads = [
  {
    id: "1",
    name: "Alice Cooper",
    email: "alice@example.com",
    phone: "+1 (555) 123-4567",
    company: "Tech Solutions Inc",
    status: "hot",
    source: "Website",
    assignedAgent: "Sarah Wilson",
    lastContact: "2024-01-15",
    notes: "Very interested in our premium package"
  },
  {
    id: "2",
    name: "Bob Johnson",
    email: "bob@company.com",
    phone: "+1 (555) 987-6543",
    company: "Marketing Pro",
    status: "warm",
    source: "Referral",
    assignedAgent: "Mike Davis",
    lastContact: "2024-01-14",
    notes: "Requested product demo"
  },
  {
    id: "3",
    name: "Carol Williams",
    email: "carol@business.net",
    phone: "+1 (555) 555-0123",
    company: "Business Analytics",
    status: "cold",
    source: "Cold Outreach",
    assignedAgent: "AI Agent 1",
    lastContact: "2024-01-13",
    notes: "Initial contact made"
  }
];

export default function Leads() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv') {
        toast({
          title: "Invalid File Type",
          description: "Please upload a CSV file",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "File Uploaded",
        description: `Processing ${file.name}...`,
      });
      
      // Here you would typically process the CSV file
      setTimeout(() => {
        toast({
          title: "Success",
          description: "Leads imported successfully",
        });
      }, 2000);
    }
  };

  const filteredLeads = mockLeads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone.includes(searchTerm)
  );

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
          <label htmlFor="csv-upload">
            <Button variant="outline" className="cursor-pointer">
              📤 Upload CSV
            </Button>
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <Button variant="business">
            ➕ Add Lead
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-business-sm border-border/50">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-foreground">247</div>
            <p className="text-sm text-muted-foreground">Total Leads</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-xs text-success">+12% this week</span>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-business-sm border-border/50">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-destructive">45</div>
            <p className="text-sm text-muted-foreground">Hot Leads</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span className="text-xs text-warning">Priority follow-up</span>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-business-sm border-border/50">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-success">32</div>
            <p className="text-sm text-muted-foreground">Converted</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-xs text-success">13% conversion rate</span>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-business-sm border-border/50">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-primary">18</div>
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
              <Button variant="outline">
                📊 Bulk Actions
              </Button>
              <Button variant="outline">
                📧 Send Email
              </Button>
              <Button variant="outline">
                👤 Assign Agent
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CSV Upload Instructions */}
      <Card className="shadow-business-sm border-border/50 bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">📋 CSV Upload Guidelines</CardTitle>
          <CardDescription>
            Upload leads efficiently using our CSV template
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Required columns:</p>
              <ul className="text-sm space-y-1 text-foreground">
                <li>• Name</li>
                <li>• Email</li>
                <li>• Phone</li>
                <li>• Company (optional)</li>
              </ul>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Optional columns:</p>
              <ul className="text-sm space-y-1 text-foreground">
                <li>• Source</li>
                <li>• Notes</li>
                <li>• Status</li>
                <li>• Assigned Agent</li>
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" size="sm">
              📥 Download Template
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
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Contact Info</TableHead>
                  <TableHead className="font-semibold">Company</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Source</TableHead>
                  <TableHead className="font-semibold">Assigned Agent</TableHead>
                  <TableHead className="font-semibold">Last Contact</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold text-foreground">{lead.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-48" title={lead.notes}>
                          {lead.notes}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm text-foreground">{lead.email}</div>
                        <div className="text-sm font-mono text-muted-foreground">{lead.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{lead.company}</TableCell>
                    <TableCell>{getStatusBadge(lead.status)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {lead.source}
                      </Badge>
                    </TableCell>
                    <TableCell>{lead.assignedAgent}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{lead.lastContact}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          📞
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          📧
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          ✏️
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}