// Shared types for SecuritySettings components

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ShowPasswords {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

export interface Message {
  type: 'success' | 'error';
  text: string;
}

export interface PasswordStrength {
  strength: number;
  label: string;
  color: string;
}

// Component Props
export interface ChangePasswordFormProps {
  passwordData: PasswordData;
  showPasswords: ShowPasswords;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePasswordVisibility: (field: keyof ShowPasswords) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  message: Message | null;
  getPasswordStrength: (password: string) => PasswordStrength;
}

export interface SecurityStatusProps {
  // Props for security status display
}

export interface MessageDisplayProps {
  message: Message | null;
}
