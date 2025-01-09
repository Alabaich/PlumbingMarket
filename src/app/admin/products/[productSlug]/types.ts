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
  
  
  export interface Variant {
    id: string; // Identifier for the variant
    name: string; // Variant name
    compare_at_price: number;
    cost: number;
    price: number;
    requires_shipping: boolean;
    taxable: boolean;
    weight: number;
    option: Option;
  }
  
  export interface Product {
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
  