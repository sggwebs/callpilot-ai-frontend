import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [sipSettings, setSipSettings] = useState({
    provider: "custom",
    server: "sip.example.com",
    username: "callpilot_user",
    password: "",
    port: "5060"
  });

  const [twilioSettings, setTwilioSettings] = useState({
    accountSid: "",
    authToken: "",
    phoneNumber: ""
  });

  const [aiSettings, setAiSettings] = useState({
    defaultVoice: "professional-female",
    language: "en-US",
    responseSpeed: "normal",
    fallbackBehavior: "transfer-to-human",
    enableRecording: true,
    sentimentAnalysis: true
  });

  const handleSaveSettings = async (section: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Saved",
        description: `${section} settings have been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure your CallPilotAI system preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card className="shadow-business-sm border-border/50">
          <CardHeader>
            <CardTitle>👤 Profile Settings</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                defaultValue={userProfile?.full_name || ''}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                defaultValue={userProfile?.email}
                className="mt-1"
                disabled
              />
              <p className="text-xs text-muted-foreground mt-1">
                Email cannot be changed. Contact support for assistance.
              </p>
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                defaultValue={userProfile?.role}
                className="mt-1 capitalize"
                disabled
              />
            </div>
            <Button 
              onClick={() => handleSaveSettings("Profile")}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </CardContent>
        </Card>

        {/* SIP Configuration */}
        <Card className="shadow-business-sm border-border/50">
          <CardHeader>
            <CardTitle>📞 SIP Configuration</CardTitle>
            <CardDescription>Configure your SIP trunk settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="sipProvider">SIP Provider</Label>
              <Select 
                value={sipSettings.provider} 
                onValueChange={(value) => setSipSettings(prev => ({ ...prev, provider: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Custom SIP Server</SelectItem>
                  <SelectItem value="twilio">Twilio SIP</SelectItem>
                  <SelectItem value="asterisk">Asterisk</SelectItem>
                  <SelectItem value="freeswitch">FreeSWITCH</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sipServer">SIP Server</Label>
              <Input
                id="sipServer"
                value={sipSettings.server}
                onChange={(e) => setSipSettings(prev => ({ ...prev, server: e.target.value }))}
                className="mt-1"
                placeholder="sip.example.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sipUsername">Username</Label>
                <Input
                  id="sipUsername"
                  value={sipSettings.username}
                  onChange={(e) => setSipSettings(prev => ({ ...prev, username: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="sipPort">Port</Label>
                <Input
                  id="sipPort"
                  value={sipSettings.port}
                  onChange={(e) => setSipSettings(prev => ({ ...prev, port: e.target.value }))}
                  className="mt-1"
                  placeholder="5060"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="sipPassword">Password</Label>
              <Input
                id="sipPassword"
                type="password"
                value={sipSettings.password}
                onChange={(e) => setSipSettings(prev => ({ ...prev, password: e.target.value }))}
                className="mt-1"
                placeholder="Enter SIP password"
              />
            </div>
            <Button 
              onClick={() => handleSaveSettings("SIP")}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Saving..." : "Save SIP Settings"}
            </Button>
          </CardContent>
        </Card>

        {/* Twilio Configuration */}
        <Card className="shadow-business-sm border-border/50">
          <CardHeader>
            <CardTitle>🌟 Twilio Configuration</CardTitle>
            <CardDescription>Configure Twilio API credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="twilioSid">Account SID</Label>
              <Input
                id="twilioSid"
                value={twilioSettings.accountSid}
                onChange={(e) => setTwilioSettings(prev => ({ ...prev, accountSid: e.target.value }))}
                className="mt-1"
                placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              />
            </div>
            <div>
              <Label htmlFor="twilioToken">Auth Token</Label>
              <Input
                id="twilioToken"
                type="password"
                value={twilioSettings.authToken}
                onChange={(e) => setTwilioSettings(prev => ({ ...prev, authToken: e.target.value }))}
                className="mt-1"
                placeholder="Enter Twilio Auth Token"
              />
            </div>
            <div>
              <Label htmlFor="twilioPhone">Phone Number</Label>
              <Input
                id="twilioPhone"
                value={twilioSettings.phoneNumber}
                onChange={(e) => setTwilioSettings(prev => ({ ...prev, phoneNumber: e.target.value }))}
                className="mt-1"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <Button 
              onClick={() => handleSaveSettings("Twilio")}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Saving..." : "Save Twilio Settings"}
            </Button>
          </CardContent>
        </Card>

        {/* AI Configuration */}
        <Card className="shadow-business-sm border-border/50">
          <CardHeader>
            <CardTitle>🧠 AI Configuration</CardTitle>
            <CardDescription>Configure AI voice and behavior settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="defaultVoice">Default Voice</Label>
                <Select 
                  value={aiSettings.defaultVoice} 
                  onValueChange={(value) => setAiSettings(prev => ({ ...prev, defaultVoice: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional-female">Professional Female</SelectItem>
                    <SelectItem value="professional-male">Professional Male</SelectItem>
                    <SelectItem value="friendly-female">Friendly Female</SelectItem>
                    <SelectItem value="friendly-male">Friendly Male</SelectItem>
                    <SelectItem value="energetic-female">Energetic Female</SelectItem>
                    <SelectItem value="calm-male">Calm Male</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={aiSettings.language} 
                  onValueChange={(value) => setAiSettings(prev => ({ ...prev, language: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="en-GB">English (UK)</SelectItem>
                    <SelectItem value="es-ES">Spanish (Spain)</SelectItem>
                    <SelectItem value="fr-FR">French (France)</SelectItem>
                    <SelectItem value="de-DE">German (Germany)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="responseSpeed">Response Speed</Label>
                <Select 
                  value={aiSettings.responseSpeed} 
                  onValueChange={(value) => setAiSettings(prev => ({ ...prev, responseSpeed: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fast">Fast</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="slow">Slow & Clear</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="fallbackBehavior">Fallback Behavior</Label>
                <Select 
                  value={aiSettings.fallbackBehavior} 
                  onValueChange={(value) => setAiSettings(prev => ({ ...prev, fallbackBehavior: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transfer-to-human">Transfer to Human</SelectItem>
                    <SelectItem value="schedule-callback">Schedule Callback</SelectItem>
                    <SelectItem value="take-message">Take Message</SelectItem>
                    <SelectItem value="end-call">End Call Politely</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableRecording">Call Recording</Label>
                  <p className="text-sm text-muted-foreground">Enable automatic call recording</p>
                </div>
                <Switch
                  id="enableRecording"
                  checked={aiSettings.enableRecording}
                  onCheckedChange={(checked) => setAiSettings(prev => ({ ...prev, enableRecording: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sentimentAnalysis">Sentiment Analysis</Label>
                  <p className="text-sm text-muted-foreground">Analyze caller sentiment in real-time</p>
                </div>
                <Switch
                  id="sentimentAnalysis"
                  checked={aiSettings.sentimentAnalysis}
                  onCheckedChange={(checked) => setAiSettings(prev => ({ ...prev, sentimentAnalysis: checked }))}
                />
              </div>
            </div>

            <Button 
              onClick={() => handleSaveSettings("AI")}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Saving..." : "Save AI Settings"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card className="shadow-business-sm border-border/50">
        <CardHeader>
          <CardTitle>ℹ️ System Information</CardTitle>
          <CardDescription>CallPilotAI system details and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Version Information</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CallPilotAI</span>
                  <span className="font-medium">v2.1.4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-medium">Jan 15, 2024</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-2">System Status</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">API Status</span>
                  <span className="font-medium text-success">🟢 Online</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Database</span>
                  <span className="font-medium text-success">🟢 Connected</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">Usage Statistics</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Calls This Month</span>
                  <span className="font-medium">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Storage Used</span>
                  <span className="font-medium">2.4 GB</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}