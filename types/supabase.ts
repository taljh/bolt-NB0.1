export type Database = {
  public: {
    Tables: {
      products_new: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          sku: string | null;
          salla_product_id: string | null;
          source: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          sku?: string | null;
          salla_product_id?: string | null;
          source?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          sku?: string | null;
          salla_product_id?: string | null;
          source?: string | null;
          created_at?: string | null;
        };
      };
      pricing_details: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          fabric_main_cost: number | null;
          fabric_secondary_cost: number | null;
          turha_main_cost: number | null;
          turha_secondary_cost: number | null;
          tailoring_cost: number | null;
          packaging_cost: number | null;
          delivery_cost: number | null;
          extra_expenses: number | null;
          profit_margin: number | null;
          target_audience: string | null;
          total_direct_cost: number | null;
          total_fixed_cost: number | null;
          final_price: number | null;
          suggested_price: number | null;
          price_range_match: boolean | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          fabric_main_cost?: number | null;
          fabric_secondary_cost?: number | null;
          turha_main_cost?: number | null;
          turha_secondary_cost?: number | null;
          tailoring_cost?: number | null;
          packaging_cost?: number | null;
          delivery_cost?: number | null;
          extra_expenses?: number | null;
          profit_margin?: number | null;
          target_audience?: string | null;
          total_direct_cost?: number | null;
          total_fixed_cost?: number | null;
          final_price?: number | null;
          suggested_price?: number | null;
          price_range_match?: boolean | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          fabric_main_cost?: number | null;
          fabric_secondary_cost?: number | null;
          turha_main_cost?: number | null;
          turha_secondary_cost?: number | null;
          tailoring_cost?: number | null;
          packaging_cost?: number | null;
          delivery_cost?: number | null;
          extra_expenses?: number | null;
          profit_margin?: number | null;
          target_audience?: string | null;
          total_direct_cost?: number | null;
          total_fixed_cost?: number | null;
          final_price?: number | null;
          suggested_price?: number | null;
          price_range_match?: boolean | null;
          created_at?: string | null;
        };
      };
    };
  };
};
