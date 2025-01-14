// src/app/admin/products/types.ts

export interface MediaItem {
    id: string;
    alt: string; // Alt text for the image
    url: string; // URL of the image
  }

  export interface Option {
    name: string;
    value: string;
  }

  export interface Category {
    id: string;
    name: string;
  }
  
  
  export interface Variant {
    assigned_image?: string; // ID of the assigned image
    id: string; // Identifier for the variant
    compare_at_price: number;
    cost: number;
    price: number;
    requires_shipping: boolean;
    taxable: boolean;
    weight: number;
    option: Option; // Main option (e.g., size)
    option2?: Option; // Optional second option (e.g., color)
    option3?: Option; 
    finish: string;
    lead_time: string;
    sqft: string;
    barcode: string;
  }

  
  
  export interface Product {
    categoryPath: Category[];
    title: string;
    description: string;
    published: boolean;
    images: string[];
    tags: string[];
    type: string;
    vendor: string;
    variants: Record<string, Variant>;
    finish: string;
    lead_time: string;
    warranty: string;
    technical_specifications: string;
    installation_and_maintenance: string;
    sqft: string;
    price: number;
    cost: number;
    compare_at_price: number;
    taxable: boolean;
    sku: string;
    barcode: string;
    weight: number;
    requires_shipping: boolean; 
  }
  