export interface IUser {
  id: number;
  email: string;
  name?: string;
  posts?: IPost[];
}

export interface IPost {
  id: number;
  title: string;
  content?: string;
  published: boolean;
  authorId: number;
  author?: IUser;
}
