

export interface UserProfile {
  avatar: string | null;
  role: string;
  bio: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile: UserProfile;
}

export interface UserProfile {
  avatar: string | null;
  role: string;
  bio: string;
  phone_number: string;
  notification_email: boolean;
  notification_push: boolean;
  notification_weekly: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile: UserProfile;
}