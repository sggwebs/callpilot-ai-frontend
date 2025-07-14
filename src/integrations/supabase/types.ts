export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          account_number: string
          account_type: string
          balance: number | null
          created_at: string | null
          currency: string | null
          id: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          account_number: string
          account_type: string
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          account_number?: string
          account_type?: string
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_signals: {
        Row: {
          confidence: number
          expires_at: string | null
          id: string
          reasoning: string | null
          signal_type: string
          source: string
          stop_loss: number | null
          symbol: string
          target_price: number | null
          timestamp: string | null
        }
        Insert: {
          confidence: number
          expires_at?: string | null
          id?: string
          reasoning?: string | null
          signal_type: string
          source: string
          stop_loss?: number | null
          symbol: string
          target_price?: number | null
          timestamp?: string | null
        }
        Update: {
          confidence?: number
          expires_at?: string | null
          id?: string
          reasoning?: string | null
          signal_type?: string
          source?: string
          stop_loss?: number | null
          symbol?: string
          target_price?: number | null
          timestamp?: string | null
        }
        Relationships: []
      }
      alerts: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          symbol: string | null
          title: string
          trigger_price: number | null
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          symbol?: string | null
          title: string
          trigger_price?: number | null
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          symbol?: string | null
          title?: string
          trigger_price?: number | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alerts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      call_logs: {
        Row: {
          agent_id: string
          ai_sentiment: string | null
          ai_summary: string | null
          call_status: string
          call_type: string
          created_at: string
          duration: number | null
          id: string
          lead_id: string
          notes: string | null
          recording_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_id: string
          ai_sentiment?: string | null
          ai_summary?: string | null
          call_status: string
          call_type: string
          created_at?: string
          duration?: number | null
          id?: string
          lead_id: string
          notes?: string | null
          recording_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_id?: string
          ai_sentiment?: string | null
          ai_summary?: string | null
          call_status?: string
          call_type?: string
          created_at?: string
          duration?: number | null
          id?: string
          lead_id?: string
          notes?: string | null
          recording_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_logs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      economic_calendar: {
        Row: {
          actual: number | null
          country: string
          created_at: string | null
          currency: string
          description: string | null
          event_time: string
          forecast: number | null
          id: string
          impact: string | null
          previous: number | null
          title: string
        }
        Insert: {
          actual?: number | null
          country: string
          created_at?: string | null
          currency: string
          description?: string | null
          event_time: string
          forecast?: number | null
          id?: string
          impact?: string | null
          previous?: number | null
          title: string
        }
        Update: {
          actual?: number | null
          country?: string
          created_at?: string | null
          currency?: string
          description?: string | null
          event_time?: string
          forecast?: number | null
          id?: string
          impact?: string | null
          previous?: number | null
          title?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          subject: string
          template_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          subject: string
          template_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string
          template_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          ai_insights: Json | null
          assigned_agent_id: string | null
          best_call_time: string | null
          call_history: Json | null
          call_outcome: string | null
          campaign_id: string | null
          company: string | null
          conversion_probability: number | null
          created_at: string
          email: string | null
          email_history: Json | null
          estimated_value: number | null
          id: string
          interaction_count: number | null
          last_contact_date: string | null
          last_interaction_type: string | null
          lead_score: number | null
          name: string
          next_follow_up_date: string | null
          notes: string | null
          phone: string | null
          preferred_contact_method: string | null
          priority: number | null
          source: string | null
          status: string | null
          tags: string[] | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_insights?: Json | null
          assigned_agent_id?: string | null
          best_call_time?: string | null
          call_history?: Json | null
          call_outcome?: string | null
          campaign_id?: string | null
          company?: string | null
          conversion_probability?: number | null
          created_at?: string
          email?: string | null
          email_history?: Json | null
          estimated_value?: number | null
          id?: string
          interaction_count?: number | null
          last_contact_date?: string | null
          last_interaction_type?: string | null
          lead_score?: number | null
          name: string
          next_follow_up_date?: string | null
          notes?: string | null
          phone?: string | null
          preferred_contact_method?: string | null
          priority?: number | null
          source?: string | null
          status?: string | null
          tags?: string[] | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_insights?: Json | null
          assigned_agent_id?: string | null
          best_call_time?: string | null
          call_history?: Json | null
          call_outcome?: string | null
          campaign_id?: string | null
          company?: string | null
          conversion_probability?: number | null
          created_at?: string
          email?: string | null
          email_history?: Json | null
          estimated_value?: number | null
          id?: string
          interaction_count?: number | null
          last_contact_date?: string | null
          last_interaction_type?: string | null
          lead_score?: number | null
          name?: string
          next_follow_up_date?: string | null
          notes?: string | null
          phone?: string | null
          preferred_contact_method?: string | null
          priority?: number | null
          source?: string | null
          status?: string | null
          tags?: string[] | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      news_feed: {
        Row: {
          category: string
          content: string | null
          created_at: string | null
          id: string
          impact: string | null
          published_at: string
          source: string
          symbols: string[] | null
          title: string
        }
        Insert: {
          category: string
          content?: string | null
          created_at?: string | null
          id?: string
          impact?: string | null
          published_at: string
          source: string
          symbols?: string[] | null
          title: string
        }
        Update: {
          category?: string
          content?: string | null
          created_at?: string | null
          id?: string
          impact?: string | null
          published_at?: string
          source?: string
          symbols?: string[] | null
          title?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          account_id: string | null
          avg_fill_price: number | null
          created_at: string | null
          fees: number | null
          filled_quantity: number | null
          id: string
          order_type: string
          price: number | null
          quantity: number
          status: string | null
          stop_price: number | null
          symbol: string
          type: string
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          avg_fill_price?: number | null
          created_at?: string | null
          fees?: number | null
          filled_quantity?: number | null
          id?: string
          order_type: string
          price?: number | null
          quantity: number
          status?: string | null
          stop_price?: number | null
          symbol: string
          type: string
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          avg_fill_price?: number | null
          created_at?: string | null
          fees?: number | null
          filled_quantity?: number | null
          id?: string
          order_type?: string
          price?: number | null
          quantity?: number
          status?: string | null
          stop_price?: number | null
          symbol?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      positions: {
        Row: {
          account_id: string | null
          avg_price: number
          current_price: number
          id: string
          market_value: number
          open_time: string | null
          profit_loss: number
          profit_loss_percent: number
          quantity: number
          symbol: string
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          avg_price: number
          current_price: number
          id?: string
          market_value: number
          open_time?: string | null
          profit_loss: number
          profit_loss_percent: number
          quantity: number
          symbol: string
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          avg_price?: number
          current_price?: number
          id?: string
          market_value?: number
          open_time?: string | null
          profit_loss?: number
          profit_loss_percent?: number
          quantity?: number
          symbol?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "positions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_id: string | null
          address: Json | null
          bio: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          kyc_status: string | null
          phone: string | null
          profile_picture: string | null
          role: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          account_id?: string | null
          address?: Json | null
          bio?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          kyc_status?: string | null
          phone?: string | null
          profile_picture?: string | null
          role?: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          account_id?: string | null
          address?: Json | null
          bio?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          kyc_status?: string | null
          phone?: string | null
          profile_picture?: string | null
          role?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      trade_history: {
        Row: {
          account_id: string | null
          executed_at: string | null
          fees: number | null
          id: string
          price: number
          profit_loss: number | null
          quantity: number
          symbol: string
          total_value: number
          type: string
        }
        Insert: {
          account_id?: string | null
          executed_at?: string | null
          fees?: number | null
          id?: string
          price: number
          profit_loss?: number | null
          quantity: number
          symbol: string
          total_value: number
          type: string
        }
        Update: {
          account_id?: string | null
          executed_at?: string | null
          fees?: number | null
          id?: string
          price?: number
          profit_loss?: number | null
          quantity?: number
          symbol?: string
          total_value?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_history_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      trades: {
        Row: {
          account_id: string | null
          created_at: string | null
          current_price: number | null
          entry_price: number
          executed_at: string | null
          exit_price: number | null
          fees: number | null
          id: string
          order_type: string
          profit_loss: number | null
          quantity: number
          status: string | null
          symbol: string
          type: string
        }
        Insert: {
          account_id?: string | null
          created_at?: string | null
          current_price?: number | null
          entry_price: number
          executed_at?: string | null
          exit_price?: number | null
          fees?: number | null
          id?: string
          order_type: string
          profit_loss?: number | null
          quantity: number
          status?: string | null
          symbol: string
          type: string
        }
        Update: {
          account_id?: string | null
          created_at?: string | null
          current_price?: number | null
          entry_price?: number
          executed_at?: string | null
          exit_price?: number | null
          fees?: number | null
          id?: string
          order_type?: string
          profit_loss?: number | null
          quantity?: number
          status?: string | null
          symbol?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "trades_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      watchlists: {
        Row: {
          assets: string[] | null
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assets?: string[] | null
          created_at?: string | null
          id?: string
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assets?: string[] | null
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "watchlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_demo_account_data: {
        Args: { user_uuid: string; account_type?: string }
        Returns: string
      }
      create_user_profile: {
        Args: {
          user_id: string
          user_email: string
          user_name: string
          user_phone?: string
          user_role?: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
