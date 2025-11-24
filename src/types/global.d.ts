export {};
declare global {
  interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
  }
  interface IModelPaginate<T> {
    meta: {
      current: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: T[];
  }
  interface ILogin {
    access_token: string;
    user: {
      email: string;
      fullName: string;
      _id: string;
    };
  }
  interface IUserTable {
    _id: string;
    email: string;
    fullName: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
    role: string;
  }
  interface IUser {
    email: string;
    fullName: string;
    _id: string;
    role: string;
  }
  interface IRegister {
    email: string;
    fullName: string;
    phone: string;
    _id: string;
  }
  interface IShoesTable {
    _id: string;
    mainText: string;
    brand: string;
    price: number;
    quantity: number;
    category: string;
    thumbnail: string;
    slider: string[];
    createdAt: string;
    updatedAt: string;
  }
  interface IFetchAccount {
    user: IUser;
  }
}
