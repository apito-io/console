import { Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useGetTenantsQuery } from "../../generated/graphql";
import { ENV } from "../../utils/env";

// Define the type for tenant options
interface TenantOption {
  label: string;
  value: string;
  logo: string; // URL or path to the logo image
}

interface TenantSelectorProps {
  style?: React.CSSProperties;
}

const TenantSelector: React.FC<TenantSelectorProps> = ({ style = {} }) => {
  const { data, loading, error } = useGetTenantsQuery();
  const [options, setOptions] = useState<TenantOption[]>([]);
  const [cookies, setCookie, removeCookie] = useCookies(["temp_tenant_id"]); // Initialize cookies

  useEffect(() => {
    if (data && data.getTenants) {
      const tenantOptions = data.getTenants
        .filter((tenant) => tenant !== null)
        .map((tenant) => ({
          label: tenant?.name || "",
          value: tenant?.id || "",
          logo: tenant?.logo || "",
        }));
      setOptions(tenantOptions);
    }
  }, [data]);

  const handleChange = (value: string) => {
    // Get cookie domain from environment variable
    const cookieDomain = ENV.VITE_COOKIE_DOMAIN;
    const cookieOptions = {
      path: "/",
      domain: cookieDomain || undefined,
    };

    if (value === undefined) {
      removeCookie("temp_tenant_id", cookieOptions);
    } else {
      setCookie("temp_tenant_id", value, cookieOptions); // Save tenant ID in cookie
    }
    // Reload the page to apply the tenant change
    window.location.reload();
  };

  if (loading) return <Spin size="small" />;
  if (error)
    return (
      <div style={{ fontSize: "12px", color: "#ff4d4f" }}>
        Error loading tenants
      </div>
    );

  return (
    <Select
      placeholder="Choose Tenant"
      onChange={handleChange}
      style={{ width: "100%", ...style }}
      value={cookies.temp_tenant_id}
      optionLabelProp="label"
      allowClear
    >
      {options.map((option) => (
        <Select.Option
          key={option.value}
          value={option.value}
          label={option.label}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {option.logo && (
              <img
                src={option.logo}
                alt={option.label}
                style={{ width: 20, height: 20, marginRight: 8 }}
              />
            )}
            {option.label}
          </div>
        </Select.Option>
      ))}
    </Select>
  );
};

export default TenantSelector;
