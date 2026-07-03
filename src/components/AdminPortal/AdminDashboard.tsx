import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Table,
  Input,
  Tag,
  message,
  Spin,
  Card,
  Statistic,
  Button,
  Tooltip,
} from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  UserOutlined,
  LogoutOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Header, Sider, Content } = Layout;

interface Customer {
  id: string;
  email: string;
  fullName?: string;
  displayName?: string;
  role?: string;
  isAdmin?: boolean;
  isManager?: boolean;
  createdAt?: string;
  lastLoginAt?: string;
}

interface AdminUser {
  id: string;
  email: string;
  fullName?: string;
  displayName?: string;
  role?: string;
  isAdmin?: boolean;
}

type SectionKey = "dashboard" | "customers" | "orders" | "logs";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [section, setSection] = useState<SectionKey>("dashboard");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  // โหลด user info จาก localStorage
  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        setCurrentUser(JSON.parse(userStr));
      }
    } catch {
      // ignore
    }
  }, []);

  // ดึงรายชื่อลูกค้าผ่าน GraphQL
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:4321"}/graphql`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({
            query: `
              query GetCustomers {
                users {
                  id
                  email
                  fullName
                  displayName
                  role
                  isAdmin
                  isManager
                  createdAt
                  lastLoginAt
                }
              }
            `,
          }),
        },
      );

      const data = await response.json();

      if (data.errors) {
        message.error(data.errors[0]?.message || "Failed to fetch customers");
        return;
      }

      setCustomers(data.data?.users ?? []);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      message.error("Failed to load customer list");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (section === "customers") {
      fetchCustomers();
    }
  }, [section, fetchCustomers]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");
    message.success("Logged out successfully");
    navigate("/admin/login");
  };

  // Filter ตาม search
  const filteredCustomers = customers.filter((c) => {
    if (!searchText) return true;
    const q = searchText.toLowerCase();
    return (
      c.email?.toLowerCase().includes(q) ||
      c.fullName?.toLowerCase().includes(q) ||
      c.displayName?.toLowerCase().includes(q)
    );
  });

  // Stats
  const totalCustomers = customers.length;
  const adminCount = customers.filter((c) => c.isAdmin).length;
  const managerCount = customers.filter((c) => c.isManager).length;
  const regularCount = totalCustomers - adminCount - managerCount;

  // Table columns
  const columns: ColumnsType<Customer> = [
    {
      title: "Name",
      key: "name",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {record.displayName || record.fullName || "—"}
          </div>
          <div style={{ fontSize: 12, color: "#64748b" }}>{record.email}</div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 140,
      render: (_, record) => {
        if (record.isAdmin) {
          return (
            <Tag color="red" icon={<CrownOutlined />}>
              Admin
            </Tag>
          );
        }
        if (record.isManager) {
          return <Tag color="orange">Manager</Tag>;
        }
        return <Tag color="blue">Customer</Tag>;
      },
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (val) =>
        val ? new Date(val).toLocaleDateString() : <span style={{ color: "#94a3b8" }}>—</span>,
    },
    {
      title: "Last Login",
      dataIndex: "lastLoginAt",
      key: "lastLoginAt",
      width: 180,
      render: (val) =>
        val ? new Date(val).toLocaleString() : <span style={{ color: "#94a3b8" }}>Never</span>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      align: "center",
      render: () => (
        <Tooltip title="View details">
          <Button type="text" icon={<EyeOutlined />} size="small" />
        </Tooltip>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark"
        style={{ background: "#0f172a" }}
        width={240}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            padding: collapsed ? "16px 0" : "16px 20px",
            borderBottom: "1px solid #1e293b",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, #dc2626, #ea580c)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <CrownOutlined style={{ color: "white", fontSize: 16 }} />
          </div>
          {!collapsed && (
            <div>
              <div style={{ color: "white", fontWeight: 600, fontSize: 15 }}>
                Orbiteye
              </div>
              <div style={{ color: "#94a3b8", fontSize: 11 }}>Admin Panel</div>
            </div>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[section]}
          onSelect={(e) => setSection(e.key as SectionKey)}
          style={{ background: "transparent", borderRight: 0, marginTop: 8 }}
          items={[
            {
              key: "dashboard",
              icon: <DashboardOutlined />,
              label: "Dashboard",
            },
            {
              key: "customers",
              icon: <TeamOutlined />,
              label: "Customers",
            },
            {
              key: "orders",
              icon: <ShoppingCartOutlined />,
              label: "Orders",
              disabled: true,
            },
            {
              key: "logs",
              icon: <FileTextOutlined />,
              label: "Activity Logs",
              disabled: true,
            },
          ]}
        />
      </Sider>

      {/* Main */}
      <Layout>
        {/* Header */}
        <Header
          style={{
            background: "#1e293b",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #334155",
          }}
        >
          <div style={{ color: "white", fontSize: 18, fontWeight: 500 }}>
            {section === "dashboard" && "Dashboard"}
            {section === "customers" && "Customer Management"}
            {section === "orders" && "Orders"}
            {section === "logs" && "Activity Logs"}
          </div>

          <Dropdown
            menu={{
              items: [
                {
                  key: "profile",
                  icon: <UserOutlined />,
                  label: currentUser?.email || "Profile",
                  disabled: true,
                },
                { type: "divider" },
                {
                  key: "logout",
                  icon: <LogoutOutlined />,
                  label: "Logout",
                  danger: true,
                  onClick: handleLogout,
                },
              ],
            }}
            placement="bottomRight"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
                padding: "4px 12px",
                borderRadius: 8,
              }}
            >
              <Avatar
                style={{
                  background: "linear-gradient(135deg, #dc2626, #ea580c)",
                }}
                icon={<UserOutlined />}
              />
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ color: "white", fontSize: 13, fontWeight: 500 }}>
                  {currentUser?.displayName ||
                    currentUser?.fullName ||
                    currentUser?.email?.split("@")[0] ||
                    "Admin"}
                </div>
                <div style={{ color: "#94a3b8", fontSize: 11 }}>
                  Administrator
                </div>
              </div>
            </div>
          </Dropdown>
        </Header>

        {/* Content */}
        <Content style={{ padding: 24, background: "#f1f5f9" }}>
          {section === "dashboard" && (
            <div>
              <h2 style={{ margin: "0 0 20px", color: "#0f172a" }}>
                Welcome back,{" "}
                {currentUser?.displayName ||
                  currentUser?.fullName ||
                  "Admin"}
                !
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 16,
                  marginBottom: 24,
                }}
              >
                <Card>
                  <Statistic
                    title="Total Users"
                    value={totalCustomers}
                    prefix={<TeamOutlined />}
                    valueStyle={{ color: "#0f172a" }}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Customers"
                    value={regularCount}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Managers"
                    value={managerCount}
                    valueStyle={{ color: "#ea580c" }}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Admins"
                    value={adminCount}
                    valueStyle={{ color: "#dc2626" }}
                    prefix={<CrownOutlined />}
                  />
                </Card>
              </div>

              <Card title="Quick Actions">
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <Button
                    type="primary"
                    icon={<TeamOutlined />}
                    onClick={() => setSection("customers")}
                  >
                    View Customers
                  </Button>
                  <Button icon={<ReloadOutlined />} onClick={fetchCustomers}>
                    Refresh Data
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {section === "customers" && (
            <Card
              title={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>Customer List ({filteredCustomers.length})</span>
                  <Input
                    placeholder="Search by name or email"
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 280 }}
                    allowClear
                  />
                </div>
              }
              extra={
                <Button
                  icon={<ReloadOutlined />}
                  onClick={fetchCustomers}
                  loading={loading}
                >
                  Refresh
                </Button>
              }
            >
              {loading ? (
                <div style={{ textAlign: "center", padding: 40 }}>
                  <Spin />
                </div>
              ) : (
                <Table
                  columns={columns}
                  dataSource={filteredCustomers}
                  rowKey="id"
                  pagination={{ pageSize: 20 }}
                  scroll={{ x: 800 }}
                />
              )}
            </Card>
          )}

          {(section === "orders" || section === "logs") && (
            <Card>
              <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>
                🚧 This section is under construction.
              </div>
            </Card>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;