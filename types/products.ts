export interface Product {
  id: string;
  user_id: string;
  name: string;
  sku: string | null;
  salla_product_id: string | null;
  source: 'manual' | 'salla';
  has_pricing: boolean;
  price: number;
  category: string | null;
  image_url: string | null;
  url: string | null;
  is_available: boolean;
  description: string | null;
  quantity: number | null;
  weight: number | null;
  created_at: string;
  updated_at: string;
}

export interface ProductPricing {
  id: string;
  product_id: string;
  user_id: string;
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
  final_price: number;
  suggested_price: number;
  price_range_match: boolean;
  created_at: string;
}

export interface SallaProduct {
  id: number | string;
  name: string;
  sku: string | null;
}

export interface SyncResult {
  success: boolean;
  count?: number;
  error?: {
    message: string;
  };
}