import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockCallLogs = [
  {
    id: "1",
    dateTime: "2024-01-15 14:30",
    contactName: "John Smith",
    phoneNumber: "+1 (555) 123-4567",
    duration: "00:03:45",
    status: "completed",
    agent: "Sarah Wilson",
    campaign: "Spring Sale"
  },
  {
    id: "2",
    dateTime: "2024-01-15 14:15",
    contactName: "Emily Johnson",
    phoneNumber: "+1 (555) 987-6543",
    duration: "00:01:20",
    status: "missed",
    agent: "Mike Davis",
    campaign: "Product Demo"
  },
  {
    id: "3",
    dateTime: "2024-01-15 14:00",
    contactName: "Robert Brown",
    phoneNumber: "+1 (555) 555-0123",
    duration: "00:05:12",
    status: "completed",
    agent: "AI Agent 1",
    campaign: "Follow-up"
  },
  {
    id: "4",
    dateTime: "2024-01-15 13:45",
    contactName: "Lisa Davis",
    phoneNumber: "+1 (555) 444-7890",
    duration: "00:02:30",
    status: "busy",
    agent: "Sarah Wilson",
    campaign: "Cold Outreach"
  }
];

export default function CallLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("today");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success/10 text-success hover:bg-success/20">Completed</Badge>;
      case "missed":
        return <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">Missed</Badge>;
      case "busy":
        return <Badge className="bg-warning/10 text-warning hover:bg-warning/20">Busy</Badge>;
      case "in-progress":
        return <Badge className="bg-primary/10 text-primary hover:bg-primary/20">In Progress</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredLogs = mockCallLogs.filter(log => {
    const matchesSearch = log.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.phoneNumber.includes(searchTerm) ||
                         log.agent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Call Logs</h1>
          <p className="text-muted-foreground mt-2">
            Track and analyze all call activities
          </p>
        </div>
        <Button variant="business">
          Export Logs
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-business-sm border-border/50">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-success">156</div>
            <p className="text-sm text-muted-foreground">Completed Calls</p>
          </CardContent>
        </Card>
        <Card className="shadow-business-sm border-border/50">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-warning">23</div>
            <p className="text-sm text-muted-foreground">Missed Calls</p>
          </CardContent>
        </Card>
        <Card className="shadow-business-sm border-border/50">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-primary">8</div>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card className="shadow-business-sm border-border/50">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-foreground">00:04:32</div>
            <p className="text-sm text-muted-foreground">Avg. Duration</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-business-sm border-border/50">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by contact name, phone, or agent..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 h-10">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="missed">Missed</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full md:w-48 h-10">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Call Logs Table */}
      <Card className="shadow-business-sm border-border/50">
        <CardHeader>
          <CardTitle>Recent Calls ({filteredLogs.length})</CardTitle>
          <CardDescription>
            Detailed view of all call activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Date & Time</TableHead>
                  <TableHead className="font-semibold">Contact</TableHead>
                  <TableHead className="font-semibold">Phone Number</TableHead>
                  <TableHead className="font-semibold">Duration</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Agent</TableHead>
                  <TableHead className="font-semibold">Campaign</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{log.dateTime}</TableCell>
                    <TableCell>{log.contactName}</TableCell>
                    <TableCell className="font-mono text-sm">{log.phoneNumber}</TableCell>
                    <TableCell className="font-mono text-sm">{log.duration}</TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                    <TableCell>{log.agent}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {log.campaign}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          📞 Call
                        </Button>
                        <Button variant="ghost" size="sm">
                          📝 Notes
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