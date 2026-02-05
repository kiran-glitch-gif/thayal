import { useState, useEffect } from 'react';
import { Table, Tag, Select, Card, Statistic, Row, Col, Typography, message, Button, Input } from 'antd';
import { ShoppingOutlined, DollarOutlined, UserOutlined, ClockCircleOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const { Title, Text } = Typography;
const { Option } = Select;

export default function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({ revenue: 0, totalOrders: 0, pending: 0, completed: 0 });
    const { user } = useStore();
    const navigate = useNavigate();

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
        // Simple Admin Protection (Client-side)
        if (!user || !user.email.includes('admin')) {
            // Uncomment in production: navigate('/');
            message.warning("Simulating Admin View - ensure you logged in with 'admin' email for real logic if implemented.");
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
            render: (text) => <Text strong copyable>{text}</Text>,
        },
        {
            title: 'Customer',
            dataIndex: 'user_email',
            key: 'user_email',
        },
        {
            title: 'Item',
            dataIndex: 'item_name',
            key: 'item_name',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => <Text type="success">₹{price}</Text>,
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: 'Date',
            dataIndex: 'delivery_date',
            key: 'delivery_date',
            render: (date) => <span>Due: {date}</span>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: [
                { text: 'Pending', value: 'Pending' },
                { text: 'In Progress', value: 'In Progress' },
                { text: 'Completed', value: 'Completed' },
            ],
            onFilter: (value, record) => record.status.indexOf(value) === 0,
            render: (status, record) => {
                let color = 'geekblue';
                if (status === 'Completed') color = 'green';
                if (status === 'Pending') color = 'volcano';
                if (status === 'In Progress') color = 'gold';

                return (
                    <div className="flex flex-col gap-2">
                        <Tag color={color} className="mr-0 w-fit">{status.toUpperCase()}</Tag>
                        <Select
                            defaultValue={status}
                            size="small"
                            style={{ width: 120 }}
                            onChange={(val) => handleStatusChange(record.id, val)}
                        >
                            <Option value="Pending">Pending</Option>
                            <Option value="In Progress">In Progress</Option>
                            <Option value="Completed">Completed</Option>
                            <Option value="Delivered">Delivered</Option>
                            <Option value="Cancelled">Cancelled</Option>
                        </Select>
                    </div>
                );
            }
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex justify-between items-center mb-8">
                    <div>
                        <Title level={2} style={{ margin: 0 }}>Admin Dashboard</Title>
                        <Text type="secondary">Manage orders and business performance overview.</Text>
                    </div>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={fetchOrders}
                        loading={loading}
                    >
                        Refresh Data
                    </Button>
                </div>

                {/* Stats Row */}
                <Row gutter={[24, 24]} className="mb-8">
                    <Col xs={24} sm={12} lg={6}>
                        <Card hoverable className="shadow-sm">
                            <Statistic
                                title="Total Revenue"
                                value={stats.revenue}
                                precision={0}
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<DollarOutlined />}
                                suffix="₹"
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card hoverable className="shadow-sm">
                            <Statistic
                                title="Total Orders"
                                value={stats.totalOrders}
                                prefix={<ShoppingOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card hoverable className="shadow-sm">
                            <Statistic
                                title="Pending"
                                value={stats.pending}
                                valueStyle={{ color: '#cf1322' }}
                                prefix={<ClockCircleOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card hoverable className="shadow-sm">
                            <Statistic
                                title="Completed"
                                value={stats.completed}
                                valueStyle={{ color: '#096dd9' }}
                                prefix={<UserOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Orders Table */}
                <Card className="shadow-md rounded-lg" title="Live Order Management">
                    <Table
                        columns={columns}
                        dataSource={orders}
                        rowKey="id"
                        loading={loading}
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: true }}
                    />
                </Card>

            </div>
        </div>
    );
}
