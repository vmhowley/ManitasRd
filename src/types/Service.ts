export interface PriceModifier {
  _id?: string;
  name: string;
  additionalCost: number;
}

export interface Service {
  _id: string;
  name: string;
  category: string;
  description: string;
  basePrice: number;
  unitType?: string;
  pricePerUnit?: number;
  priceModifiers?: PriceModifier[];
  isActive: boolean;
  createdAt: string;
}