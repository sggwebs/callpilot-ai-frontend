import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  const handleStartNewCampaign = () => {
    navigate('/campaigns');
  };

  const stats = [
    {
      title: "Active Campaigns",
      value: "12",
      description: "Currently running",
      trend: "+2 from last week",
      color: "text-primary"
    },
    {
      title: "Connected Calls",
      value: "847",
      description: "Today",
      trend: "+23% from yesterday",
      color: "text-success"
    },
    {
      title: "Success Rate",
      value: "68%",
      description: "This month",
      trend: "+5.2% improvement",
      color: "text-success"
    },
    {
      title: "Lead Conversion",
      value: "24%",
      description: "This week",
      trend: "+1.8% from last week",
      color: "text-warning"
    }
  ];

  const recentActivity = [
    { time: "2 min ago", activity: "Campaign 'Spring Sale' started", status: "active" },
    { time: "15 min ago", activity: "Agent John completed 5 calls", status: "completed" },
    { time: "1 hour ago", activity: "New lead imported from CSV", status: "info" },
    { time: "2 hours ago", activity: "AI Agent script updated", status: "updated" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {userProfile?.full_name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's what's happening with your call operations today.
          </p>
        </div>
        <Button variant="business" size="lg" onClick={handleStartNewCampaign}>
          Start New Campaign
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-business-sm border-border/50 hover:shadow-business-md transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription className="text-sm font-medium">{stat.title}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <p className="text-sm text-muted-foreground mb-2">{stat.description}</p>
              <p className="text-xs text-success font-medium">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 shadow-business-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📊 Recent Activity
            </CardTitle>
            <CardDescription>Latest updates from your call center operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      item.status === 'active' ? 'bg-success' :
                      item.status === 'completed' ? 'bg-primary' :
                      item.status === 'info' ? 'bg-warning' :
                      'bg-muted-foreground'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.activity}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Info Card */}
        <Card className="shadow-business-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              👤 Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-primary-foreground">
                  {userProfile?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </span>
              </div>
              <h3 className="font-semibold text-foreground">{userProfile?.full_name}</h3>
              <p className="text-sm text-muted-foreground">{userProfile?.email}</p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                  {userProfile?.role}
                </span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Calls Today</span>
                  <span className="font-medium text-foreground">23</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Success Rate</span>
                  <span className="font-medium text-success">72%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Since</span>
                  <span className="font-medium text-foreground">Today</span>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              View Full Profile
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-business-sm border-border/50">
        <CardHeader>
          <CardTitle>⚡ Quick Actions</CardTitle>
          <CardDescription>Common tasks to get you started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <span className="text-2xl">📋</span>
              <span className="font-medium">Upload Leads</span>
              <span className="text-xs text-muted-foreground">Import CSV file</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <span className="text-2xl">🤖</span>
              <span className="font-medium">Configure AI</span>
              <span className="text-xs text-muted-foreground">Set up agents</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <span className="text-2xl">📞</span>
              <span className="font-medium">View Call Logs</span>
              <span className="text-xs text-muted-foreground">Recent activity</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}