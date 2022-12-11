export interface VideoInfo {
  title: string;
  description: string;
  tags: string[];
}

export interface UserProps {
  id: string;
  username: string;
  email: string;
  image: string;
  coverImg: string;
  type: string;
}

export interface VideoProps {
  id: string;
  title: string;
  description: string;
  userId: string;
  thumbnail: string;
  videoUrl: string;
  tags: string[];
  type: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
}

export interface CommentProps {
  id: string;
  text: string;
  userId: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
}

export interface LikeProps {
  id: string;
  username: string;
}
