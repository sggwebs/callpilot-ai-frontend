-- Check if user_settings table exists, if not create it
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_settings') THEN
        CREATE TABLE public.user_settings (
          id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID NOT NULL,
          setting_type TEXT NOT NULL,
          settings JSONB NOT NULL DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          UNIQUE(user_id, setting_type)
        );
        
        -- Enable Row Level Security
        ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY "Users can manage their own settings" 
        ON public.user_settings 
        FOR ALL 
        USING (auth.uid() = user_id);
        
        -- Create trigger for timestamps
        CREATE TRIGGER update_user_settings_updated_at
          BEFORE UPDATE ON public.user_settings
          FOR EACH ROW
          EXECUTE FUNCTION public.update_updated_at_column();
          
        -- Create index
        CREATE INDEX idx_user_settings_user_type ON public.user_settings(user_id, setting_type);
    END IF;
END $$;