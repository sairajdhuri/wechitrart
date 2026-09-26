export interface PosterSize {
  name: string; // 'A4' | 'A3' | 'A2' | string
  dimensions: string; // '8.3 x 11.7 in'
  priceMultiplier: number;
}

export interface Poster {
  id: string;
  title: string;
  slug: string;
  description: string;
  base_price: number;
  category: string;
  image_url: string;
  sizes: PosterSize[];
  is_featured: boolean;
  stock_status: 'in_stock' | 'limited' | 'sold_out';
  tags: string[];
  created_at?: string;
}

export interface CartItem {
  posterId: string;
  title: string;
  size: string;
  dimensions: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  pincode: string;
}

export interface Order {
  id?: string;
  orderNumber: string;
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  status: 'pending_whatsapp' | 'confirmed' | 'dispatched' | 'cancelled';
  createdAt?: string;
}

export interface AdminUploadForm {
  title: string;
  description: string;
  basePrice: number;
  category: string;
  imageUrl: string;
  isFeatured: boolean;
  stockStatus: 'in_stock' | 'limited' | 'sold_out';
  tags: string;
}
