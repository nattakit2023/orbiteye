import type React from "react";
import { useNavigate } from "react-router-dom";
import "../authentication.css";
import { Image, Button, Typography, Flex } from "antd";
import { SendOutlined } from "@ant-design/icons";

const { Title } = Typography;

const Explore: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex">
      <div className="background_image">
        <Image
          src="../../../public/assets/image/Background_Explore_1920.png"
          width="100%"
          height="100%"
          preview={false}
        />
      </div>

      <Flex
        justify="center"
        align="center"
        vertical
        // gap="small"
        className="front_background_80"
      >
        <Image
          src="https://www.scgroupthai.com/images/client/scm.png"
          width="100px"
          preview={false}
        />
        <Title
          style={{
            fontSize: "56px",
            fontWeight: "bold",
            fontFamily: "FontSC",
          }}
        >
          SC Management Co.,Ltd
        </Title>
        <Title
          style={{
            fontFamily: "FontSCdescript",
            fontSize: "22px",
            fontWeight: 500,
            marginBottom: 30,
          }}
        >
          Offshore vessel & assest
        </Title>
        <Button
          variant="solid"
          color="default"
          size="large"
          style={{
            width: "15%",
            height: "7%",
            fontSize: "18px",
            fontWeight: 500,
          }}
          onClick={() => navigate("/authentication/login")}
        >
          <SendOutlined />
          Explore Our Operations
        </Button>
      </Flex>
    </div>
  );
};

export default Explore;
