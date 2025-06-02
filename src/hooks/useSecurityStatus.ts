import { useQuery } from '@tanstack/react-query';
import {
  EmailVerificationStatus,
  PasswordSecurityStatus,
} from '@/components/common/settings/security-settings/types';

interface SecurityStatusResponse {
  success: boolean;
  data: {
    email: EmailVerificationStatus;
    password: PasswordSecurityStatus;
  };
}

const fetchSecurityStatus = async (): Promise<
  SecurityStatusResponse['data']
> => {
  const response = await fetch('/api/settings/security-status');

  if (!response.ok) {
    throw new Error('Failed to fetch security status');
  }

  const result: SecurityStatusResponse = await response.json();
  return result.data;
};

interface UseSecurityStatusReturn {
  data: SecurityStatusResponse['data'] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useSecurityStatus(): UseSecurityStatusReturn {
  const queryResult = useQuery({
    queryKey: ['security-status'],
    queryFn: fetchSecurityStatus,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime in older versions)
    refetchOnWindowFocus: false,
    retry: 2,
  });

  return {
    data: queryResult.data,
    isLoading: queryResult.isLoading,
    error: queryResult.error,
    refetch: queryResult.refetch,
  };
}
