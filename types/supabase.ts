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
      products: {
        Row: {
          id: string
          user_id: string
          name: string
          sku: string | null
          salla_product_id: string | null
          source: 'manual' | 'salla'
          has_pricing: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          sku?: string | null
          salla_product_id?: string | null
          source: 'manual' | 'salla'
          has_pricing?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          sku?: string | null
          salla_product_id?: string | null
          source?: 'manual' | 'salla'
          has_pricing?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      pricing_details: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          fabric_main_cost: number;
          fabric_secondary_cost: number | null;
          turha_main_cost: number | null;
          turha_secondary_cost: number | null;
          tailoring_cost: number;
          packaging_cost: number;
          delivery_cost: number | null;
          extra_expenses: number | null;
          profit_margin: number;
          target_segment: 'economic' | 'medium' | 'luxury';
          total_direct_cost: number;
          total_fixed_cost: number | null;
          final_price: number;
          suggested_price: number;
          price_range_match: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          fabric_main_cost: number;
          fabric_secondary_cost?: number | null;
          turha_main_cost?: number | null;
          turha_secondary_cost?: number | null;
          tailoring_cost: number;
          packaging_cost: number;
          delivery_cost?: number | null;
          extra_expenses?: number | null;
          profit_margin: number;
          target_segment: 'economic' | 'medium' | 'luxury';
          total_direct_cost: number;
          total_fixed_cost?: number | null;
          final_price: number;
          suggested_price: number;
          price_range_match: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          fabric_main_cost?: number;
          fabric_secondary_cost?: number | null;
          turha_main_cost?: number | null;
          turha_secondary_cost?: number | null;
          tailoring_cost?: number;
          packaging_cost?: number;
          delivery_cost?: number | null;
          extra_expenses?: number | null;
          profit_margin?: number;
          target_segment?: 'economic' | 'medium' | 'luxury';
          total_direct_cost?: number;
          total_fixed_cost?: number | null;
          final_price?: number;
          suggested_price?: number;
          price_range_match?: boolean;
          created_at?: string;
        };
      };
      project_settings: {
        Row: {
          id: string;
          user_id: string;
          default_profit_margin: number;
          default_target_segment: 'economic' | 'medium' | 'luxury';
          default_packaging_cost: number;
          monthly_fixed_costs: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          default_profit_margin: number;
          default_target_segment: 'economic' | 'medium' | 'luxury';
          default_packaging_cost: number;
          monthly_fixed_costs?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          default_profit_margin?: number;
          default_target_segment?: 'economic' | 'medium' | 'luxury';
          default_packaging_cost?: number;
          monthly_fixed_costs?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
