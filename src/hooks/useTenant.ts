import { useCookies } from 'react-cookie';

export const useTenant = () => {
  const [cookies] = useCookies(['temp_tenant_id']);
  
  const getTenantId = (): string | null => {
    return cookies.temp_tenant_id || null;
  };

  return {
    tenantId: getTenantId(),
    getTenantId,
  };
}; 