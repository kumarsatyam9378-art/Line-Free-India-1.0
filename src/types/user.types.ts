export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  photoUrl?: string;
  createdAt: any;
  updatedAt: any;
}

export interface OwnerProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  photoUrl?: string;
  businessId?: string;
  createdAt: any;
  updatedAt: any;
}
