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
      order_items: {
        Row: {
          id: number
          linked_product_id: string | null
          notes: string | null
          order_id: number | null
          price: number | null
          product_name: string | null
          quantity: number | null
        }
        Insert: {
          id?: number
          linked_product_id?: string | null
          notes?: string | null
          order_id?: number | null
          price?: number | null
          product_name?: string | null
          quantity?: number | null
        }
        Update: {
          id?: number
          linked_product_id?: string | null
          notes?: string | null
          order_id?: number | null
          price?: number | null
          product_name?: string | null
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_production: {
        Row: {
          assigned_tailor_id: string | null
          id: number
          last_updated: string | null
          notes: string | null
          order_item_id: number | null
          status: string | null
        }
        Insert: {
          assigned_tailor_id?: string | null
          id?: number
          last_updated?: string | null
          notes?: string | null
          order_item_id?: number | null
          status?: string | null
        }
        Update: {
          assigned_tailor_id?: string | null
          id?: number
          last_updated?: string | null
          notes?: string | null
          order_item_id?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_production_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          customer_name: string | null
          customer_phone: string | null
          delivery_address: string | null
          id: number
          order_date: string | null
          payment_method: string | null
          status: string | null
          total_price: number | null
          user_id: string | null
        }
        Insert: {
          customer_name?: string | null
          customer_phone?: string | null
          delivery_address?: string | null
          id: number
          order_date?: string | null
          payment_method?: string | null
          status?: string | null
          total_price?: number | null
          user_id?: string | null
        }
        Update: {
          customer_name?: string | null
          customer_phone?: string | null
          delivery_address?: string | null
          id?: number
          order_date?: string | null
          payment_method?: string | null
          status?: string | null
          total_price?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string | null
          delivery_cost: number | null
          extra_expenses: number | null
          final_price: number | null
          fixed_costs: number | null
          has_scarf: boolean | null
          id: string
          main_fabric_cost: number | null
          matched_segment: string | null
          name: string
          packaging_cost: number | null
          profit_margin: number | null
          scarf_main_fabric_cost: number | null
          scarf_secondary_fabric_cost: number | null
          secondary_fabric_cost: number | null
          sewing_cost: number | null
          sku: string | null
          suggested_price: number | null
          target_segment: string | null
          total_cost: number | null
          total_direct_cost: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_cost?: number | null
          extra_expenses?: number | null
          final_price?: number | null
          fixed_costs?: number | null
          has_scarf?: boolean | null
          id?: string
          main_fabric_cost?: number | null
          matched_segment?: string | null
          name: string
          packaging_cost?: number | null
          profit_margin?: number | null
          scarf_main_fabric_cost?: number | null
          scarf_secondary_fabric_cost?: number | null
          secondary_fabric_cost?: number | null
          sewing_cost?: number | null
          sku?: string | null
          suggested_price?: number | null
          target_segment?: string | null
          total_cost?: number | null
          total_direct_cost?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_cost?: number | null
          extra_expenses?: number | null
          final_price?: number | null
          fixed_costs?: number | null
          has_scarf?: boolean | null
          id?: string
          main_fabric_cost?: number | null
          matched_segment?: string | null
          name?: string
          packaging_cost?: number | null
          profit_margin?: number | null
          scarf_main_fabric_cost?: number | null
          scarf_secondary_fabric_cost?: number | null
          secondary_fabric_cost?: number | null
          sewing_cost?: number | null
          sku?: string | null
          suggested_price?: number | null
          target_segment?: string | null
          total_cost?: number | null
          total_direct_cost?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      project_settings: {
        Row: {
          default_profit_margin: number | null
          expected_sales: number | null
          project_name: string | null
          project_type: string | null
          target_audience: string | null
          user_id: string
        }
        Insert: {
          default_profit_margin?: number | null
          expected_sales?: number | null
          project_name?: string | null
          project_type?: string | null
          target_audience?: string | null
          user_id: string
        }
        Update: {
          default_profit_margin?: number | null
          expected_sales?: number | null
          project_name?: string | null
          project_type?: string | null
          target_audience?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      salla_stores: {
        Row: {
          access_token: string
          created_at: string | null
          domain: string | null
          id: string
          refresh_token: string | null
          store_hash: string
          store_name: string | null
        }
        Insert: {
          access_token: string
          created_at?: string | null
          domain?: string | null
          id?: string
          refresh_token?: string | null
          store_hash: string
          store_name?: string | null
        }
        Update: {
          access_token?: string
          created_at?: string | null
          domain?: string | null
          id?: string
          refresh_token?: string | null
          store_hash?: string
          store_name?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          features: string[] | null
          id: string
          name: string | null
          plan: string | null
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          features?: string[] | null
          id: string
          name?: string | null
          plan?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          features?: string[] | null
          id?: string
          name?: string | null
          plan?: string | null
          role?: string | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
