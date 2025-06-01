// Settings API utilities
export interface UpdateProfileData {
  name?: string;
  email?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface Preferences {
  theme?:
    | 'light'
    | 'dark'
    | 'cupcake'
    | 'bumblebee'
    | 'emerald'
    | 'corporate'
    | 'synthwave'
    | 'retro'
    | 'cyberpunk'
    | 'valentine'
    | 'halloween'
    | 'garden'
    | 'forest'
    | 'aqua'
    | 'lofi'
    | 'pastel'
    | 'fantasy'
    | 'wireframe'
    | 'black'
    | 'luxury'
    | 'dracula'
    | 'cmyk'
    | 'autumn'
    | 'business'
    | 'acid'
    | 'lemonade'
    | 'night'
    | 'coffee'
    | 'winter'
    | 'dim'
    | 'nord'
    | 'sunset'
    | 'caramellatte'
    | 'abyss'
    | 'system';
  notifications?: {
    email?: boolean;
    push?: boolean;
    marketing?: boolean;
  };
  dashboard?: {
    defaultView?: 'grid' | 'list';
    itemsPerPage?: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: any;
}

class SettingsApi {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`/api/settings${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error(`Settings API error (${endpoint}):`, error);
      throw error;
    }
  }

  async updateProfile(data: UpdateProfileData): Promise<ApiResponse> {
    return this.request('/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async changePassword(data: ChangePasswordData): Promise<ApiResponse> {
    return this.request('/password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPreferences(): Promise<ApiResponse<{ preferences: Preferences }>> {
    return this.request('/preferences', {
      method: 'GET',
    });
  }

  async savePreferences(preferences: Preferences): Promise<ApiResponse> {
    return this.request('/preferences', {
      method: 'POST',
      body: JSON.stringify(preferences),
    });
  }

  async exportData(): Promise<ApiResponse> {
    return this.request('/data', {
      method: 'POST',
      body: JSON.stringify({ type: 'export' }),
    });
  }

  async deleteAccount(confirmDelete: boolean): Promise<ApiResponse> {
    return this.request('/data', {
      method: 'DELETE',
      body: JSON.stringify({ confirmDelete }),
    });
  }
}

export const settingsApi = new SettingsApi();
