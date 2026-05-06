import React from "react";
import { Button, Card, Image, Typography, Empty, Flex, InputNumber } from "antd";
import { DeleteOutlined, ShoppingOutlined } from "@ant-design/icons";
import { useCart } from "@/context/CartContext";
import { useOrder } from "@/context/OrderContext";

const { Text } = Typography;

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const { addOrder } = useOrder();

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);


  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    addOrder(cartItems, totalAmount);
    clearCart();
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
    <div className="rightsidebar-scroll" style={{ flex: "1 1 auto", overflow: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <ShoppingOutlined style={{ color: "#1890ff", fontSize: "16px" }} />
        <Text style={{ color: "white", fontSize: "16px", fontWeight: 600 }}>
          Cart
        </Text>
        <Text type="secondary" style={{ fontSize: "12px", marginLeft: "auto" }}>
          {cartItems.length} items
        </Text>
      </div>

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
          <Flex gap="12px" align="start">
            <div style={{ width: "60px", height: "60px", borderRadius: "6px", overflow: "hidden", background: "#030415", border: "1px solid #293653" }}>
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} preview={false} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#293653" }}>
                  <Text style={{ color: "#b0b0b0", fontSize: "10px" }}>No img</Text>
                </div>
              )}
            </div>
            <Flex flex={1} gap="8px" vertical>
              <Text style={{ color: "white", fontSize: "13px", fontWeight: 500 }} ellipsis>
                {item.name}
              </Text>
              <Text style={{ color: "#1890ff", fontSize: "12px" }}>
                ${item.price.toFixed(2)}
              </Text>
              <Flex justify="space-between" align="center">
                <InputNumber
                  min={1}
                  max={99}
                  value={item.quantity}
                  onChange={(val) => val && updateQuantity(item.id, val)}
                  size="small"
                  style={{ width: "60px" }}
                />
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

      <Card
        size="small"
        style={{ backgroundColor: "#030415", borderColor: "#293653", marginTop: "16px" }}
        bodyStyle={{ padding: "12px" }}
      >
        <Flex justify="space-between" align="middle" style={{ marginBottom: "12px" }}>
          <Text style={{ color: "white", fontSize: "14px", fontWeight: 500 }}>
            Total
          </Text>
          <Text style={{ color: "#52c41a", fontSize: "18px", fontWeight: 600 }}>
            ${totalAmount.toFixed(2)}
          </Text>
        </Flex>
        <Button type="primary" block style={{ height: "40px", borderRadius: "6px" }} onClick={handleCheckout}>
          Checkout
        </Button>
        <Button type="text" block style={{ marginTop: "8px", color: "#ff4d4f" }} onClick={clearCart}>
          Clear Cart
        </Button>
      </Card>
    </div>
  );
};

export default Cart;
