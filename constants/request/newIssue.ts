export class NewIssue {
  title: string;
  description: string;
  address: string;
  latitude: string;
  longitude: string;
  user: { id: number };
  category: { id: number };
  status: { id: number };

  constructor(
    title: string,
    description: string,
    address: string,
    latitude: string,
    longitude: string,
    userId: number,
    categoryId: number,
    statusId: number
  ) {
    this.title = title;
    this.description = description;
    this.address = address;
    this.latitude = latitude;
    this.longitude = longitude;
    this.user = { id: userId };
    this.category = { id: categoryId };
    this.status = { id: statusId };
  }
}
