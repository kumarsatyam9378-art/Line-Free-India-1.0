export interface Review {
  id: string;
  businessId: string;
  customerId: string;
  customerName: string;
  customerPhotoUrl?: string;
  rating: number;
  comment?: string;
  ownerReply?: string;
  createdAt: any;
  updatedAt: any;
}