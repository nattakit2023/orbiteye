import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Alert,
  Progress,
  Space,
  Divider,
} from "antd";
import {
  LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CheckCircleOutlined,
  SafetyOutlined,
} from "@ant-design/icons";

const { Password } = Input;

const ChangePassword: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 25;
    return Math.min(strength, 100);
  };

  const getStrengthColor = (strength: number) => {
    if (strength < 30) return "#ff4d4f";
    if (strength < 50) return "#faad14";
    if (strength < 75) return "#1890ff";
    return "#52c41a";
  };

  const getStrengthText = (strength: number) => {
    if (strength < 30) return "Weak";
    if (strength < 50) return "Fair";
    if (strength < 75) return "Good";
    return "Strong";
  };

  const handlePasswordChange = async () => {
    try {
      await form.validateFields();
      setLoading(true);

      // Simulate API call - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, you would:
      // 1. Verify current password with backend
      // 2. Update password with new password
      // 3. Store new password hash in database
      // 4. Optionally invalidate user sessions except current

      message.success("Password changed successfully!");
      form.resetFields();
      setPasswordStrength(0);
    } catch (error: unknown) {
      const err = error as { errorFields?: Array<{ name: string; errors: string[] }> };
      if (err.errorFields) {
        message.error("Please correct the errors before submitting.");
      } else {
        message.error("Failed to change password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const validateConfirmPassword = (_: unknown, value: string) => {
    const newPassword = form.getFieldValue("newPassword");
    if (value && value !== newPassword) {
      return Promise.reject(new Error("Passwords do not match"));
    }
    return Promise.resolve();
  };

  return (
    <>
      <style>{`
        .rightsidebar-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .rightsidebar-scroll::-webkit-scrollbar-track {
          background: #1a2332;
          border-radius: 3px;
        }

        .rightsidebar-scroll::-webkit-scrollbar-thumb {
          background: #293653;
          border-radius: 3px;
          transition: background 0.2s ease;
        }

        .rightsidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: #1890ff;
        }

        .rightsidebar-scroll::-webkit-scrollbar-thumb:active {
          background: #1077e8;
        }
      `}</style>
      <div
        style={{
          padding: "24px",
          height: "100vh",
          overflow: "hidden",
          backgroundColor: "#030416",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            marginBottom: "24px",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flex: "0 0 auto",
          }}
        >
          <LockOutlined style={{ color: "#1890ff" }} />
          Change Password
        </h1>

        <div
          className="rightsidebar-scroll"
          style={{
            flex: 1,
            overflowY: "auto",
            paddingRight: "8px",
          }}
        >
          <Card
        style={{
          backgroundColor: "#0f1828",
          border: "1px solid #404d63",
          borderRadius: "12px",
        }}
        headStyle={{
          borderBottom: "1px solid #404d63",
          color: "#ffffff",
        }}
      >
        <Alert
          message={<span style={{ color: "#8c8c8c" }}>Security Notice</span>}
          description={
            <div style={{ color: "#8c8c8c" }}>
              For your security, please choose a strong password that you don't use elsewhere. Your password should be at least 8 characters long.
            </div>
          }
          type="info"
          showIcon
          icon={<SafetyOutlined />}
          style={{
            marginBottom: "24px",
            backgroundColor: "rgba(24, 144, 255, 0.1)",
            border: "1px solid #1890ff",
            color: "#ffffff",
          }}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={handlePasswordChange}
          autoComplete="off"
        >
          <Form.Item
            name="currentPassword"
            label={
              <span style={{ color: "#ffffff", fontWeight: 500 }}>
                Current Password
              </span>
            }
            rules={[
              {
                required: true,
                message: "Please enter your current password",
              },
            ]}
          >
            <Password
              prefix={<LockOutlined />}
              placeholder="Enter your current password"
              iconRender={(visible) =>
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
              style={{
                backgroundColor: "#030416",
                borderColor: "#404d63",
                color: "#ffffff",
              }}
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label={
              <span style={{ color: "#ffffff", fontWeight: 500 }}>
                New Password
              </span>
            }
            rules={[
              {
                required: true,
                message: "Please enter your new password",
              },
              {
                min: 8,
                message: "Password must be at least 8 characters long",
              },
            ]}
          >
            <Password
              prefix={<LockOutlined />}
              placeholder="Enter your new password"
              iconRender={(visible) =>
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
              onChange={(e) => {
                const strength = calculatePasswordStrength(e.target.value);
                setPasswordStrength(strength);
              }}
              style={{
                backgroundColor: "#030416",
                borderColor: "#404d63",
                color: "#ffffff",
              }}
            />
          </Form.Item>

          {passwordStrength > 0 && (
            <div
              style={{
                marginBottom: "24px",
                padding: "12px",
                backgroundColor: "#030416",
                borderRadius: "8px",
                border: "1px solid #404d63",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    color: "#ffffff",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  Password Strength
                </span>
                <span
                  style={{
                    color: getStrengthColor(passwordStrength),
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  {getStrengthText(passwordStrength)}
                </span>
              </div>
              <Progress
                percent={passwordStrength}
                strokeColor={getStrengthColor(passwordStrength)}
                showInfo={false}
                strokeWidth={6}
              />
            </div>
          )}

          <Form.Item
            name="confirmPassword"
            label={
              <span style={{ color: "#ffffff", fontWeight: 500 }}>
                Confirm New Password
              </span>
            }
            dependencies={["newPassword"]}
            rules={[
              {
                required: true,
                message: "Please confirm your new password",
              },
              {
                validator: validateConfirmPassword,
              },
            ]}
          >
            <Password
              prefix={<LockOutlined />}
              placeholder="Confirm your new password"
              iconRender={(visible) =>
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
              style={{
                backgroundColor: "#030416",
                borderColor: "#404d63",
                color: "#ffffff",
              }}
            />
          </Form.Item>

          <Divider style={{ borderColor: "#404d63" }} />

          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<CheckCircleOutlined />}
              style={{
                backgroundColor: "#1890ff",
                borderColor: "#1890ff",
                color: "#ffffff",
                height: "44px",
                fontSize: "15px",
                fontWeight: 600,
              }}
              block
            >
              Change Password
            </Button>

            <Button
              danger
              onClick={() => form.resetFields()}
              style={{
                borderColor: "#ff4d4f",
                color: "#ff4d4f",
                height: "40px",
              }}
              block
            >
              Cancel
            </Button>
          </Space>
        </Form>
      </Card>

      <Alert
        message={<span style={{ color: "#8c8c8c" }}>Password Tip</span>}
        description={
          <div style={{ color: "#8c8c8c", fontSize: "13px" }}>
            <div style={{ marginBottom: "8px" }}>
              • Use at least 8 characters
            </div>
            <div style={{ marginBottom: "8px" }}>
              • Include uppercase and lowercase letters
            </div>
            <div style={{ marginBottom: "8px" }}>
              • Add numbers and special characters
            </div>
            <div>• Avoid using personal information or common words</div>
          </div>
        }
        type="warning"
        showIcon
        style={{
          marginTop: "24px",
          backgroundColor: "rgba(250, 173, 20, 0.1)",
          border: "1px solid #faad14",
          color: "#ffffff",
        }}
      />
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
