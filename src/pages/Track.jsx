import { Steps, Card, Divider, Avatar, Button, Typography, Row, Col, message } from 'antd';
import { UserOutlined, VideoCameraOutlined, PhoneOutlined, LoadingOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { API_URL } from '../config';

const { Step } = Steps;
const { Title } = Typography;

const statusToStep = {
    'Pending': 0,
    'Picked Up': 1,
    'Stitching': 2,
    'QC': 3,
    'Ready': 4,
    'Delivered': 5
};

export default function Track() {
    const { id } = useParams();
    const [status, setStatus] = useState('Pending');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const socket = io(API_URL);

        // Join the specific order room
        socket.emit('join_order', id);

        // Listen for status updates
        socket.on('order_status_update', (data) => {
            if (data.id === id) {
                setStatus(data.status);
                message.info(`Order status updated to: ${data.status}`);
            }
        });

        // Initial fetch
        fetch(`${API_URL}/api/admin/orders`)
            .then(res => res.json())
            .then(orders => {
                const order = orders.find(o => o.id === id);
                if (order) setStatus(order.status);
            })
            .finally(() => setLoading(false));

        return () => socket.disconnect();
    }, [id]);

    const getCurrentStep = () => statusToStep[status] || 0;

    return (
        <div className="section-container bg-light min-h-[calc(100vh-200px)] pt-12 pb-24">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <Title level={2} className="m-0">Track Order <span className="text-primary">{id}</span></Title>
                    <Button type="primary" ghost icon={<PhoneOutlined />}>Contact Support</Button>
                </div>

                <Card className="mb-8 shadow-sm rounded-xl overflow-hidden border-none" bodyStyle={{ padding: '40px 24px' }}>
                    <Steps
                        current={getCurrentStep()}
                        responsive={true}
                        items={[
                            { title: 'Order Received', description: 'Confirmed' },
                            { title: 'Picked Up', description: 'In Transit' },
                            { title: 'Stitching', description: 'In Progress', icon: getCurrentStep() === 2 ? <LoadingOutlined /> : null },
                            { title: 'Quality Check', description: 'Verification' },
                            { title: 'Out for Delivery', description: 'Final Step' }
                        ]}
                    />
                </Card>

                <Row gutter={[24, 24]}>
                    <Col xs={24} md={16}>
                        <Card title={<span className="font-bold">Workshop Live Feed</span>} className="mb-8 shadow-sm rounded-xl border-none">
                            <div className="bg-gray-900 h-80 rounded-xl relative flex items-center justify-center text-white flex-col overflow-hidden">
                                <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 px-3 py-1 rounded text-xs animate-pulse">
                                    <div className="w-2 h-2 bg-white rounded-full"></div> LIVE
                                </div>
                                <VideoCameraOutlined className="text-5xl mb-4 opacity-50" />
                                <p className="text-gray-400">Broadcasting live from the workshop...</p>
                                <p className="text-xs text-gray-500 mt-2">Available 10 AM - 6 PM IST</p>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card title={<span className="font-bold">Your Master Tailor</span>} className="mb-6 shadow-sm rounded-xl border-none">
                            <div className="text-center">
                                <Avatar size={100} icon={<UserOutlined />} src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh" className="mb-4 border-4 border-primary/20" />
                                <h3 className="text-xl font-bold mb-1">Rajesh Kumar</h3>
                                <p className="text-gray-500 mb-6 text-sm">Specialist in Bridal Wear • 4.9 ★</p>
                                <div className="flex flex-col gap-3">
                                    <Button size="large" block icon={<VideoCameraOutlined />} className="rounded-lg">Virtual Consultation</Button>
                                    <Button size="large" block icon={<PhoneOutlined />} className="rounded-lg">Call Workshop</Button>
                                </div>
                            </div>
                        </Card>

                        <Card title={<span className="font-bold">Order Details</span>} className="shadow-sm rounded-xl border-none">
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Fabric</span>
                                    <span className="font-medium text-gray-800">Premium Silk</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Service</span>
                                    <span className="font-medium text-gray-800">Wedding Lehenga</span>
                                </div>
                                <Divider className="my-2" />
                                <div className="flex justify-between font-bold text-lg text-primary">
                                    <span>Total Amount</span>
                                    <span>₹15,000</span>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

