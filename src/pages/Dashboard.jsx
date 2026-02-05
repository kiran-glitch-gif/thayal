import { Layout, Menu, Card, Table, Tag, Statistic, Button, Avatar, Typography } from 'antd';
import { UserOutlined, ShoppingOutlined, SkinOutlined, HistoryOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useEffect, useState } from 'react';

const { Sider, Content } = Layout;
const { Title } = Typography;

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useStore();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (user?.email) {
            fetch(`/api/orders?email=${user.email}`)
                .then(res => res.json())
                .then(data => setOrders(data))
                .catch(err => console.error(err));
        }
    }, [user]);

    const columns = [
        { title: 'Order ID', dataIndex: 'id', key: 'id', render: (text) => <span className="font-mono">{text}</span> },
        { title: 'Item', dataIndex: 'item_name', key: 'item' },
        {
            title: 'Status', dataIndex: 'status', key: 'status', render: (status) => {
                let color = 'blue';
                if (status === 'DELIVERED') color = 'green';
                if (status === 'STITCHING') color = 'orange';
                return <Tag color={color}>{status}</Tag>;
            }
        },
        { title: 'Tailor', dataIndex: 'tailor', key: 'tailor' },
        { title: 'Delivery', dataIndex: 'delivery_date', key: 'delivery' },
        {
            title: 'Action', key: 'action', render: (_, record) => (
                <Button type="link" size="small" onClick={() => navigate(`/track/${record.id}`)}>Track</Button>
            )
        },
    ];

    return (
        <Layout className="bg-light min-h-[calc(100vh-80px)]">
            <Sider width={250} theme="light" className="hidden lg:block border-r border-gray-200">
                <div className="p-6 text-center border-b border-gray-100">
                    <Avatar size={64} icon={<UserOutlined />} src="https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" className="mb-4" />
                    <h3 className="font-bold text-lg">{user?.name}</h3>
                    <p className="text-gray-500 text-sm">{user?.email}</p>
                </div>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    style={{ borderRight: 0 }}
                    items={[
                        { key: '1', icon: <ShoppingOutlined />, label: 'My Orders' },
                        { key: '2', icon: <SkinOutlined />, label: 'Measurements', onClick: () => navigate('/measurements') },
                        { key: '3', icon: <HistoryOutlined />, label: 'Order History' },
                    ]}
                />
            </Sider>

            <Content className="p-6 md:p-8">
                <Title level={3} className="mb-6">Dashboard</Title>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card bordered={false} className="shadow-sm">
                        <Statistic title="Active Orders" value={orders.length} prefix={<ShoppingOutlined className="text-primary" />} />
                    </Card>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic title="Wallet Balance" value={user?.wallet} precision={2} prefix="₹" />
                    </Card>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic title="Saved Measurements" value={1} prefix={<SkinOutlined />} />
                    </Card>
                </div>

                <Card title="Recent Orders" bordered={false} className="shadow-sm">
                    <Table columns={columns} dataSource={orders} rowKey="id" pagination={false} scroll={{ x: 600 }} />
                </Card>
            </Content>
        </Layout>
    );
}
