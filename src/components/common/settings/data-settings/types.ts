export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface Message {
  type: 'success' | 'error';
  text: string;
}

export interface DataSettingsProps {
  user: User;
}
