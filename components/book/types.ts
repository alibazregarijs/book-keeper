export type BookProps = {
  id: number;
  title: string;
  genre: string;
  pageCount: number;
  userId: number;
  description: string;
  imageUrl: string;
  comments: Comment[];
  likes:{
    id : number;
    countOfLike: number;
    

  }
};