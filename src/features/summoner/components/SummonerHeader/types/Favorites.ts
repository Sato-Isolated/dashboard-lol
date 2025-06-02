export interface Favorite {
  region: string;
  tagline: string;
  name: string;
}

export interface FavoriteButtonProps {
  favorite: Favorite;
  isActive: boolean;
  onSelect: (fav: Favorite) => void;
}

export interface ToastMessage {
  shareMsg: string;
  rankMsg: string;
}
