// Shared types for SecuritySettings components

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  emailVerified?: boolean; // Better Auth's emailVerified field
  passwordStrength?: number; // Custom field for stored password strength (1-4)
  passwordUpdatedAt?: Date; // Custom field for password update timestamp
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

export interface EmailVerificationStatus {
  isVerified: boolean;
  email?: string;
  lastVerifiedAt?: Date;
}

export interface PasswordSecurityStatus {
  hasPassword: boolean;
  strength?: PasswordStrength;
  lastUpdated?: Date;
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
  onGeneratePassword?: () => void;
  showGeneratedPassword?: boolean;
  onCopyPassword?: () => void;
  copied?: boolean;
}

export interface SecurityStatusProps {
  user?: User;
  emailStatus: EmailVerificationStatus;
  passwordStatus: PasswordSecurityStatus;
  isLoading?: boolean;
}