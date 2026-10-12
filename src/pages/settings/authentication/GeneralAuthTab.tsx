import React from "react";
import { Form, Radio, Select, Switch, Typography } from "antd";
import { LogIn } from "lucide-react";
import { ConsoleCard, ConsoleCardTitle } from "../../../components/console";

const { Paragraph } = Typography;
const { Option } = Select;

export type GeneralAuthTabProps = {
  rolesList: string[];
  rolesLoading: boolean;
};

const GeneralAuthTab: React.FC<GeneralAuthTabProps> = ({
  rolesList,
  rolesLoading,
}) => {
  return (
    <ConsoleCard
      title={<ConsoleCardTitle icon={LogIn} label="General sign-in" />}
    >
      <Form.Item
        name="enable_general_auth"
        label="Enable password sign-in"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
      <Form.Item
        name="general_authentication_method"
        label="Sign-in identifier"
      >
        <Radio.Group>
          <Radio value="email">Email</Radio>
          <Radio value="phone">Phone</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name="default_registration_role"
        label="Default role"
        extra="Role assigned to new users when none is specified during registration or user creation."
      >
        <Select
          placeholder="None"
          allowClear
          loading={rolesLoading}
          optionFilterProp="children"
        >
          <Option value="">None</Option>
          {rolesList.map((role) => (
            <Option key={role} value={role}>
              {role}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Paragraph type="secondary" className="console-mb-0">
        Users must have a bcrypt password set. Email mode matches the user email
        field; phone mode matches the phone field.
      </Paragraph>
    </ConsoleCard>
  );
};

export default GeneralAuthTab;
