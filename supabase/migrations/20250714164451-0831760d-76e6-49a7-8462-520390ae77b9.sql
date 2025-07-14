-- Create leads table with comprehensive call center features
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'cold', 'warm', 'hot', 'qualified', 'converted', 'lost')),
  source TEXT DEFAULT 'manual',
  assigned_agent_id UUID,
  priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
  notes TEXT,
  tags TEXT[],
  last_contact_date TIMESTAMP WITH TIME ZONE,
  next_follow_up_date TIMESTAMP WITH TIME ZONE,
  conversion_probability DECIMAL(5,2) DEFAULT 0.00,
  estimated_value DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID NOT NULL,
  -- AI-powered call center fields
  call_history JSONB DEFAULT '[]',
  email_history JSONB DEFAULT '[]',
  ai_insights JSONB DEFAULT '{}',
  lead_score INTEGER DEFAULT 0,
  interaction_count INTEGER DEFAULT 0,
  last_interaction_type TEXT,
  preferred_contact_method TEXT DEFAULT 'phone' CHECK (preferred_contact_method IN ('phone', 'email', 'sms', 'whatsapp')),
  timezone TEXT DEFAULT 'UTC',
  best_call_time TEXT,
  call_outcome TEXT,
  campaign_id UUID
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own leads" 
ON public.leads 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Agents can view assigned leads" 
ON public.leads 
FOR SELECT 
USING (assigned_agent_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_leads_user_id ON public.leads(user_id);
CREATE INDEX idx_leads_assigned_agent ON public.leads(assigned_agent_id);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_priority ON public.leads(priority);
CREATE INDEX idx_leads_lead_score ON public.leads(lead_score);
CREATE INDEX idx_leads_next_follow_up ON public.leads(next_follow_up_date);

-- Create trigger for updated_at
CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create call logs table for detailed call tracking
CREATE TABLE public.call_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL,
  call_type TEXT NOT NULL CHECK (call_type IN ('inbound', 'outbound')),
  call_status TEXT NOT NULL CHECK (call_status IN ('answered', 'no_answer', 'busy', 'voicemail', 'failed')),
  duration INTEGER DEFAULT 0, -- in seconds
  notes TEXT,
  ai_summary TEXT,
  ai_sentiment TEXT,
  recording_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID NOT NULL
);

-- Enable RLS for call logs
ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for call logs
CREATE POLICY "Users can manage their own call logs" 
ON public.call_logs 
FOR ALL 
USING (auth.uid() = user_id);

-- Create indexes for call logs
CREATE INDEX idx_call_logs_lead_id ON public.call_logs(lead_id);
CREATE INDEX idx_call_logs_agent_id ON public.call_logs(agent_id);
CREATE INDEX idx_call_logs_created_at ON public.call_logs(created_at);

-- Create trigger for call logs updated_at
CREATE TRIGGER update_call_logs_updated_at
BEFORE UPDATE ON public.call_logs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create email templates table
CREATE TABLE public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  template_type TEXT DEFAULT 'general' CHECK (template_type IN ('general', 'follow_up', 'introduction', 'proposal', 'reminder')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID NOT NULL
);

-- Enable RLS for email templates
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for email templates
CREATE POLICY "Users can manage their own email templates" 
ON public.email_templates 
FOR ALL 
USING (auth.uid() = user_id);

-- Create trigger for email templates updated_at
CREATE TRIGGER update_email_templates_updated_at
BEFORE UPDATE ON public.email_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();