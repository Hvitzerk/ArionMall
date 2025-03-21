export interface Tenant {
  name: string;
  location: string;
  category: string;
  telephone: string;
  floor: '1st FLOOR' | '2nd FLOOR' | '3rd-4th FLOOR' | '5th FLOOR';
  status?: 'COMING SOON';
}

export type TenantCategory = 
  | 'Dept. Store'
  | 'Food & Beverage'
  | 'Fashion & Accessories'
  | 'Jewelry, Optic & Watches'
  | 'Electronics & Gadgets'
  | 'Beauty & Health'
  | 'Entertainment'
  | 'Hypermarket'
  | 'Banking';

export const tenantData: Tenant[] = [
  // 1st FLOOR
  {
    name: "POJOK BUSANA",
    location: "1st FLOOR",
    category: "Dept. Store",
    telephone: "021-4711554",
    floor: "1st FLOOR"
  },
  {
    name: "DUNKIN DONUTS",
    location: "1st FLOOR",
    category: "Food & Beverage",
    telephone: "021-4712724",
    floor: "1st FLOOR"
  },
  {
    name: "MIXUE ICE CREAM",
    location: "1st FLOOR",
    category: "Food & Beverage",
    telephone: "–",
    floor: "1st FLOOR"
  },
  // ... tambahkan semua tenant dari 1st floor

  // 2nd FLOOR
  {
    name: "FUN WORLD & KIDZILLA",
    location: "2nd FLOOR",
    category: "Entertainment",
    telephone: "–",
    floor: "2nd FLOOR"
  },
  // ... tambahkan semua tenant dari 2nd floor

  // 3rd-4th FLOOR
  {
    name: "MATAHARI DEPT. STORE",
    location: "3rd-4th FLOOR",
    category: "Dept. Store",
    telephone: "021-4701482/83",
    floor: "3rd-4th FLOOR"
  },

  // 5th FLOOR
  {
    name: "ARION XXI",
    location: "5th FLOOR",
    category: "Entertainment",
    telephone: "021-4757658",
    floor: "5th FLOOR"
  }
]; 