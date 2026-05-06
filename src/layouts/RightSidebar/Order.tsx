import React from "react";
import { Button, Card, Typography, Empty, Flex, Tag } from "antd";
import { ShoppingOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useOrder } from "@/context/OrderContext";

const { Text } = Typography;

const Order: React.FC = () => {
  const { orders, clearOrders } = useOrder();

  const getStatusTag = (status: string) => {
    switch (status) {
      case "pending":
        return <Tag icon={<ClockCircleOutlined />} color="default">Pending</Tag>;
      case "processing":
        return <Tag icon={<ShoppingOutlined />} color="processing">Processing</Tag>;
      case "completed":
        return <Tag icon={<CheckCircleOutlined />} color="success">Completed</Tag>;
      case "cancelled":
        return <Tag icon={<CloseCircleOutlined />} color="error">Cancelled</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  if (orders.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <Text style={{ color: "#FFFFFF" }}>
            No orders yet. Add items to cart and checkout.
          </Text>
        }
      />
    );
  }

  return (
    <div className="rightsidebar-scroll" style={{ flex: "1 1 auto", overflow: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <ShoppingOutlined style={{ color: "#1890ff", fontSize: "16px" }} />
        <Text style={{ color: "white", fontSize: "16px", fontWeight: 600 }}>
          Orders
        </Text>
        <Text type="secondary" style={{ fontSize: "12px", marginLeft: "auto" }}>
          {orders.length} orders
        </Text>
      </div>

      {orders.map((order) => (
        <Card
          key={order.id}
          size="small"
          style={{
            backgroundColor: "#030415",
            borderColor: "#293653",
            marginBottom: "12px",
            borderRadius: "8px",
          }}
          bodyStyle={{ padding: "12px" }}
        >
          <Flex justify="space-between" align="start" style={{ marginBottom: "8px" }}>
            <Flex gap="8px" vertical>
              <Text style={{ color: "white", fontSize: "11px", fontFamily: "monospace" }}>
                {order.id.slice(-12)}
              </Text>
              <Text style={{ color: "#9EA5B0", fontSize: "10px" }}>
                {new Date(order.orderDate).toLocaleDateString()}
              </Text>
            </Flex>
            {getStatusTag(order.status)}
          </Flex>

          <div style={{ marginBottom: "8px" }}>
            {order.items.slice(0, 3).map((item, idx) => (
              <Flex key={item.id || idx} justify="space-between" style={{ marginBottom: "4px" }}>
                <Text style={{ color: "#b0b0b0", fontSize: "11px" }} ellipsis>
                  {item.name} x{item.quantity}
                </Text>
                <Text style={{ color: "white", fontSize: "11px" }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </Flex>
            ))}
            {order.items.length > 3 && (
              <Text style={{ color: "#9EA5B0", fontSize: "10px" }}>
                +{order.items.length - 3} more items
              </Text>
            )}
          </div>

          <Flex justify="space-between" align="middle" style={{ borderTop: "1px solid #293653", paddingTop: "8px" }}>
            <Text style={{ color: "#9EA5B0", fontSize: "11px" }}>
              Total
            </Text>
            <Text style={{ color: "#52c41a", fontSize: "14px", fontWeight: 600 }}>
              ${order.totalAmount.toFixed(2)}
            </Text>
          </Flex>
        </Card>
      ))}

      <Button type="text" block style={{ color: "#ff4d4f" }} onClick={clearOrders}>
        Clear All Orders
      </Button>
    </div>
  );
};

export default Order;
