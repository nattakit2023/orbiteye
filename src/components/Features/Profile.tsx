import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  Divider,
  Switch,
  Space,
  message,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  EditOutlined,
  UploadOutlined,
  BellOutlined,
  EyeOutlined,
  SaveOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  role: string;
  location?: string;
  bio?: string;
  avatar: string;
}

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Mock user data - replace with actual data from API
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "John Doe",
    email: "john.doe@orbiteye.com",
    phone: "+1 234 567 8900",
    role: "Premium User",
    location: "San Francisco, CA",
    bio: "Satellite imagery enthusiast and geographic information systems specialist. Passionate about exploring Earth from space.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    publicProfile: true,
    showOnlineStatus: true,
  });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      form.setFieldsValue({
        ...userProfile,
      });
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Update user profile
      setUserProfile({
        ...userProfile,
        ...values,
      });

      setIsEditing(false);
      message.success("Profile updated successfully!");
    } catch {
      message.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (info: {
    file: { status?: string; originFileObj?: File };
  }) => {
    if (info.file.status === "done" && info.file.originFileObj) {
      // In a real app, you would upload the file to a server
      // and get back the URL
      setUserProfile({
        ...userProfile,
        avatar: URL.createObjectURL(info.file.originFileObj),
      });
      message.success("Avatar updated successfully!");
    }
  };

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
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
            flex: "0 0 auto",
          }}
        >
          My Profile
        </h1>

        <div
          className="rightsidebar-scroll"
          style={{
            flex: 1,
            overflowY: "auto",
            paddingRight: "8px",
          }}
        >
          <div style={{ marginBottom: "24px" }}>
            <Card
              style={{
                backgroundColor: "#0f1828",
                border: "1px solid #404d63",
                borderRadius: "12px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "20px" }}
              >
                <div style={{ position: "relative" }}>
                  <Avatar
                    src={userProfile.avatar}
                    size={100}
                    style={{ backgroundColor: "#1890ff" }}
                  />
                  <Upload
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                    }}
                  >
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<UploadOutlined />}
                      size="small"
                      style={{
                        backgroundColor: "#1890ff",
                        border: "2px solid #0f1828",
                      }}
                    />
                  </Upload>
                </div>

                <div style={{ flex: 1 }}>
                  <h2
                    style={{
                      fontSize: "24px",
                      fontWeight: 600,
                      marginBottom: "8px",
                      color: "#ffffff",
                      margin: 0,
                    }}
                  >
                    {userProfile.name}
                  </h2>
                  <p
                    style={{
                      color: "#8c8c8c",
                      fontSize: "14px",
                      marginBottom: "4px",
                      margin: 0,
                    }}
                  >
                    <MailOutlined style={{ marginRight: "4px" }} />
                    {userProfile.email}
                  </p>
                  <p
                    style={{
                      color: "#8c8c8c",
                      fontSize: "14px",
                      marginBottom: "4px",
                      margin: 0,
                    }}
                  >
                    <UserOutlined style={{ marginRight: "4px" }} />
                    {userProfile.role}
                  </p>
                </div>

                <Button
                  type={isEditing ? "default" : "primary"}
                  icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
                  onClick={isEditing ? handleSave : handleEditToggle}
                  loading={loading}
                  style={{
                    backgroundColor: isEditing ? "transparent" : "#1890ff",
                    borderColor: isEditing ? "#404d63" : "#1890ff",
                    color: isEditing ? "#ffffff" : "#ffffff",
                    height: "40px",
                    minWidth: "100px",
                  }}
                >
                  {isEditing ? "Save" : "Edit Profile"}
                </Button>
              </div>

              {isEditing && (
                <>
                  <Divider style={{ borderColor: "#404d63" }} />
                  <Form
                    form={form}
                    layout="vertical"
                    initialValues={userProfile}
                  >
                    <Form.Item
                      name="name"
                      label={
                        <span style={{ color: "#ffffff" }}>Full Name</span>
                      }
                      rules={[
                        {
                          required: true,
                          message: "Please enter your full name",
                        },
                      ]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        style={{
                          backgroundColor: "#0f1828",
                          borderColor: "#404d63",
                          color: "#ffffff",
                        }}
                      />
                    </Form.Item>

                    <Form.Item
                      name="email"
                      label={<span style={{ color: "#ffffff" }}>Email</span>}
                      rules={[
                        { required: true, message: "Please enter your email" },
                        { type: "email", message: "Invalid email format" },
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined />}
                        style={{
                          backgroundColor: "#0f1828",
                          borderColor: "#404d63",
                          color: "#ffffff",
                        }}
                      />
                    </Form.Item>

                    <Form.Item
                      name="phone"
                      label={<span style={{ color: "#ffffff" }}>Phone</span>}
                    >
                      <Input
                        prefix={<PhoneOutlined />}
                        style={{
                          backgroundColor: "#0f1828",
                          borderColor: "#404d63",
                          color: "#ffffff",
                        }}
                      />
                    </Form.Item>

                    <Form.Item
                      name="location"
                      label={<span style={{ color: "#ffffff" }}>Location</span>}
                    >
                      <Input
                        prefix={<EnvironmentOutlined />}
                        style={{
                          backgroundColor: "#0f1828",
                          borderColor: "#404d63",
                          color: "#ffffff",
                        }}
                      />
                    </Form.Item>

                    <Form.Item
                      name="bio"
                      label={<span style={{ color: "#ffffff" }}>Bio</span>}
                    >
                      <TextArea
                        rows={4}
                        style={{
                          backgroundColor: "#0f1828",
                          borderColor: "#404d63",
                          color: "#ffffff",
                        }}
                      />
                    </Form.Item>
                  </Form>
                </>
              )}
            </Card>
          </div>

          <Card
            title={
              <span
                style={{ color: "#ffffff", fontSize: "16px", fontWeight: 600 }}
              >
                Account Settings
              </span>
            }
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
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      color: "#ffffff",
                      fontSize: "14px",
                      marginBottom: "4px",
                    }}
                  >
                    <MailOutlined
                      style={{ marginRight: "8px", color: "#1890ff" }}
                    />
                    Email Notifications
                  </div>
                  <div style={{ color: "#8c8c8c", fontSize: "12px" }}>
                    Receive email updates about your account
                  </div>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onChange={(checked) =>
                    setSettings({ ...settings, emailNotifications: checked })
                  }
                />
              </div>

              <Divider style={{ borderColor: "#404d63", margin: "16px 0" }} />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      color: "#ffffff",
                      fontSize: "14px",
                      marginBottom: "4px",
                    }}
                  >
                    <BellOutlined
                      style={{ marginRight: "8px", color: "#52c41a" }}
                    />
                    Push Notifications
                  </div>
                  <div style={{ color: "#8c8c8c", fontSize: "12px" }}>
                    Receive push notifications on your device
                  </div>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onChange={(checked) =>
                    setSettings({ ...settings, pushNotifications: checked })
                  }
                />
              </div>

              <Divider style={{ borderColor: "#404d63", margin: "16px 0" }} />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      color: "#ffffff",
                      fontSize: "14px",
                      marginBottom: "4px",
                    }}
                  >
                    <EyeOutlined
                      style={{ marginRight: "8px", color: "#722ed1" }}
                    />
                    Public Profile
                  </div>
                  <div style={{ color: "#8c8c8c", fontSize: "12px" }}>
                    Allow others to see your profile
                  </div>
                </div>
                <Switch
                  checked={settings.publicProfile}
                  onChange={(checked) =>
                    setSettings({ ...settings, publicProfile: checked })
                  }
                />
              </div>

              <Divider style={{ borderColor: "#404d63", margin: "16px 0" }} />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      color: "#ffffff",
                      fontSize: "14px",
                      marginBottom: "4px",
                    }}
                  >
                    Online Status
                  </div>
                  <div style={{ color: "#8c8c8c", fontSize: "12px" }}>
                    Show when you're online
                  </div>
                </div>
                <Switch
                  checked={settings.showOnlineStatus}
                  onChange={(checked) =>
                    setSettings({ ...settings, showOnlineStatus: checked })
                  }
                />
              </div>
            </Space>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Profile;
