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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      costing: {
        Row: {
          created_at: string | null
          fabric_cost: number | null
          id: string
          labor_cost: number | null
          margin: number | null
          overhead_cost: number | null
          selling_price: number | null
          style_name: string | null
          style_no: string
          total_cost: number | null
          trims_cost: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          fabric_cost?: number | null
          id?: string
          labor_cost?: number | null
          margin?: number | null
          overhead_cost?: number | null
          selling_price?: number | null
          style_name?: string | null
          style_no: string
          total_cost?: number | null
          trims_cost?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          fabric_cost?: number | null
          id?: string
          labor_cost?: number | null
          margin?: number | null
          overhead_cost?: number | null
          selling_price?: number | null
          style_name?: string | null
          style_no?: string
          total_cost?: number | null
          trims_cost?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      cutting_planner: {
        Row: {
          balance: number | null
          color: string | null
          created_at: string | null
          cut_date: string | null
          cut_qty: number | null
          fabric: string | null
          id: string
          lot_no: string
          planned_qty: number | null
          status: string | null
          style: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number | null
          color?: string | null
          created_at?: string | null
          cut_date?: string | null
          cut_qty?: number | null
          fabric?: string | null
          id?: string
          lot_no: string
          planned_qty?: number | null
          status?: string | null
          style?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number | null
          color?: string | null
          created_at?: string | null
          cut_date?: string | null
          cut_qty?: number | null
          fabric?: string | null
          id?: string
          lot_no?: string
          planned_qty?: number | null
          status?: string | null
          style?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      delivery_challan: {
        Row: {
          challan_date: string | null
          challan_no: string
          created_at: string | null
          customer: string
          destination: string | null
          driver_name: string | null
          id: string
          items: Json | null
          remarks: string | null
          status: string | null
          total_qty: number | null
          updated_at: string | null
          user_id: string
          vehicle_no: string | null
        }
        Insert: {
          challan_date?: string | null
          challan_no: string
          created_at?: string | null
          customer: string
          destination?: string | null
          driver_name?: string | null
          id?: string
          items?: Json | null
          remarks?: string | null
          status?: string | null
          total_qty?: number | null
          updated_at?: string | null
          user_id: string
          vehicle_no?: string | null
        }
        Update: {
          challan_date?: string | null
          challan_no?: string
          created_at?: string | null
          customer?: string
          destination?: string | null
          driver_name?: string | null
          id?: string
          items?: Json | null
          remarks?: string | null
          status?: string | null
          total_qty?: number | null
          updated_at?: string | null
          user_id?: string
          vehicle_no?: string | null
        }
        Relationships: []
      }
      fabric_to_procure: {
        Row: {
          color: string | null
          created_at: string | null
          fabric_code: string
          fabric_name: string
          id: string
          order_date: string | null
          ordered_qty: number | null
          received_qty: number | null
          required_qty: number | null
          status: string | null
          supplier: string | null
          unit: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          fabric_code: string
          fabric_name: string
          id?: string
          order_date?: string | null
          ordered_qty?: number | null
          received_qty?: number | null
          required_qty?: number | null
          status?: string | null
          supplier?: string | null
          unit?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          fabric_code?: string
          fabric_name?: string
          id?: string
          order_date?: string | null
          ordered_qty?: number | null
          received_qty?: number | null
          required_qty?: number | null
          status?: string | null
          supplier?: string | null
          unit?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          balance: number | null
          created_at: string | null
          customer: string
          customer_address: string | null
          due_date: string | null
          id: string
          invoice_date: string | null
          invoice_no: string
          items: Json | null
          paid_amount: number | null
          status: string | null
          subtotal: number | null
          tax_amount: number | null
          total_amount: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          customer: string
          customer_address?: string | null
          due_date?: string | null
          id?: string
          invoice_date?: string | null
          invoice_no: string
          items?: Json | null
          paid_amount?: number | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          customer?: string
          customer_address?: string | null
          due_date?: string | null
          id?: string
          invoice_date?: string | null
          invoice_no?: string
          items?: Json | null
          paid_amount?: number | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      inward_register: {
        Row: {
          created_at: string | null
          grn_date: string | null
          grn_no: string
          id: string
          items: Json | null
          po_no: string | null
          received_by: string | null
          remarks: string | null
          status: string | null
          supplier: string
          total_qty: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          grn_date?: string | null
          grn_no: string
          id?: string
          items?: Json | null
          po_no?: string | null
          received_by?: string | null
          remarks?: string | null
          status?: string | null
          supplier: string
          total_qty?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          grn_date?: string | null
          grn_no?: string
          id?: string
          items?: Json | null
          po_no?: string | null
          received_by?: string | null
          remarks?: string | null
          status?: string | null
          supplier?: string
          total_qty?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      outward_register: {
        Row: {
          created_at: string | null
          customer: string
          dispatch_date: string | null
          dispatch_no: string
          dispatched_by: string | null
          id: string
          items: Json | null
          order_no: string | null
          remarks: string | null
          status: string | null
          total_qty: number | null
          updated_at: string | null
          user_id: string
          vehicle_no: string | null
        }
        Insert: {
          created_at?: string | null
          customer: string
          dispatch_date?: string | null
          dispatch_no: string
          dispatched_by?: string | null
          id?: string
          items?: Json | null
          order_no?: string | null
          remarks?: string | null
          status?: string | null
          total_qty?: number | null
          updated_at?: string | null
          user_id: string
          vehicle_no?: string | null
        }
        Update: {
          created_at?: string | null
          customer?: string
          dispatch_date?: string | null
          dispatch_no?: string
          dispatched_by?: string | null
          id?: string
          items?: Json | null
          order_no?: string | null
          remarks?: string | null
          status?: string | null
          total_qty?: number | null
          updated_at?: string | null
          user_id?: string
          vehicle_no?: string | null
        }
        Relationships: []
      }
      payment_voucher: {
        Row: {
          amount: number | null
          approved_by: string | null
          created_at: string | null
          id: string
          payee: string
          payment_mode: string | null
          purpose: string | null
          reference_no: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          voucher_date: string | null
          voucher_no: string
        }
        Insert: {
          amount?: number | null
          approved_by?: string | null
          created_at?: string | null
          id?: string
          payee: string
          payment_mode?: string | null
          purpose?: string | null
          reference_no?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          voucher_date?: string | null
          voucher_no: string
        }
        Update: {
          amount?: number | null
          approved_by?: string | null
          created_at?: string | null
          id?: string
          payee?: string
          payment_mode?: string | null
          purpose?: string | null
          reference_no?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          voucher_date?: string | null
          voucher_no?: string
        }
        Relationships: []
      }
      production_planner: {
        Row: {
          buyer: string | null
          completed_qty: number | null
          created_at: string | null
          end_date: string | null
          id: string
          order_no: string
          start_date: string | null
          status: string | null
          style: string | null
          target_qty: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          buyer?: string | null
          completed_qty?: number | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          order_no: string
          start_date?: string | null
          status?: string | null
          style?: string | null
          target_qty?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          buyer?: string | null
          completed_qty?: number | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          order_no?: string
          start_date?: string | null
          status?: string | null
          style?: string | null
          target_qty?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      return_register: {
        Row: {
          action_taken: string | null
          created_at: string | null
          id: string
          items: Json | null
          original_doc_no: string | null
          party_name: string
          reason: string | null
          return_date: string | null
          return_no: string
          return_type: string | null
          status: string | null
          total_qty: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          action_taken?: string | null
          created_at?: string | null
          id?: string
          items?: Json | null
          original_doc_no?: string | null
          party_name: string
          reason?: string | null
          return_date?: string | null
          return_no: string
          return_type?: string | null
          status?: string | null
          total_qty?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          action_taken?: string | null
          created_at?: string | null
          id?: string
          items?: Json | null
          original_doc_no?: string | null
          party_name?: string
          reason?: string | null
          return_date?: string | null
          return_no?: string
          return_type?: string | null
          status?: string | null
          total_qty?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      stock_register: {
        Row: {
          category: string | null
          created_at: string | null
          current_stock: number | null
          id: string
          item_code: string
          item_name: string
          location: string | null
          max_stock: number | null
          min_stock: number | null
          status: string | null
          unit: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          current_stock?: number | null
          id?: string
          item_code: string
          item_name: string
          location?: string | null
          max_stock?: number | null
          min_stock?: number | null
          status?: string | null
          unit?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          current_stock?: number | null
          id?: string
          item_code?: string
          item_name?: string
          location?: string | null
          max_stock?: number | null
          min_stock?: number | null
          status?: string | null
          unit?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      trims_register: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          quantity: number | null
          rate: number | null
          status: string | null
          supplier: string | null
          trim_id: string
          trim_name: string
          unit: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          quantity?: number | null
          rate?: number | null
          status?: string | null
          supplier?: string | null
          trim_id: string
          trim_name: string
          unit?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          quantity?: number | null
          rate?: number | null
          status?: string | null
          supplier?: string | null
          trim_id?: string
          trim_name?: string
          unit?: string | null
          updated_at?: string | null
          user_id?: string
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
