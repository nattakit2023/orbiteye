import React from "react";
import { Button, Card, Typography, Empty, Flex, Divider } from "antd";
import {
  DeleteOutlined,
  ShoppingOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useCart } from "@/context/CartContextValue";
import { useConvertCartToOrder } from "@/service/graphql/hooks/useOrder";
import { ArrowRight } from "lucide-react";
import { message } from "antd";

const { Text } = Typography;

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, clearCart, serverCartId } = useCart();
  const convertToOrder = useConvertCartToOrder();

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    
    if (!serverCartId) {
      message.error("No cart found");
      return;
    }
    
    try {
      const result = await convertToOrder.mutateAsync({
        cartId: parseInt(serverCartId, 10),
      });
      
      if (result.success) {
        message.success("Order placed successfully!");
        clearCart();
      } else {
        message.error(result.message || "Failed to convert cart to order");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      message.error("Checkout failed. Please try again.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <Text style={{ color: "#FFFFFF" }}>
            No items in cart. Add items from search results.
          </Text>
        }
      />
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "16px",
          flexShrink: 0,
        }}
      >
        <ShoppingOutlined style={{ color: "#1890ff", fontSize: "16px" }} />
        <Text style={{ color: "white", fontSize: "16px", fontWeight: 600 }}>
          Cart
        </Text>
        <Text type="secondary" style={{ fontSize: "12px", marginLeft: "auto" }}>
          {cartItems.length} items
        </Text>
      </div>

      <div
        className="rightsidebar-scroll"
        style={{ flex: 1, overflow: "auto" }}
      >
        {cartItems.map((item) => (
          <Card
            key={item.id}
            size="small"
            style={{
              backgroundColor: "#030415",
              borderColor: "#293653",
              marginBottom: "12px",
              borderRadius: "8px",
            }}
            bodyStyle={{ padding: "12px" }}
          >
            <Flex gap="12px" align="flex-start">
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "6px",
                  overflow: "hidden",
                  background: "#030415",
                  border: "1px solid #293653",
                  flexShrink: 0,
                }}
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#293653",
                    }}
                  >
                    <Text style={{ color: "#b0b0b0", fontSize: "10px" }}>
                      No img
                    </Text>
                  </div>
                )}
              </div>
              <Flex
                flex={1}
                justify="space-between"
                vertical
                style={{ width: "100%" }}
              >
                <Flex justify="space-between" align="center">
                  <Text
                    style={{ color: "#1890ff", fontSize: "11px" }}
                    ellipsis={{ tooltip: item.name }}
                  >
                    {item.name.length > 10
                      ? `${item.name.substring(0, 10)}...`
                      : item.name}
                  </Text>
                  <Text style={{ color: "white", fontSize: "12px" }}>
                    ${item.price.toFixed(2)}
                  </Text>
                </Flex>
                <Text
                  style={{
                    color: "white",
                    fontSize: "14px",
                    fontWeight: 600,
                    maxWidth: "120px",
                  }}
                >
                  {item.satelliteName || "THEOS 2"}
                </Text>
                <Flex justify="space-between" align="center" gap="4px">
                  <Flex gap={4}>
                    <CalendarOutlined
                      style={{ color: "#b0b0b0", fontSize: "10px" }}
                    />
                    <Text style={{ color: "#b0b0b0", fontSize: "10px" }}>
                      {formatDate(item.date)}
                    </Text>
                  </Flex>
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => removeFromCart(item.id)}
                  />
                </Flex>
              </Flex>
            </Flex>
          </Card>
        ))}
      </div>

      <Card
        size="small"
        style={{
          backgroundColor: "#030415",
          borderColor: "#293653",
          bottom: "0",
          left: "0",
          flexShrink: 0,
          width: "100%",
          position: "absolute",
          padding: "10px",
        }}
      >
          <Flex justify="space-between" align="middle" style={{padding: "0px 10px 5px 10px"}}>
            <Text style={{ color: "#9EA5B0", fontSize: "14px", fontWeight: 500 }}>
              Subtotal
            </Text>
            <Text
              style={{ color: "#9EA5B0", fontSize: "16px", fontWeight: 600 }}
            >
              ${totalAmount.toFixed(2)}
            </Text>
          </Flex>
          <Flex justify="space-between" align="middle" style={{padding: "0px 10px 5px 10px"}}>
            <Text style={{ color: "#9EA5B0", fontSize: "14px", fontWeight: 500 }}>
              Processing fee
            </Text>
            <Text
              style={{ color: "#9EA5B0", fontSize: "16px", fontWeight: 600 }}
            >
              ${(0).toFixed(2)}
            </Text>
          </Flex>
        <Divider style={{ borderColor: "white", width: "100%" }} />
        <Flex justify="space-between" align="middle" style={{padding: "0px 10px 20px 10px"}}>
          <Text style={{ color: "white", fontSize: "16px", fontWeight: 500 }}>
            Total
          </Text>
          <Text style={{ color: "white", fontSize: "16px", fontWeight: 600 }}>
            ${totalAmount.toFixed(2)}
          </Text>
        </Flex>
        <Button
          type="primary"
          block
          style={{ height: "40px", borderRadius: "6px" }}
          onClick={handleCheckout}
        >
          Proceed to payment
          <ArrowRight style={{ color: "white", height: "18px", marginLeft: "8px" }} />
        </Button>
      </Card>
    </div>
  );
};

export default Cart;
