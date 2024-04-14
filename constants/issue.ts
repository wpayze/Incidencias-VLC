import { User } from "./user";
import { Category } from "./category";
import { Status } from "./status";

export class Issue {
  id: number;
  title: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  user: User;
  category: Category;
  status: Status;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    title: string,
    description: string,
    address: string,
    latitude: number,
    longitude: number,
    user: User,
    category: Category,
    status: Status,
    imageUrl: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.address = address;
    this.latitude = latitude;
    this.longitude = longitude;
    this.user = user;
    this.category = category;
    this.status = status;
    this.imageUrl = imageUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
