import { AntDesignOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Image,
  Modal,
  Progress,
  Space,
  Typography,
} from 'antd';
import React, { useState } from 'react';

import Avatar1 from '../../../assets/images/avatars/avatar1.jpg';
import Avatar2 from '../../../assets/images/avatars/avatar2.jpg';
import { useAuthStore } from '../../../store/authStore';
import { useThemeStore } from '../../../store/themeStore';

const UserCard = ({ color }: { color: string }) => {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [avatar, setAvatar] = useState<string>();
  const imgList = ['', Avatar1, Avatar2];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const selectImage = (event: React.MouseEvent) => {
    setAvatar(event.currentTarget.id);
  };
  return (
    <Space
      style={{
        height: '500px',
        backgroundColor: color,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 50px',
        boxShadow: '5px 5px 20px #000',
      }}
    >
      <Space
        style={{
          minWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderBottom: theme === 'light' ? '2px solid #000' : '2px solid #fff',
        }}
      >
        {avatar ? (
          <Avatar size={150} src={imgList[Number(avatar)]} />
        ) : (
          <Avatar size={150} icon={<AntDesignOutlined />} />
        )}

        <Button type="primary" onClick={showModal}>
          Change avatar
        </Button>
        <Modal
          title="Change avatar"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Space>
            <img
              src={Avatar1}
              alt="avatar"
              id="1"
              onClick={selectImage}
              role="presentation"
            />
            <Image
              src={Avatar2}
              alt="avatar"
              preview={false}
              id="2"
              onClick={selectImage}
            />
          </Space>
        </Modal>
        <Typography.Text style={{ fontSize: '40px', fontWeight: 700 }}>
          {user?.username}
        </Typography.Text>
        <Typography.Text style={{ fontSize: '20px', color: '#77b0f2' }}>
          {user?.email}
        </Typography.Text>
      </Space>
      <Typography.Text style={{ fontSize: '30px' }}>Statistics</Typography.Text>
      <Space style={{ display: 'flex', flexDirection: 'column' }}>
        <Space>
          <Progress
            type="circle"
            width={70}
            percent={40}
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            format={percent => `${percent} / 195`}
          />
          <Typography.Text style={{ fontSize: '22px' }}>
            You visited 40 capitals
          </Typography.Text>
        </Space>
        <Space>
          <Typography.Text>23</Typography.Text>
          <Typography.Text style={{ fontSize: '22px' }}>
            You reviews 23 capitals
          </Typography.Text>
        </Space>
      </Space>
    </Space>
  );
};
export { UserCard };
