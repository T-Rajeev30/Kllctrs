export interface Profile {
  id: string;

  display_name: string | null;

  avatar_url: string | null;

  city: string | null;

  state: string | null;

  favorite_categories: string[];

  grading_preference?: string | null;

  years_collecting?: number | null;

  saved_events?: any[];

  saved_shops?: any[];
  
}

export interface ProfileClientProps {
  user: any;
  profile: any;
  savedShops: any[];
  savedEvents: any[];
}