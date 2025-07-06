import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

const mockAIAgents = [
  {
    id: "1",
    name: "SalesBot Pro",
    status: "active",
    description: "Advanced sales conversational AI for lead qualification",
    voice: "Professional Female",
    language: "English (US)",
    script: "Hello! I'm calling about your inquiry regarding our premium software solutions. Are you still interested in learning more?",
    callsToday: 23,
    successRate: 68,
    lastActive: "2 minutes ago"
  },
  {
    id: "2",
    name: "FollowUp Assistant",
    status: "idle",
    description: "Automated follow-up calls for existing customers",
    voice: "Friendly Male",
    language: "English (US)",
    script: "Hi there! I'm following up on your recent purchase. How has your experience been so far?",
    callsToday: 15,
    successRate: 72,
    lastActive: "1 hour ago"
  },
  {
    id: "3",
    name: "Support Helper",
    status: "in-call",
    description: "Customer support and technical assistance",
    voice: "Professional Male",
    language: "English (US)",
    script: "Thank you for calling our support line. I'm here to help resolve any technical issues you may have.",
    callsToday: 8,
    successRate: 85,
    lastActive: "Active now"
  }
];

export default function AIAgents() {
  const { userProfile } = useAuth();
  const [selectedAgent, setSelectedAgent] = useState(mockAIAgents[0]);
  const [editingScript, setEditingScript] = useState(false);
  const [scriptContent, setScriptContent] = useState(selectedAgent.script);

  // Check if user has Admin role
  if (userProfile?.role !== 'Admin') {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Card className="w-full max-w-md text-center shadow-business-lg">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Access Restricted</h2>
            <p className="text-muted-foreground">
              AI Agent management is only available to administrators.
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
      case "idle":
        return <Badge className="bg-warning/10 text-warning hover:bg-warning/20">🟡 Idle</Badge>;
      case "in-call":
        return <Badge className="bg-primary/10 text-primary hover:bg-primary/20">🔵 In Call</Badge>;
      case "offline":
        return <Badge className="bg-muted/10 text-muted-foreground hover:bg-muted/20">⚪ Offline</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleSaveScript = () => {
    setSelectedAgent(prev => ({ ...prev, script: scriptContent }));
    setEditingScript(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Agents</h1>
          <p className="text-muted-foreground mt-2">
            Configure and manage your AI-powered call agents
          </p>
        </div>
        <Button variant="business">
          ➕ Create New Agent
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-business-sm border-border/50">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-success">2</div>
            <p className="text-sm text-muted-foreground">Active Agents</p>
          </CardContent>
        </Card>
        <Card className="shadow-business-sm border-border/50">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-primary">46</div>
            <p className="text-sm text-muted-foreground">Calls Today</p>
          </CardContent>
        </Card>
        <Card className="shadow-business-sm border-border/50">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-success">75%</div>
            <p className="text-sm text-muted-foreground">Avg Success Rate</p>
          </CardContent>
        </Card>
        <Card className="shadow-business-sm border-border/50">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-foreground">00:03:24</div>
            <p className="text-sm text-muted-foreground">Avg Call Duration</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Agents List */}
        <Card className="lg:col-span-1 shadow-business-sm border-border/50">
          <CardHeader>
            <CardTitle>Your AI Agents</CardTitle>
            <CardDescription>Manage your automated call agents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAIAgents.map((agent) => (
                <div
                  key={agent.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-business-sm ${
                    selectedAgent.id === agent.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{agent.name}</h3>
                    {getStatusBadge(agent.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{agent.description}</p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{agent.callsToday} calls today</span>
                    <span>{agent.successRate}% success</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Agent Configuration */}
        <Card className="lg:col-span-2 shadow-business-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Configure: {selectedAgent.name}</span>
              <div className="flex items-center gap-2">
                <Switch defaultChecked={selectedAgent.status === "active"} />
                <span className="text-sm text-muted-foreground">Active</span>
              </div>
            </CardTitle>
            <CardDescription>
              Customize voice, script, and behavior settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <div className="text-2xl font-bold text-primary">{selectedAgent.callsToday}</div>
                <div className="text-sm text-muted-foreground">Calls Today</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <div className="text-2xl font-bold text-success">{selectedAgent.successRate}%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <div className="text-sm font-medium text-foreground">{selectedAgent.lastActive}</div>
                <div className="text-sm text-muted-foreground">Last Active</div>
              </div>
            </div>

            {/* Voice & Language Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Voice Type</Label>
                <div className="mt-2 p-3 rounded-lg border border-border bg-muted/20">
                  <div className="font-medium text-foreground">{selectedAgent.voice}</div>
                  <Button variant="outline" size="sm" className="mt-2">
                    🎵 Preview Voice
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Language & Region</Label>
                <div className="mt-2 p-3 rounded-lg border border-border bg-muted/20">
                  <div className="font-medium text-foreground">{selectedAgent.language}</div>
                  <Button variant="outline" size="sm" className="mt-2">
                    🌐 Change Language
                  </Button>
                </div>
              </div>
            </div>

            {/* Script Configuration */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium">Call Script</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (editingScript) {
                      handleSaveScript();
                    } else {
                      setEditingScript(true);
                      setScriptContent(selectedAgent.script);
                    }
                  }}
                >
                  {editingScript ? "💾 Save Script" : "✏️ Edit Script"}
                </Button>
              </div>
              
              {editingScript ? (
                <div className="space-y-3">
                  <Textarea
                    value={scriptContent}
                    onChange={(e) => setScriptContent(e.target.value)}
                    className="min-h-32 resize-none"
                    placeholder="Enter your AI agent's call script..."
                  />
                  <div className="flex gap-2">
                    <Button variant="success" size="sm" onClick={handleSaveScript}>
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingScript(false);
                        setScriptContent(selectedAgent.script);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-lg border border-border bg-muted/20">
                  <p className="text-foreground italic">"{selectedAgent.script}"</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button variant="business">
                🧪 Test Agent
              </Button>
              <Button variant="outline">
                📊 View Analytics
              </Button>
              <Button variant="outline">
                📋 Export Logs
              </Button>
              <Button variant="destructive">
                🗑️ Delete Agent
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}