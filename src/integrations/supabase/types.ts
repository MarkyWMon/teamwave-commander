export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      email_templates: {
        Row: {
          content: string
          created_at: string
          created_by: string
          description: string | null
          id: string
          name: string
          subject: string
          template_type: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          name: string
          subject: string
          template_type: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          subject?: string
          template_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      fixtures: {
        Row: {
          away_team_id: string
          created_at: string
          created_by: string
          home_team_id: string
          id: string
          match_date: string
          notes: string | null
          pitch_id: string
          status: Database["public"]["Enums"]["match_status"]
          updated_at: string
        }
        Insert: {
          away_team_id: string
          created_at?: string
          created_by: string
          home_team_id: string
          id?: string
          match_date: string
          notes?: string | null
          pitch_id: string
          status?: Database["public"]["Enums"]["match_status"]
          updated_at?: string
        }
        Update: {
          away_team_id?: string
          created_at?: string
          created_by?: string
          home_team_id?: string
          id?: string
          match_date?: string
          notes?: string | null
          pitch_id?: string
          status?: Database["public"]["Enums"]["match_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fixtures_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fixtures_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fixtures_pitch_id_fkey"
            columns: ["pitch_id"]
            isOneToOne: false
            referencedRelation: "pitches"
            referencedColumns: ["id"]
          },
        ]
      }
      pitches: {
        Row: {
          access_instructions: string | null
          address_line1: string
          address_line2: string | null
          amenities: Json | null
          city: string
          county: string | null
          created_at: string
          created_by: string
          equipment_requirements: string | null
          id: string
          latitude: number
          lighting_type: Database["public"]["Enums"]["pitch_lighting"]
          longitude: number
          map_url: string
          name: string
          parking_info: string | null
          postal_code: string
          special_instructions: string | null
          surface_type: Database["public"]["Enums"]["pitch_surface"]
          updated_at: string
          usage_restrictions: string | null
        }
        Insert: {
          access_instructions?: string | null
          address_line1: string
          address_line2?: string | null
          amenities?: Json | null
          city: string
          county?: string | null
          created_at?: string
          created_by: string
          equipment_requirements?: string | null
          id?: string
          latitude: number
          lighting_type?: Database["public"]["Enums"]["pitch_lighting"]
          longitude: number
          map_url: string
          name: string
          parking_info?: string | null
          postal_code: string
          special_instructions?: string | null
          surface_type?: Database["public"]["Enums"]["pitch_surface"]
          updated_at?: string
          usage_restrictions?: string | null
        }
        Update: {
          access_instructions?: string | null
          address_line1?: string
          address_line2?: string | null
          amenities?: Json | null
          city?: string
          county?: string | null
          created_at?: string
          created_by?: string
          equipment_requirements?: string | null
          id?: string
          latitude?: number
          lighting_type?: Database["public"]["Enums"]["pitch_lighting"]
          longitude?: number
          map_url?: string
          name?: string
          parking_info?: string | null
          postal_code?: string
          special_instructions?: string | null
          surface_type?: Database["public"]["Enums"]["pitch_surface"]
          updated_at?: string
          usage_restrictions?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          club_name: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          managed_teams: string[] | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          club_name?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          managed_teams?: string[] | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          club_name?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          managed_teams?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      team_imports: {
        Row: {
          created_at: string
          created_by: string
          failed_rows: number | null
          field_mappings: Json | null
          file_name: string
          id: string
          processed_rows: number | null
          status: string
          total_rows: number | null
        }
        Insert: {
          created_at?: string
          created_by: string
          failed_rows?: number | null
          field_mappings?: Json | null
          file_name: string
          id?: string
          processed_rows?: number | null
          status?: string
          total_rows?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string
          failed_rows?: number | null
          field_mappings?: Json | null
          file_name?: string
          id?: string
          processed_rows?: number | null
          status?: string
          total_rows?: number | null
        }
        Relationships: []
      }
      team_officials: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["team_official_role"]
          team_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          phone?: string | null
          role: Database["public"]["Enums"]["team_official_role"]
          team_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["team_official_role"]
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_officials_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          age_group: string
          created_at: string
          created_by: string
          gender: Database["public"]["Enums"]["team_gender"]
          id: string
          is_opponent: boolean
          name: string
          team_color: string
        }
        Insert: {
          age_group: string
          created_at?: string
          created_by: string
          gender?: Database["public"]["Enums"]["team_gender"]
          id?: string
          is_opponent?: boolean
          name: string
          team_color?: string
        }
        Update: {
          age_group?: string
          created_at?: string
          created_by?: string
          gender?: Database["public"]["Enums"]["team_gender"]
          id?: string
          is_opponent?: boolean
          name?: string
          team_color?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      match_status: "scheduled" | "completed" | "cancelled" | "postponed"
      pitch_lighting: "none" | "floodlights" | "natural_only" | "partial"
      pitch_surface:
        | "grass"
        | "artificial_grass"
        | "hybrid"
        | "3g"
        | "4g"
        | "5g"
        | "astroturf"
        | "other"
      team_gender: "boys" | "girls" | "mixed"
      team_official_role:
        | "manager"
        | "coach"
        | "assistant_manager"
        | "other"
        | "fixtures_secretary"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
