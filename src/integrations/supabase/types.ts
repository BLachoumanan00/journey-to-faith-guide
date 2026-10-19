export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      answers: {
        Row: {
          answer_text: string
          choice_index: number | null
          id: string
          lesson_id: string
          question_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answer_text?: string
          choice_index?: number | null
          id?: string
          lesson_id: string
          question_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          answer_text?: string
          choice_index?: number | null
          id?: string
          lesson_id?: string
          question_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "answers_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "lesson_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      baptism_requests: {
        Row: {
          created_at: string
          id: string
          reflection: string
          seeker_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          reflection?: string
          seeker_id: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          reflection?: string
          seeker_id?: string
          status?: string
        }
        Relationships: []
      }
      lesson_messages: {
        Row: {
          author_id: string
          body: string
          created_at: string
          id: string
          lesson_id: string | null
          seeker_id: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          id?: string
          lesson_id?: string | null
          seeker_id: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          id?: string
          lesson_id?: string | null
          seeker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_messages_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_questions: {
        Row: {
          correct_index: number | null
          id: string
          lesson_id: string
          options_en: string[]
          options_fr: string[]
          position: number
          prompt_en: string
          prompt_fr: string
          verse_ref: string
        }
        Insert: {
          correct_index?: number | null
          id?: string
          lesson_id: string
          options_en?: string[]
          options_fr?: string[]
          position: number
          prompt_en?: string
          prompt_fr: string
          verse_ref?: string
        }
        Update: {
          correct_index?: number | null
          id?: string
          lesson_id?: string
          options_en?: string[]
          options_fr?: string[]
          position?: number
          prompt_en?: string
          prompt_fr?: string
          verse_ref?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_questions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          explanation_en: string
          explanation_fr: string
          id: string
          intro_en: string
          intro_fr: string
          position: number
          takeaway_en: string
          takeaway_fr: string
          title_en: string
          title_fr: string
        }
        Insert: {
          explanation_en?: string
          explanation_fr?: string
          id?: string
          intro_en?: string
          intro_fr?: string
          position: number
          takeaway_en?: string
          takeaway_fr?: string
          title_en: string
          title_fr: string
        }
        Update: {
          explanation_en?: string
          explanation_fr?: string
          id?: string
          intro_en?: string
          intro_fr?: string
          position?: number
          takeaway_en?: string
          takeaway_fr?: string
          title_en?: string
          title_fr?: string
        }
        Relationships: []
      }
      mentor_links: {
        Row: {
          created_at: string
          id: string
          mentor_id: string
          seeker_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mentor_id: string
          seeker_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mentor_id?: string
          seeker_id?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          body: string
          created_at: string
          id: string
          kind: string
          lesson_id: string | null
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          kind?: string
          lesson_id?: string | null
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          kind?: string
          lesson_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      phone_auth_challenges: {
        Row: {
          attempts: number
          consumed_at: string | null
          created_at: string
          details_encrypted: string
          expires_at: string
          guest_id: string | null
          id: string
          otp_type: string
          phone_encrypted: string
          phone_hash: string
          secret_hash: string
        }
        Insert: {
          attempts?: number
          consumed_at?: string | null
          created_at?: string
          details_encrypted: string
          expires_at?: string
          guest_id?: string | null
          id?: string
          otp_type?: string
          phone_encrypted: string
          phone_hash: string
          secret_hash: string
        }
        Update: {
          attempts?: number
          consumed_at?: string | null
          created_at?: string
          details_encrypted?: string
          expires_at?: string
          guest_id?: string | null
          id?: string
          otp_type?: string
          phone_encrypted?: string
          phone_hash?: string
          secret_hash?: string
        }
        Relationships: []
      }
      phone_auth_limits: {
        Row: {
          key_hash: string
          last_request: string
          requests: number
          window_start: string
        }
        Insert: {
          key_hash: string
          last_request?: string
          requests?: number
          window_start?: string
        }
        Update: {
          key_hash?: string
          last_request?: string
          requests?: number
          window_start?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          id: string
          invite_code: string
          preferred_lang: string
          reminders_enabled: boolean
        }
        Insert: {
          created_at?: string
          display_name?: string
          id: string
          invite_code?: string
          preferred_lang?: string
          reminders_enabled?: boolean
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          invite_code?: string
          preferred_lang?: string
          reminders_enabled?: boolean
        }
        Relationships: []
      }
      progress: {
        Row: {
          completed_at: string | null
          id: string
          lesson_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          lesson_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          lesson_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      study_sessions: {
        Row: {
          created_at: string
          id: string
          mentor_id: string
          notes: string
          scheduled_at: string
          seeker_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mentor_id: string
          notes?: string
          scheduled_at: string
          seeker_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mentor_id?: string
          notes?: string
          scheduled_at?: string
          seeker_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          address_encrypted: string
          consent_privacy_at: string
          consent_sensitive_at: string | null
          created_at: string
          full_name: string
          id: string
          last_login: string
          phone_encrypted: string
          phone_hash: string
          policy_version: string
        }
        Insert: {
          address_encrypted: string
          consent_privacy_at?: string
          consent_sensitive_at?: string | null
          created_at?: string
          full_name: string
          id: string
          last_login?: string
          phone_encrypted: string
          phone_hash: string
          policy_version?: string
        }
        Update: {
          address_encrypted?: string
          consent_privacy_at?: string
          consent_sensitive_at?: string | null
          created_at?: string
          full_name?: string
          id?: string
          last_login?: string
          phone_encrypted?: string
          phone_hash?: string
          policy_version?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_phone_attempt: {
        Args: { _id: string; _secret_hash: string }
        Returns: {
          attempts: number
          consumed_at: string | null
          created_at: string
          details_encrypted: string
          expires_at: string
          guest_id: string | null
          id: string
          otp_type: string
          phone_encrypted: string
          phone_hash: string
          secret_hash: string
        }[]
        SetofOptions: {
          from: "*"
          to: "phone_auth_challenges"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      claim_phone_request: {
        Args: { _ip_hash: string; _phone_hash: string }
        Returns: boolean
      }
      finish_phone_challenge: {
        Args: { _id: string; _secret_hash: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_sensitive_consent: { Args: never; Returns: boolean }
      is_mentor_of: {
        Args: { _mentor: string; _seeker: string }
        Returns: boolean
      }
      link_seeker_by_code: { Args: { _code: string }; Returns: string }
      transfer_guest_study: {
        Args: { _guest: string; _user: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "seeker" | "mentor" | "admin"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["seeker", "mentor", "admin"],
    },
  },
} as const
