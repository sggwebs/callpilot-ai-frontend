import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, UserCheck, User, Phone, Brain, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Settings() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [activeSection, setActiveSection] = useState("profile");

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

  // Admin Management State
  const [admins, setAdmins] = useState<any[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newAdminRole, setNewAdminRole] = useState("Low Admin");
  const [adminLoading, setAdminLoading] = useState(false);

  // Load settings and admins from database on component mount
  useEffect(() => {
    const loadSettings = async () => {
      if (!userProfile?.id) return;
      
      try {
        const { data: settings, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', userProfile.id);

        if (error) {
          console.error('Error loading settings:', error);
          return;
        }

        // Apply loaded settings to state
        settings?.forEach((setting) => {
          if (setting.settings && typeof setting.settings === 'object') {
            switch (setting.setting_type) {
              case 'sip':
                setSipSettings(prev => ({ ...prev, ...(setting.settings as any) }));
                break;
              case 'twilio':
                setTwilioSettings(prev => ({ ...prev, ...(setting.settings as any) }));
                break;
              case 'ai':
                setAiSettings(prev => ({ ...prev, ...(setting.settings as any) }));
                break;
            }
          }
        });

        // Load admins if user is Admin
        if (userProfile?.role === 'Admin') {
          await loadAdmins();
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setInitialLoad(false);
      }
    };

    loadSettings();
  }, [userProfile?.id, userProfile?.role]);

  const loadAdmins = async () => {
    try {
      const { data: adminData, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['Admin', 'Low Admin'])
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading admins:', error);
        return;
      }

      setAdmins(adminData || []);
    } catch (error) {
      console.error('Error loading admins:', error);
    }
  };

  const handleCreateAdmin = async () => {
    if (!newAdminEmail || !newAdminName || !newAdminPassword) {
      toast({
        title: "Error",
        description: "Please fill in all required fields including password.",
        variant: "destructive",
      });
      return;
    }

    if (newAdminPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setAdminLoading(true);
    try {
      // Create user through Supabase Auth without auto-login
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: newAdminEmail,
        password: newAdminPassword,
        options: {
          data: {
            full_name: newAdminName,
            role: newAdminRole,
          }
        }
      });

      if (signUpError) throw signUpError;

      toast({
        title: "Admin Created",
        description: `${newAdminRole} ${newAdminName} has been created successfully. They can now login with their email and password.`,
      });

      // Reset form
      setNewAdminEmail("");
      setNewAdminName("");
      setNewAdminPassword("");
      setNewAdminRole("Low Admin");

      // Reload admins
      await loadAdmins();
    } catch (error: any) {
      console.error('Error creating admin:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create admin. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAdminLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminId: string, adminName: string) => {
    if (!confirm(`Are you sure you want to delete ${adminName}? This action cannot be undone.`)) {
      return;
    }

    setAdminLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', adminId);

      if (error) throw error;

      toast({
        title: "Admin Deleted",
        description: `${adminName} has been deleted successfully.`,
      });

      // Reload admins
      await loadAdmins();
    } catch (error: any) {
      console.error('Error deleting admin:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete admin. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAdminLoading(false);
    }
  };

  const handleUpdateAdminRole = async (adminId: string, newRole: string, adminName: string) => {
    setAdminLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', adminId);

      if (error) throw error;

      toast({
        title: "Role Updated",
        description: `${adminName}'s role has been updated to ${newRole}.`,
      });

      // Reload admins
      await loadAdmins();
    } catch (error: any) {
      console.error('Error updating admin role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update admin role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAdminLoading(false);
    }
  };

  const handleSaveSettings = async (section: string) => {
    if (!userProfile?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to save settings.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let settingsData = {};
      let settingType = '';

      switch (section) {
        case 'Profile':
          // Profile settings are handled differently since they go to profiles table
          const fullNameInput = document.getElementById('fullName') as HTMLInputElement;
          if (fullNameInput?.value) {
            const { error: profileError } = await supabase
              .from('profiles')
              .update({ full_name: fullNameInput.value })
              .eq('id', userProfile.id);
            
            if (profileError) throw profileError;
          }
          break;
        case 'SIP':
          settingsData = sipSettings;
          settingType = 'sip';
          break;
        case 'Twilio':
          settingsData = twilioSettings;
          settingType = 'twilio';
          break;
        case 'AI':
          settingsData = aiSettings;
          settingType = 'ai';
          break;
      }

      if (settingType) {
        const { error } = await supabase
          .from('user_settings')
          .upsert({
            user_id: userProfile.id,
            setting_type: settingType,
            settings: settingsData
          }, {
            onConflict: 'user_id,setting_type'
          });

        if (error) throw error;
      }
      
      toast({
        title: "Settings Saved",
        description: `${section} settings have been updated successfully.`,
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  const settingsOptions = [
    { value: "profile", label: "Profile Settings", icon: User },
    { value: "sip", label: "SIP Configuration", icon: Phone },
    { value: "ai", label: "AI Configuration", icon: Brain },
    ...(userProfile?.role === 'Admin' ? [{ value: "admin", label: "Admin Management", icon: Shield }] : [])
  ];

  const currentSection = settingsOptions.find(option => option.value === activeSection);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure your CallPilotAI system preferences
        </p>
      </div>

      {/* Navigation Dropdown */}
      <div className="border-b border-border pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2">
            {currentSection && <currentSection.icon className="h-5 w-5 text-primary" />}
            <h2 className="text-xl font-semibold text-foreground">
              {currentSection?.label || "Settings"}
            </h2>
          </div>
          <div className="w-full sm:w-64">
            <Select value={activeSection} onValueChange={setActiveSection}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select settings section" />
              </SelectTrigger>
              <SelectContent>
                {settingsOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <option.icon className="h-4 w-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="w-full">
        {activeSection === "profile" && (
          <div className="space-y-6">
            {/* Profile Settings Section */}
            <Card className="shadow-business-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Settings
                </CardTitle>
                <CardDescription>Manage your account information and preferences</CardDescription>
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

            {/* System Information */}
            <Card className="shadow-business-sm border-border/50">
              <CardHeader>
                <CardTitle>System Information</CardTitle>
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
        )}

        {activeSection === "sip" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* SIP Configuration */}
              <Card className="shadow-business-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    SIP Configuration
                  </CardTitle>
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
                  <CardTitle>Twilio Configuration</CardTitle>
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
            </div>
          </div>
        )}

        {activeSection === "ai" && (
          <div className="space-y-6">
            <Card className="shadow-business-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Configuration
                </CardTitle>
                <CardDescription>Configure AI voice and behavior settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        )}

        {/* Admin Management Section - Only visible to Admin users */}
        {activeSection === "admin" && userProfile?.role === 'Admin' && (
          <div className="space-y-6">
            <Card className="shadow-business-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Admin Management
                </CardTitle>
                <CardDescription>Create and manage Low Admins and Sub Admins</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Create New Admin Form */}
                <div className="border border-border/50 rounded-lg p-4 bg-muted/20">
                  <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create New Admin
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="newAdminName">Full Name</Label>
                      <Input
                        id="newAdminName"
                        value={newAdminName}
                        onChange={(e) => setNewAdminName(e.target.value)}
                        placeholder="Enter full name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newAdminEmail">Email Address</Label>
                      <Input
                        id="newAdminEmail"
                        type="email"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        placeholder="Enter email address"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newAdminPassword">Password</Label>
                      <Input
                        id="newAdminPassword"
                        type="password"
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        placeholder="Enter password (min 6 chars)"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newAdminRole">Role</Label>
                      <Select value={newAdminRole} onValueChange={setNewAdminRole}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low Admin">Low Admin</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    onClick={handleCreateAdmin}
                    disabled={adminLoading || !newAdminEmail || !newAdminName || !newAdminPassword}
                    className="mt-4 w-full md:w-auto"
                  >
                    {adminLoading ? "Creating..." : "Create Admin"}
                  </Button>
                </div>

                {/* Existing Admins List */}
                <div>
                  <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    Current Admins ({admins.length})
                  </h4>
                  
                  {admins.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <UserCheck className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No additional admins created yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {admins.map((admin) => (
                        <div
                          key={admin.id}
                          className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-card"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div>
                                <h5 className="font-medium text-foreground">
                                  {admin.full_name || 'Unnamed Admin'}
                                </h5>
                                <p className="text-sm text-muted-foreground">{admin.email}</p>
                              </div>
                              <Badge 
                                variant={admin.role === 'Admin' ? 'default' : 'secondary'}
                                className="ml-2"
                              >
                                {admin.role}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {admin.id !== userProfile?.id && (
                              <>
                                <Select
                                  value={admin.role}
                                  onValueChange={(newRole) => handleUpdateAdminRole(admin.id, newRole, admin.full_name || admin.email)}
                                  disabled={adminLoading}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Low Admin">Low Admin</SelectItem>
                                    <SelectItem value="Admin">Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                                
                                <Button
                                  onClick={() => handleDeleteAdmin(admin.id, admin.full_name || admin.email)}
                                  disabled={adminLoading}
                                  variant="destructive"
                                  size="sm"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {admin.id === userProfile?.id && (
                              <Badge variant="outline" className="text-xs">
                                You
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
