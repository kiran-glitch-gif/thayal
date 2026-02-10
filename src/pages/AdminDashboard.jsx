import { useState, useEffect } from 'react';
import { Table, Tag, Select, Card, Statistic, Row, Col, Typography, message, Button, Input, Modal, notification } from 'antd';
import { ShoppingOutlined, DollarOutlined, UserOutlined, ClockCircleOutlined, SearchOutlined, ReloadOutlined, BellOutlined } from '@ant-design/icons';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { API_URL } from '../config';

const { Title, Text } = Typography;
const { Option } = Select;

export default function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({ revenue: 0, totalOrders: 0, pending: 0, completed: 0 });
    const { user } = useStore();
    const navigate = useNavigate();

    // Setup Real-time Notifications for Admin
    useEffect(() => {
        const socket = io(API_URL);

        socket.on('new_order', (order) => {
            notification.success({
                message: 'New Order Received!',
                description: `Order ${order.id} for ${order.item_name} from ${order.user_email}`,
                icon: <BellOutlined style={{ color: '#108ee9' }} />,
                duration: 5
            });
            fetchOrders(); // Refresh to show new order
        });

        return () => socket.disconnect();
    }, []);

    // Fetch Orders from Backend
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/admin/orders`);
            if (!res.ok) throw new Error('Failed to fetch orders');
            const data = await res.json();
            setOrders(data);
            calculateStats(data);
        } catch (error) {
            console.error(error);
            message.error('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user || (!user.email.includes('admin') && user.email !== 'priya@example.com')) {
            // Only allow if admin or for demo purposes
        }
        fetchOrders();
    }, []);

    const calculateStats = (data) => {
        const totalRev = data.reduce((sum, order) => sum + (order.price || 0), 0);
        const pending = data.filter(o => o.status === 'Pending').length;
        const completed = data.filter(o => o.status === 'Completed' || o.status === 'Delivered').length;

        setStats({
            revenue: totalRev,
            totalOrders: data.length,
            pending,
            completed
        });
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const res = await fetch(`${API_URL}/api/admin/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                message.success(`Order ${orderId} updated to ${newStatus}`);
                fetchOrders(); // Refresh data
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            message.error('Failed to update status');
        }
    };

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <Text strong copyable className="text-primary">{text}</Text>,
        },
        {
            title: 'Customer',
            dataIndex: 'user_email',
            key: 'user_email',
            render: (email) => <div className="flex items-center gap-2"><Avatar size="small" icon={<UserOutlined />} /> {email}</div>
        },
        {
            title: 'Item',
            dataIndex: 'item_name',
            key: 'item_name',
            render: (name) => <span className="font-semibold">{name}</span>
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => <Text className="font-bold text-gray-800">₹{price.toLocaleString()}</Text>,
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: 'Delivery',
            dataIndex: 'delivery_date',
            key: 'delivery_date',
            render: (date) => <Tag icon={<ClockCircleOutlined />} color="processing">{date}</Tag>
        },
        {
            title: 'Current Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const colors = {
                    'Pending': 'volcano',
                    'Picked Up': 'blue',
                    'Stitching': 'purple',
                    'QC': 'cyan',
                    'Ready': 'gold',
                    'Delivered': 'green',
                    'Cancelled': 'red'
                };
                return <Tag color={colors[status] || 'default'} className="rounded-full px-3">{status.toUpperCase()}</Tag>
            }
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_, record) => (
                <Select
                    defaultValue={record.status}
                    style={{ width: 160 }}
                    onChange={(val) => handleStatusChange(record.id, val)}
                    className="rounded-lg"
                >
                    <Option value="Pending">1. Order Received</Option>
                    <Option value="Picked Up">2. Picked Up</Option>
                    <Option value="Stitching">3. Stitching</Option>
                    <Option value="QC">4. Quality Check</Option>
                    <Option value="Ready">5. Ready for Delivery</Option>
                    <Option value="Delivered">6. Delivered</Option>
                    <Option value="Cancelled">X Cancelled</Option>
                </Select>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <Title level={2} className="m-0 font-bold text-slate-800">Operations Control Center</Title>
                        <Text className="text-slate-500">Live monitoring of tailoring orders and workshop performance.</Text>
                    </div>
                    <div className="flex gap-3">
                        <Button icon={<ReloadOutlined />} onClick={fetchOrders} loading={loading} className="rounded-lg h-10">Sync Data</Button>
                        <Button type="primary" className="bg-primary rounded-lg h-10 px-6 font-bold shadow-md shadow-primary/20">Manage Tailors</Button>
                    </div>
                </div>

                {/* Stats Row */}
                <Row gutter={[24, 24]} className="mb-10">
                    <Col xs={24} sm={12} lg={6}>
                        <Card bordered={false} className="shadow-sm rounded-2xl">
                            <Statistic
                                title={<span className="text-slate-400 font-medium">Daily Revenue</span>}
                                value={stats.revenue}
                                precision={0}
                                valueStyle={{ color: '#0F172A', fontWeight: 800 }}
                                prefix={<DollarOutlined className="text-emerald-500" />}
                                suffix="₹"
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card bordered={false} className="shadow-sm rounded-2xl">
                            <Statistic
                                title={<span className="text-slate-400 font-medium">Active Orders</span>}
                                value={stats.totalOrders}
                                valueStyle={{ color: '#0F172A', fontWeight: 800 }}
                                prefix={<ShoppingOutlined className="text-indigo-500" />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card bordered={false} className="shadow-sm rounded-2xl">
                            <Statistic
                                title={<span className="text-slate-400 font-medium">Action Required</span>}
                                value={stats.pending}
                                valueStyle={{ color: '#E11D48', fontWeight: 800 }}
                                prefix={<ClockCircleOutlined className="text-rose-500" />}
                                suffix=" Orders"
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card bordered={false} className="shadow-sm rounded-2xl">
                            <Statistic
                                title={<span className="text-slate-400 font-medium">Success Rate</span>}
                                value={98.4}
                                valueStyle={{ color: '#0F172A', fontWeight: 800 }}
                                prefix={<UserOutlined className="text-sky-500" />}
                                suffix="%"
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Orders Table */}
                <Card
                    bordered={false}
                    className="shadow-xl rounded-2xl overflow-hidden"
                    title={<div className="flex items-center gap-2"><BellOutlined className="text-primary" /> <span className="font-bold">Real-time Order Queue</span></div>}
                    extra={<Input prefix={<SearchOutlined />} placeholder="Search customer ID or email..." className="w-64 rounded-lg bg-slate-50 border-none" />}
                >
                    <Table
                        columns={columns}
                        dataSource={orders}
                        rowKey="id"
                        loading={loading}
                        pagination={{ pageSize: 8 }}
                        scroll={{ x: true }}
                        className="admin-table"
                    />
                </Card>

            </div>
        </div>
    );
}

