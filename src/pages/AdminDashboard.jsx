import { useState, useEffect } from 'react';
import { Table, Tag, Select, Card, Statistic, Row, Col, Typography, message, Button, Input, notification, Avatar, Tabs } from 'antd';
import { ShoppingOutlined, UserOutlined, ClockCircleOutlined, SearchOutlined, ReloadOutlined, BellOutlined, MailOutlined } from '@ant-design/icons';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { API_URL } from '../config';

const { Title, Text } = Typography;
const { Option } = Select;

export default function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activities, setActivities] = useState([]);
    const [stats, setStats] = useState({ revenue: 0, totalOrders: 0, pending: 0, completed: 0 });
    const { user } = useStore();
    const navigate = useNavigate();

    const fetchOrders = async () => {
        const { token } = useStore.getState();
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/admin/orders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch orders');
            const data = await res.json();
            setOrders(data);
            calculateStats(data);
        } catch (error) {
            console.error(error);
            message.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const fetchContacts = async () => {
        const { token } = useStore.getState();
        try {
            const res = await fetch(`${API_URL}/api/admin/contacts`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch contacts');
            const data = await res.json();
            setContacts(data);
        } catch (error) {
            console.error(error);
        }
    };

    const calculateStats = (data) => {
        const totalRev = data.reduce((sum, order) => sum + (order.price || 0), 0);
        const pending = data.filter(o => o.status === 'Pending').length;
        const completed = data.filter(o => o.status === 'Completed' || o.status === 'Delivered').length;
        setStats({ revenue: totalRev, totalOrders: data.length, pending, completed });
    };

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }
        fetchOrders();
        fetchContacts();

        const socket = io(API_URL);
        socket.on('new_order', (order) => {
            notification.success({
                message: 'New Order Received!',
                description: `Order ${order.id} for ${order.item_name}`,
                icon: <BellOutlined style={{ color: '#108ee9' }} />
            });
            fetchOrders();
            setActivities(prev => [{ ...order, type: 'ORDER', time: new Date().toLocaleTimeString() }, ...prev].slice(0, 10));
        });

        socket.on('new_contact', (contact) => {
            notification.info({
                message: 'New Inquiry Received!',
                description: `${contact.name}: ${contact.message.substring(0, 30)}...`,
                icon: <MailOutlined style={{ color: '#eb2f96' }} />
            });
            fetchContacts();
            setActivities(prev => [{ ...contact, type: 'CONTACT', time: new Date().toLocaleTimeString() }, ...prev].slice(0, 10));
        });

        return () => socket.disconnect();
    }, [user]);

    const handleStatusChange = async (orderId, newStatus) => {
        const { token } = useStore.getState();
        try {
            const res = await fetch(`${API_URL}/api/admin/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                message.success(`Status updated`);
                fetchOrders();
            }
        } catch (error) {
            message.error('Update failed');
        }
    };

    const orderColumns = [
        { title: 'Order ID', dataIndex: 'id', key: 'id', render: (t) => <Text strong copyable className="text-primary">{t}</Text> },
        { title: 'Customer', dataIndex: 'user_email', key: 'user_email' },
        { title: 'Item', dataIndex: 'item_name', key: 'item_name' },
        { title: 'Price', dataIndex: 'price', key: 'price', render: (p) => `₹${p}` },
        { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color="blue">{s}</Tag> },
        {
            title: 'Actions', key: 'action', render: (_, record) => (
                <Select defaultValue={record.status} style={{ width: 140 }} onChange={(val) => handleStatusChange(record.id, val)}>
                    <Option value="Pending">Pending</Option>
                    <Option value="Stitching">Stitching</Option>
                    <Option value="Ready">Ready</Option>
                    <Option value="Delivered">Delivered</Option>
                </Select>
            )
        }
    ];

    const contactColumns = [
        { title: 'Name', dataIndex: 'name', key: 'name', render: (t) => <Text strong>{t}</Text> },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Message', dataIndex: 'message', key: 'message' },
        { title: 'Date', dataIndex: 'created_at', key: 'created_at', render: (t) => new Date(t).toLocaleString() }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <Title level={2} className="m-0">Admin Dashboard</Title>
                        <Text type="secondary">Thayal 360 Operations Control</Text>
                    </div>
                    <Button icon={<ReloadOutlined />} onClick={() => { fetchOrders(); fetchContacts(); }}>Refresh</Button>
                </div>

                <Row gutter={[24, 24]} className="mb-8">
                    <Col xs={24} md={6}><Card><Statistic title="Total Revenue" prefix="₹" value={stats.revenue} /></Card></Col>
                    <Col xs={24} md={6}><Card><Statistic title="Total Orders" value={stats.totalOrders} /></Card></Col>
                    <Col xs={24} md={6}><Card><Statistic title="Pending" value={stats.pending} valueStyle={{ color: '#cf1322' }} /></Card></Col>
                    <Col xs={24} md={6}><Card><Statistic title="Completed" value={stats.completed} valueStyle={{ color: '#3f8600' }} /></Card></Col>
                </Row>

                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={18}>
                        <Tabs defaultActiveKey="1" className="bg-white p-6 rounded-xl shadow-sm">
                            <Tabs.TabPane tab={<span><ShoppingOutlined /> Orders</span>} key="1">
                                <Table columns={orderColumns} dataSource={orders} rowKey="id" loading={loading} pagination={{ pageSize: 5 }} />
                            </Tabs.TabPane>
                            <Tabs.TabPane tab={<span><MailOutlined /> Customer Inquiries</span>} key="2">
                                <Table columns={contactColumns} dataSource={contacts} rowKey="id" pagination={{ pageSize: 5 }} />
                            </Tabs.TabPane>
                        </Tabs>
                    </Col>
                    <Col xs={24} lg={6}>
                        <Card title="Activity Feed" className="rounded-xl shadow-sm h-full">
                            <div className="space-y-4">
                                {activities.map((act, i) => (
                                    <div key={i} className="flex gap-2 text-xs border-b pb-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                            {act.type === 'CONTACT' ? <MailOutlined /> : <ShoppingOutlined />}
                                        </div>
                                        <div>
                                            <div className="font-bold">{act.type === 'CONTACT' ? 'New Inquiry' : 'New Order'}</div>
                                            <div className="text-gray-500">{act.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
}
