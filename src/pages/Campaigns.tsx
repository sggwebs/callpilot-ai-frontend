import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { CreateCampaignModal } from "@/components/campaigns/CreateCampaignModal";

const mockCampaigns = [
  {
    id: "1",
    name: "Spring Sale 2024",
    status: "active",
    description: "Promoting our latest software packages with 30% discount",
    startDate: "2024-01-15",
    endDate: "2024-03-15",
    totalLeads: 500,
    contactedLeads: 320,
    convertedLeads: 45,
    assignedAgents: ["Sarah Wilson", "AI Agent 1"],
    callsToday: 28,
    budget: 5000,
    spent: 2100
  },
  {
    id: "2",
    name: "Product Demo Outreach",
    status: "paused",
    description: "Reaching out to trial users for product demonstrations",
    startDate: "2024-01-10",
    endDate: "2024-02-10",
    totalLeads: 200,
    contactedLeads: 150,
    convertedLeads: 22,
    assignedAgents: ["Mike Davis"],
    callsToday: 0,
    budget: 2000,
    spent: 1200
  },
  {
    id: "3",
    name: "Customer Retention",
    status: "completed",
    description: "Follow-up campaign for existing customers",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    totalLeads: 300,
    contactedLeads: 300,
    convertedLeads: 78,
    assignedAgents: ["AI Agent 2", "Sarah Wilson"],
    callsToday: 0,
    budget: 3000,
    spent: 2850
  }
];

export default function Campaigns() {
  const { userProfile } = useAuth();
  const [selectedCampaign, setSelectedCampaign] = useState(mockCampaigns[0]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Check if user has Admin role
  if (userProfile?.role !== 'Admin') {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Card className="w-full max-w-md text-center shadow-business-lg">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Access Restricted</h2>
            <p className="text-muted-foreground">
              Campaign management is only available to administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success/10 text-success hover:bg-success/20">🟢 Active</Badge>;
      case "paused":
        return <Badge className="bg-warning/10 text-warning hover:bg-warning/20">⏸️ Paused</Badge>;
      case "completed":
        return <Badge className="bg-primary/10 text-primary hover:bg-primary/20">✅ Completed</Badge>;
      case "draft":
        return <Badge className="bg-muted/10 text-muted-foreground hover:bg-muted/20">📝 Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getProgressPercentage = (contacted: number, total: number) => {
    return Math.round((contacted / total) * 100);
  };

  const getConversionRate = (converted: number, contacted: number) => {
    return contacted > 0 ? Math.round((converted / contacted) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Campaign Management</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage your marketing campaigns
          </p>
        </div>
        <Button variant="business" onClick={() => setShowCreateModal(true)}>
          ➕ Create Campaign
        </Button>
      </div>

      {/* Campaign Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-business-sm border-border/50">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-primary">3</div>
            <p className="text-sm text-muted-foreground">Total Campaigns</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-xs text-success">1 Active</span>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-business-sm border-border/50">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-success">145</div>
            <p className="text-sm text-muted-foreground">Total Conversions</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-xs text-success">18.3% rate</span>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-business-sm border-border/50">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-foreground">$6,150</div>
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span className="text-xs text-warning">61.5% of budget</span>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-business-sm border-border/50">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-primary">28</div>
            <p className="text-sm text-muted-foreground">Calls Today</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-xs text-primary">From active campaigns</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign List */}
        <Card className="shadow-business-sm border-border/50">
          <CardHeader>
            <CardTitle>Your Campaigns</CardTitle>
            <CardDescription>Manage and monitor campaign performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-business-sm ${
                    selectedCampaign.id === campaign.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedCampaign(campaign)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{campaign.name}</h3>
                    {getStatusBadge(campaign.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{campaign.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">
                        {getProgressPercentage(campaign.contactedLeads, campaign.totalLeads)}%
                      </span>
                    </div>
                    <Progress 
                      value={getProgressPercentage(campaign.contactedLeads, campaign.totalLeads)} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{campaign.contactedLeads}/{campaign.totalLeads} contacted</span>
                      <span>{getConversionRate(campaign.convertedLeads, campaign.contactedLeads)}% conversion</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Campaign Details */}
        <Card className="shadow-business-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{selectedCampaign.name}</span>
              <div className="flex items-center gap-3">
                {getStatusBadge(selectedCampaign.status)}
                <Switch defaultChecked={selectedCampaign.status === "active"} />
              </div>
            </CardTitle>
            <CardDescription>
              Campaign details and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <div className="text-2xl font-bold text-primary">{selectedCampaign.totalLeads}</div>
                <div className="text-sm text-muted-foreground">Total Leads</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <div className="text-2xl font-bold text-success">{selectedCampaign.convertedLeads}</div>
                <div className="text-sm text-muted-foreground">Conversions</div>
              </div>
            </div>

            {/* Progress Details */}
            <div>
              <h4 className="font-semibold text-foreground mb-3">Campaign Progress</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Leads Contacted</span>
                    <span className="font-medium text-foreground">
                      {selectedCampaign.contactedLeads}/{selectedCampaign.totalLeads}
                    </span>
                  </div>
                  <Progress 
                    value={getProgressPercentage(selectedCampaign.contactedLeads, selectedCampaign.totalLeads)} 
                    className="h-2"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Budget Used</span>
                    <span className="font-medium text-foreground">
                      ${selectedCampaign.spent}/${selectedCampaign.budget}
                    </span>
                  </div>
                  <Progress 
                    value={(selectedCampaign.spent / selectedCampaign.budget) * 100} 
                    className="h-2"
                  />
                </div>
              </div>
            </div>

            {/* Campaign Details */}
            <div>
              <h4 className="font-semibold text-foreground mb-3">Campaign Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date</span>
                  <span className="font-medium text-foreground">{selectedCampaign.startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">End Date</span>
                  <span className="font-medium text-foreground">{selectedCampaign.endDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Conversion Rate</span>
                  <span className="font-medium text-success">
                    {getConversionRate(selectedCampaign.convertedLeads, selectedCampaign.contactedLeads)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Calls Today</span>
                  <span className="font-medium text-foreground">{selectedCampaign.callsToday}</span>
                </div>
              </div>
            </div>

            {/* Assigned Agents */}
            <div>
              <h4 className="font-semibold text-foreground mb-3">Assigned Agents</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCampaign.assignedAgents.map((agent, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {agent}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button variant="business" size="sm">
                ✏️ Edit Campaign
              </Button>
              <Button variant="outline" size="sm">
                📊 View Analytics
              </Button>
              <Button variant="outline" size="sm">
                📋 Export Data
              </Button>
              {selectedCampaign.status === "active" ? (
                <Button variant="warning" size="sm">
                  ⏸️ Pause
                </Button>
              ) : (
                <Button variant="success" size="sm">
                  ▶️ Resume
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <CreateCampaignModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal} 
      />
    </div>
  );
}