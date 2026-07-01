import React from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Empty,
  Popconfirm,
  message,
  Divider,
  Space,
  Progress,
  Tag,
  Image,
  Modal,
} from "antd";
import {
  DeleteOutlined,
  ShoppingCartOutlined,
  CalendarOutlined,
  CloudOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useCart } from "@/context/CartContextValue";
import { useOrder } from "@/context/OrderContextValue";

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { addOrder } = useOrder();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
    message.success("Item removed from cart");
  };

  const handleClearCart = () => {
    clearCart();
    message.success("Cart cleared");
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = subtotal * 0.1; // 10% tax
    return subtotal + tax;
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const handleCheckout = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    // Save order to OrderContext
    addOrder(cartItems, calculateTotal());

    setIsPaymentModalOpen(false);
    clearCart();
    message.success("Payment successful! Thank you for your order.");
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCloudColor = (cloud: number) => {
    if (cloud < 20) return "#52c41a"; // Green
    if (cloud < 50) return "#1890ff"; // Blue
    if (cloud < 80) return "#faad14"; // Orange
    return "#ff4d4f"; // Red
  };

  const getQualityColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case "excellent":
        return "#52c41a";
      case "good":
        return "#1890ff";
      case "fair":
        return "#faad14";
      case "poor":
        return "#ff4d4f";
      default:
        return "#8c8c8c";
    }
  };

  return (
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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flex: "0 0 auto",
          marginBottom: "24px",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
          }}
        >
          <ShoppingCartOutlined
            style={{ marginRight: "12px", color: "#1890ff" }}
          />
          Shopping Cart
        </h1>
        <Button
          icon={<DeleteOutlined />}
          danger
          onClick={handleClearCart}
          disabled={cartItems.length === 0}
          style={{
            borderColor: "#ff4d4f",
            color: "#ff4d4f",
          }}
        >
          Clear Cart
        </Button>
      </div>

      {cartItems.length === 0 ? (
        <div
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
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
                  Your cart is empty. Start exploring and add items!
                </span>
              }
            />
          </div>
        </div>
      ) : (
        <Row gutter={[24, 24]} style={{ flex: 1, overflow: "hidden" }}>
          {/* Cart Items */}
          <Col
            xs={24}
            lg={18}
            style={{
              height: "100%",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              className="rightsidebar-scroll"
              style={{
                flex: 1,
                overflowY: "auto",
                paddingRight: "8px",
                paddingBottom: "24px",
              }}
            >
              <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
              >
                {cartItems.map((item) => (
                  <Card
                    key={item.id}
                    style={{
                      backgroundColor: "#0f1828",
                      border: "1px solid #404d63",
                      borderRadius: "12px",
                    }}
                  >
                    <Row gutter={24}>
                      {/* Image Column */}
                      {item.imageUrl && (
                        <Col xs={24} sm={8} md={6}>
                          <div
                            style={{
                              height: "180px",
                              overflow: "hidden",
                              borderRadius: "8px",
                              border: "1px solid #404d63",
                            }}
                          >
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              preview={false}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        </Col>
                      )}
                      <Col xs={24} sm={16} md={item.imageUrl ? 18 : 24}>
                        {/* Name */}
                        <h3
                          style={{
                            fontSize: "20px",
                            fontWeight: 600,
                            marginBottom: "16px",
                            color: "#ffffff",
                          }}
                        >
                          {item.name}
                        </h3>

                        {/* Date */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "12px",
                          }}
                        >
                          <CalendarOutlined
                            style={{
                              marginRight: "8px",
                              color: "#52c41a",
                              fontSize: "14px",
                            }}
                          />
                          <span style={{ color: "#8c8c8c", fontSize: "14px" }}>
                            {formatDate(item.date)}
                          </span>
                        </div>

                        {/* Price Display */}
                        <div
                          style={{
                            textAlign: "right",
                            marginBottom: "16px",
                          }}
                        >
                          <div
                            style={{
                              color: "#8c8c8c",
                              fontSize: "12px",
                              marginBottom: "4px",
                            }}
                          >
                            Price
                          </div>
                          <div
                            style={{
                              color: "#1890ff",
                              fontSize: "20px",
                              fontWeight: 700,
                            }}
                          >
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>

                        {/* Quality Badge */}
                        <div style={{ marginBottom: "16px" }}>
                          <Space size="middle">
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <ThunderboltOutlined
                                style={{
                                  marginRight: "6px",
                                  color: getQualityColor(item.quality),
                                  fontSize: "14px",
                                }}
                              />
                              <span
                                style={{ color: "#8c8c8c", fontSize: "13px" }}
                              >
                                Quality:
                              </span>
                              <Tag
                                color={getQualityColor(item.quality)}
                                style={{
                                  marginLeft: "8px",
                                  fontWeight: 500,
                                }}
                              >
                                {item.quality}
                              </Tag>
                            </div>
                          </Space>
                        </div>

                        {/* Cloud Coverage */}
                        <div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "8px",
                            }}
                          >
                            <Space size="small">
                              <CloudOutlined
                                style={{
                                  color: getCloudColor(item.cloud),
                                  fontSize: "14px",
                                }}
                              />
                              <span
                                style={{ color: "#8c8c8c", fontSize: "13px" }}
                              >
                                Cloud Coverage
                              </span>
                            </Space>
                            <span
                              style={{
                                color: getCloudColor(item.cloud),
                                fontSize: "16px",
                                fontWeight: 600,
                              }}
                            >
                              {item.cloud.toFixed(1)}%
                            </span>
                          </div>
                          <Progress
                            percent={Math.min(item.cloud, 100)}
                            strokeColor={{
                              "0%": "#52c41a",
                              "50%": "#1890ff",
                              "100%": "#ff4d4f",
                            }}
                            showInfo={false}
                            strokeWidth={6}
                            style={{
                              backgroundColor: "#293653",
                            }}
                          />
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginTop: "6px",
                            }}
                          >
                            <span
                              style={{ fontSize: "11px", color: "#52c41a" }}
                            >
                              Clear
                            </span>
                            <span
                              style={{ fontSize: "11px", color: "#ff4d4f" }}
                            >
                              Cloudy
                            </span>
                          </div>
                        </div>
                      </Col>

                      <Col xs={24} md={item.imageUrl ? 6 : 8}>
                        <div
                          style={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                            gap: "12px",
                          }}
                        >
                          <Popconfirm
                            title="Remove from cart?"
                            description="This action cannot be undone"
                            onConfirm={() => handleRemoveItem(item.id)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button
                              type="default"
                              danger
                              icon={<DeleteOutlined />}
                              style={{
                                borderColor: "#ff4d4f",
                                color: "#ff4d4f",
                                width: "100%",
                                height: "40px",
                              }}
                            >
                              Remove
                            </Button>
                          </Popconfirm>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </Space>
            </div>
          </Col>

          {/* Order Summary */}
          <Col xs={24} lg={6} xl={5}>
            <Card
              title="Order Summary"
              style={{
                backgroundColor: "#0f1828",
                border: "1px solid #404d63",
                borderRadius: "12px",
                position: "sticky",
                top: "24px",
              }}
              headStyle={{
                borderBottom: "1px solid #404d63",
                color: "#ffffff",
              }}
            >
              <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "#8c8c8c", fontSize: "14px" }}>
                    Items ({cartItems.length})
                  </span>
                  <span
                    style={{
                      color: "#ffffff",
                      fontSize: "16px",
                      fontWeight: 600,
                    }}
                  >
                    {cartItems.reduce(
                      (total, item) => total + item.quantity,
                      0,
                    )}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "#8c8c8c", fontSize: "14px" }}>
                    Subtotal
                  </span>
                  <span
                    style={{
                      color: "#ffffff",
                      fontSize: "16px",
                      fontWeight: 600,
                    }}
                  >
                    {formatPrice(calculateSubtotal())}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "#8c8c8c", fontSize: "14px" }}>
                    Tax (10%)
                  </span>
                  <span
                    style={{
                      color: "#ffffff",
                      fontSize: "16px",
                      fontWeight: 600,
                    }}
                  >
                    {formatPrice(calculateSubtotal() * 0.1)}
                  </span>
                </div>

                <Divider style={{ borderColor: "#404d63", margin: "16px 0" }} />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: "#ffffff",
                      fontSize: "16px",
                      fontWeight: 600,
                    }}
                  >
                    Total
                  </span>
                  <span
                    style={{
                      color: "#52c41a",
                      fontSize: "24px",
                      fontWeight: 700,
                    }}
                  >
                    {formatPrice(calculateTotal())}
                  </span>
                </div>

                <Button
                  type="primary"
                  size="large"
                  icon={<CheckCircleOutlined />}
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                  style={{
                    backgroundColor: "#1890ff",
                    borderColor: "#1890ff",
                    color: "#ffffff",
                    height: "48px",
                    fontSize: "16px",
                    fontWeight: 600,
                  }}
                >
                  Proceed to Payment
                </Button>

                <div
                  style={{
                    textAlign: "center",
                    color: "#8c8c8c",
                    fontSize: "12px",
                  }}
                >
                  <CheckCircleOutlined
                    style={{ marginRight: "4px", color: "#52c41a" }}
                  />
                  Secure payment powered by Stripe
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      )}

      {/* Payment Modal with QR Code */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <CheckCircleOutlined
              style={{ color: "#52c41a", fontSize: "24px" }}
            />
            <span
              style={{ color: "#000000", fontSize: "18px", fontWeight: 600 }}
            >
              PromptPay Payment
            </span>
          </div>
        }
        open={isPaymentModalOpen}
        onCancel={() => setIsPaymentModalOpen(false)}
        footer={null}
        width={480}
        style={{
          top: "20px",
        }}
        bodyStyle={{
          backgroundColor: "#0f1828",
          border: "1px solid #404d63",
          borderRadius: "8px",
          padding: "32px 24px",
        }}
        closeIcon={<span style={{ color: "#8c8c8c" }}>✕</span>}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          {/* QR Code Image */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "16px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
          >
            <Image
              src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=promptpay"
              alt="PromptPay QR Code"
              preview={false}
              style={{ width: "200px", height: "200px" }}
            />
          </div>

          {/* Payment Amount */}
          <div
            style={{
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: "#8c8c8c",
                fontSize: "14px",
                marginBottom: "8px",
              }}
            >
              Total Amount
            </div>
            <div
              style={{
                color: "#52c41a",
                fontSize: "36px",
                fontWeight: 700,
              }}
            >
              {formatPrice(calculateTotal())}
            </div>
          </div>

          {/* Instructions */}
          <div
            style={{
              backgroundColor: "#1a2332",
              padding: "16px",
              borderRadius: "8px",
              width: "100%",
            }}
          >
            <div
              style={{
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 600,
                marginBottom: "12px",
              }}
            >
              Instructions:
            </div>
            <ol
              style={{
                color: "#8c8c8c",
                fontSize: "13px",
                marginLeft: "20px",
                marginBottom: 0,
                lineHeight: "1.8",
              }}
            >
              <li>Open your PromptPay app</li>
              <li>Scan the QR code above</li>
              <li>Confirm payment amount: {formatPrice(calculateTotal())}</li>
              <li>Complete the payment</li>
            </ol>
          </div>

          {/* Action Buttons */}
          <Space size="middle" style={{ width: "100%" }}>
            <Button
              type="primary"
              size="large"
              onClick={() => setIsPaymentModalOpen(false)}
              style={{
                flex: 1,
                height: "44px",
                fontSize: "15px",
                fontWeight: 600,
                backgroundColor: "red",
                borderColor: "#404d63",
                color: "#ffffff",
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<CheckCircleOutlined />}
              onClick={handlePaymentSuccess}
              style={{
                flex: 1,
                height: "44px",
                fontSize: "15px",
                fontWeight: 600,
                backgroundColor: "#52c41a",
                borderColor: "#52c41a",
              }}
            >
              I've Paid
            </Button>
          </Space>

          {/* Security Note */}
          <div
            style={{
              textAlign: "center",
              color: "#8c8c8c",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <CheckCircleOutlined style={{ color: "#52c41a" }} />
            Secure payment with PromptPay
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Cart;
