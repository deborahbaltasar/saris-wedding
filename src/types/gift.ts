import { Department } from "./department";

export interface GiftItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  store: string;
  url: string;
  purchased: boolean;
  department: Department;
}