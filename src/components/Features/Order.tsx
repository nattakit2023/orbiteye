import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Tag,
  Space,
  Select,
  Input,
  DatePicker,
  Empty,
  Modal,
  Descriptions,
  message,
} from "antd";
import {
  ShoppingOutlined,
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  DownloadOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { RangePicker } = DatePicker;
import { useOrder } from "@/context/OrderContext";
import type { CartItem } from "@/context/CartContext";

interface OrderItem {
  id: string;
  orderNumber: string;
  items: string[];
  totalAmount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  orderDate: Date;
  deliveryDate?: Date;
  paymentMethod: string;
  billingAddress: string;
  shippingAddress: string;
}

const Order: React.FC = () => {
  const { getOrders } = useOrder();
  const realOrders = getOrders();
  
  // Transform real orders from OrderContext to OrderItem format
  const orders = realOrders.map((realOrder) => ({
    id: realOrder.id,
    orderNumber: realOrder.id,
    items: realOrder.items.map((item: CartItem) => item.name),
    totalAmount: realOrder.totalAmount,
    status: realOrder.status,
    orderDate: new Date(realOrder.orderDate),
    deliveryDate: new Date(realOrder.orderDate + 5 * 24 * 60 * 60 * 1000), // 5 days delivery
    paymentMethod: "PromptPay",
    billingAddress: "N/A",
    shippingAddress: "N/A",
  }));

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getStatusColor = (status: OrderItem["status"]) => {
    switch (status) {
      case "completed":
        return "#52c41a";
      case "processing":
        return "#1890ff";
      case "pending":
        return "#faad14";
      case "cancelled":
        return "#ff4d4f";
      default:
        return "#8c8c8c";
    }
  };

  const getStatusIcon = (status: OrderItem["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircleOutlined />;
      case "processing":
        return <SyncOutlined spin />;
      case "pending":
        return <ClockCircleOutlined />;
      case "cancelled":
        return <CloseCircleOutlined />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const getStatusText = (status: OrderItem["status"]) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "processing":
        return "Processing";
      case "pending":
        return "Pending";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const handleViewOrder = (order: OrderItem) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleDownload = (order: OrderItem) => {
    message.success(`Downloading order ${order.orderNumber}...`);
    // Implement download functionality
  };

  const getFilteredOrders = () => {
    let filtered = [...orders];

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(term) ||
          order.items.some((item) => item.toLowerCase().includes(term)),
      );
    }

    // Filter by date range
    if (dateRange && dateRange[0] && dateRange[1]) {
      filtered = filtered.filter((order) => {
        return (
          order.orderDate >= dateRange[0] && order.orderDate <= dateRange[1]
        );
      });
    }

    return filtered;
  };

  const filteredOrders = getFilteredOrders();

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
          <ShoppingOutlined style={{ color: "#1890ff" }} />
          My Orders
        </h1>

        {/* Filters */}
        <Card
          style={{
            backgroundColor: "#0f1828",
            border: "1px solid #404d63",
            borderRadius: "12px",
            marginBottom: "24px",
            flex: "0 0 auto",
          }}
          bodyStyle={{ padding: "16px" }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <div
                style={{
                  marginBottom: "8px",
                  color: "#8c8c8c",
                  fontSize: "13px",
                }}
              >
                Search Orders
              </div>
              <Input
                placeholder="Search by order number or items..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  backgroundColor: "#030416",
                  borderColor: "#404d63",
                  color: "#ffffff",
                }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div
                style={{
                  marginBottom: "8px",
                  color: "#8c8c8c",
                  fontSize: "13px",
                }}
              >
                Filter by Status
              </div>
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: "100%" }}
                options={[
                  { label: "All Orders", value: "all" },
                  { label: "Completed", value: "completed" },
                  { label: "Processing", value: "processing" },
                  { label: "Pending", value: "pending" },
                  { label: "Cancelled", value: "cancelled" },
                ]}
                suffixIcon={<FilterOutlined />}
              />
            </Col>
            <Col xs={24} sm={24} md={10}>
              <div
                style={{
                  marginBottom: "8px",
                  color: "#8c8c8c",
                  fontSize: "13px",
                }}
              >
                Date Range
              </div>
              <RangePicker
                value={dateRange as any}
                onChange={(dates) => setDateRange(dates as any)}
                style={{ width: "100%" }}
                suffixIcon={<CalendarOutlined />}
              />
            </Col>
          </Row>
        </Card>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Card
              style={{
                backgroundColor: "#0f1828",
                border: "1px solid #404d63",
                borderRadius: "12px",
                textAlign: "center",
                padding: "80px 24px",
              }}
            >
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span style={{ color: "#8c8c8c", fontSize: "14px" }}>
                    No orders found matching your criteria
                  </span>
                }
              />
            </Card>
          </div>
        ) : (
          <div
            className="rightsidebar-scroll"
            style={{
              flex: 1,
              overflowY: "auto",
              paddingRight: "8px",
              paddingBottom: "24px",
            }}
          >
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {filteredOrders.map((order) => (
                <Card
                  key={order.id}
                  hoverable
                  style={{
                    backgroundColor: "#0f1828",
                    border: "1px solid #404d63",
                    borderRadius: "12px",
                  }}
                >
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={16}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "12px",
                        }}
                      >
                        <div>
                          <h3
                            style={{
                              fontSize: "18px",
                              fontWeight: 600,
                              marginBottom: "8px",
                              color: "#ffffff",
                              margin: 0,
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            {order.orderNumber}
                            <Tag
                              color={getStatusColor(order.status)}
                              icon={getStatusIcon(order.status)}
                              style={{
                                border: "none",
                                fontWeight: 500,
                                fontSize: "12px",
                              }}
                            >
                              {getStatusText(order.status)}
                            </Tag>
                          </h3>
                          <div
                            style={{
                              color: "#8c8c8c",
                              fontSize: "13px",
                              marginBottom: "4px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <CalendarOutlined
                              style={{ marginRight: "4px", color: "#1890ff" }}
                            />
                            Ordered: {formatDate(order.orderDate)}
                          </div>
                          {order.deliveryDate && (
                            <div
                              style={{
                                color: "#8c8c8c",
                                fontSize: "13px",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <CalendarOutlined
                                style={{ marginRight: "4px", color: "#52c41a" }}
                              />
                              Delivery: {formatDate(order.deliveryDate)}
                            </div>
                          )}
                        </div>
                        <div
                          style={{
                            color: "#1890ff",
                            fontSize: "20px",
                            fontWeight: 700,
                          }}
                        >
                          {formatPrice(order.totalAmount)}
                        </div>
                      </div>

                      <div
                        style={{
                          color: "#8c8c8c",
                          fontSize: "13px",
                          marginBottom: "12px",
                          lineHeight: "1.5",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 600,
                            color: "#ffffff",
                            marginBottom: "4px",
                          }}
                        >
                          Items ({order.items.length}):
                        </div>
                        {order.items.map((item, index) => (
                          <div key={index} style={{ marginBottom: "4px" }}>
                            • {item}
                          </div>
                        ))}
                      </div>
                    </Col>
                    <Col xs={24} sm={24} md={8}>
                      <Space
                        direction="vertical"
                        size="middle"
                        style={{ width: "100%" }}
                      >
                        <Button
                          block
                          icon={<EyeOutlined />}
                          onClick={() => handleViewOrder(order)}
                          style={{
                            borderColor: "#404d63",
                            color: "#ffffff",
                          }}
                        >
                          View Details
                        </Button>
                        <Button
                          block
                          icon={<DownloadOutlined />}
                          onClick={() => handleDownload(order)}
                          disabled={order.status === "cancelled"}
                          style={{
                            borderColor: "#404d63",
                            color:
                              order.status === "cancelled"
                                ? "#8c8c8c"
                                : "#ffffff",
                          }}
                        >
                          Download
                        </Button>
                      </Space>
                    </Col>
                  </Row>
                </Card>
              ))}
            </Space>
          </div>
        )}

        {/* Order Details Modal */}
        <Modal
          title={
            <span
              style={{ color: "#ffffff", fontSize: "18px", fontWeight: 600 }}
            >
              Order Details - {selectedOrder?.orderNumber}
            </span>
          }
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={800}
          style={{
            backgroundColor: "#0f1828",
          }}
          bodyStyle={{
            backgroundColor: "#0f1828",
            color: "#ffffff",
          }}
        >
          {selectedOrder && (
            <>
              <Descriptions
                bordered
                column={{ xs: 1, sm: 2 }}
                style={{
                  backgroundColor: "#0f1828",
                  borderColor: "#404d63",
                }}
                labelStyle={{
                  color: "#8c8c8c",
                  fontWeight: 500,
                }}
                contentStyle={{
                  color: "#ffffff",
                }}
              >
                <Descriptions.Item label="Order Status">
                  <Tag
                    color={getStatusColor(selectedOrder.status)}
                    icon={getStatusIcon(selectedOrder.status)}
                    style={{ border: "none", fontWeight: 500 }}
                  >
                    {getStatusText(selectedOrder.status)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Total Amount">
                  <span
                    style={{
                      color: "#52c41a",
                      fontSize: "18px",
                      fontWeight: 700,
                    }}
                  >
                    {formatPrice(selectedOrder.totalAmount)}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Order Date">
                  {formatDate(selectedOrder.orderDate)}
                </Descriptions.Item>
                <Descriptions.Item label="Delivery Date">
                  {selectedOrder.deliveryDate
                    ? formatDate(selectedOrder.deliveryDate)
                    : "Not specified"}
                </Descriptions.Item>
                <Descriptions.Item label="Payment Method">
                  {selectedOrder.paymentMethod}
                </Descriptions.Item>
                <Descriptions.Item label="Order Items">
                  {selectedOrder.items.join(", ")}
                </Descriptions.Item>
              </Descriptions>

              <Card
                title="Order Items"
                style={{
                  marginTop: "24px",
                  backgroundColor: "#030416",
                  border: "1px solid #404d63",
                  borderRadius: "12px",
                }}
                headStyle={{
                  borderBottom: "1px solid #404d63",
                  color: "#ffffff",
                }}
              >
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        color: "#ffffff",
                        fontSize: "14px",
                        padding: "12px",
                        backgroundColor: "#0f1828",
                        borderRadius: "8px",
                        border: "1px solid #404d63",
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </Space>
              </Card>

              <Card
                title="Shipping Information"
                style={{
                  marginTop: "24px",
                  backgroundColor: "#030416",
                  border: "1px solid #404d63",
                  borderRadius: "12px",
                }}
                headStyle={{
                  borderBottom: "1px solid #404d63",
                  color: "#ffffff",
                }}
              >
                <Descriptions
                  column={{ xs: 1, sm: 2 }}
                  style={{
                    backgroundColor: "#030416",
                    borderColor: "#404d63",
                  }}
                  labelStyle={{
                    color: "#8c8c8c",
                    fontWeight: 500,
                  }}
                  contentStyle={{
                    color: "#ffffff",
                  }}
                >
                  <Descriptions.Item label="Billing Address">
                    {selectedOrder.billingAddress}
                  </Descriptions.Item>
                  <Descriptions.Item label="Shipping Address">
                    {selectedOrder.shippingAddress}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </>
          )}
        </Modal>
      </div>
    </>
  );
};

export default Order;
