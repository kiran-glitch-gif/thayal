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
    const [activities, setActivities] = useState([]);
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
            setActivities(prev => [{ ...order, type: 'ORDER', time: new Date().toLocaleTimeString() }, ...prev].slice(0, 10));
        });

        socket.on('user_activity', (act) => {
            setActivities(prev => [{ ...act, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 10));
            if (act.type === 'LOGIN') {
                message.info(`${act.name} logged in just now`);
            }
        });

        return () => socket.disconnect();
    }, []);

    // Fetch Orders from Backend
    const fetchOrders = async () => {
        const { token } = useStore.getState();
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/admin/orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
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
        if (!user) {
            message.warning("Please login as Admin to access this panel.");
            navigate('/');
            // Trigger login modal via state if possible, or just redirect
            return;
        }

        // For development/review phase, we allow the user to see the dashboard 
        // even if not strictly 'admin' in email, but we notify them.
        if (!user.email.includes('admin') && user.email !== 'priya@example.com') {
            notification.info({
                message: 'Review Mode Active',
                description: 'You are viewing the Admin Dashboard in Review Mode. In production, this is restricted to admin@thayal360.com.',
                placement: 'top'
            });
        }

        fetchOrders();
    }, [user]);

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
        const { token } = useStore.getState();
        try {
            const res = await fetch(`${API_URL}/api/admin/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
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
                    <Col xs={24} lg={18}>
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
                    </Col>

                    <Col xs={24} lg={6}>
                        <Card
                            bordered={false}
                            className="shadow-xl rounded-2xl h-full"
                            title={<div className="flex items-center gap-2 text-rose-600"><ClockCircleOutlined /> <span className="font-bold">Live Activity Feed</span></div>}
                        >
                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                {activities.length === 0 && <p className="text-gray-400 text-center py-8">No recent activity detected.</p>}
                                {activities.map((act, i) => (
                                    <div key={i} className="flex gap-3 items-start animate-fade-in">
                                        <Avatar size="small" className="bg-primary/10 text-primary flex-shrink-0">
                                            {act.type === 'LOGIN' ? <UserOutlined /> : <ShoppingOutlined />}
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm m-0 font-medium text-slate-800 truncate">
                                                {act.type === 'LOGIN' ? `${act.name} Logged In` : `New Order: ${act.id}`}
                                            </p>
                                            <p className="text-xs m-0 text-slate-400">{act.time} • {act.email || act.user_email}</p>
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

