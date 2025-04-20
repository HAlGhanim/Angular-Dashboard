export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  status: 'available' | 'out-of-stock' | 'archived';
  rating: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with USB receiver',
    price: 29.99,
    category: 'Electronics',
    stock: 120,
    status: 'available',
    rating: 4.5,
    imageUrl: 'https://picsum.photos/seed/mouse/150/150',
    createdAt: '2024-04-01T10:00:00Z',
    updatedAt: '2024-06-10T15:25:00Z',
    tags: ['bestseller', 'tech', 'accessories'],
  },
  {
    id: 2,
    name: 'Basic T-shirt',
    description: '100% cotton T-shirt in various colors',
    price: 15.0,
    category: 'Apparel',
    stock: 0,
    status: 'out-of-stock',
    rating: 3.8,
    imageUrl: 'https://picsum.photos/seed/tshirt/150/150',
    createdAt: '2024-01-20T13:15:00Z',
    updatedAt: '2024-05-28T11:10:00Z',
    tags: ['clearance', 'clothing'],
  },
  {
    id: 3,
    name: 'Standing Desk',
    description: 'Adjustable height desk ideal for home offices',
    price: 199.99,
    category: 'Furniture',
    stock: 20,
    status: 'archived',
    rating: 4.9,
    imageUrl: 'https://picsum.photos/seed/desk/150/150',
    createdAt: '2024-02-10T08:00:00Z',
    updatedAt: '2024-06-01T09:45:00Z',
    tags: ['office', 'ergonomic'],
  },
];
