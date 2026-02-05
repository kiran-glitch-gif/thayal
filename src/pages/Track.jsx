import { Steps, Card, Divider, Avatar, Button, Typography, Row, Col } from 'antd';
import { UserOutlined, VideoCameraOutlined, PhoneOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';

const { Step } = Steps;
const { Title } = Typography;

export default function Track() {
    const { id } = useParams();

    return (
        <div className="section-container bg-light min-h-[calc(100vh-200px)]">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <Title level={2} className="m-0">Track Order <span className="text-primary">{id || '#TH-8920'}</span></Title>
                    <Button>Need Help?</Button>
                </div>

                <Card className="mb-8 shadow-sm">
                    <Steps current={2} progressDot className="p-4">
                        <Step title="Order Placed" description="25 Jan" />
                        <Step title="Cutting" description="27 Jan" />
                        <Step title="Stitching" description="In Progress" />
                        <Step title="Delivered" description="Est. 30 Jan" />
                    </Steps>
                </Card>

                <Row gutter={24}>
                    <Col xs={24} md={16}>
                        <Card title="Workshop Live Feed" className="mb-8 shadow-sm">
                            <div className="bg-gray-900 h-64 rounded flex items-center justify-center text-white flex-col">
                                <VideoCameraOutlined className="text-4xl mb-4" />
                                <p>Live stitching stream available during work hours (10 AM - 6 PM)</p>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card title="Your Tailor" className="mb-8 shadow-sm">
                            <div className="text-center">
                                <Avatar size={80} icon={<UserOutlined />} src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh" className="mb-4" />
                                <h3 className="text-lg font-bold">Rajesh Kumar</h3>
                                <p className="text-gray-500 mb-4">Master Tailor • 4.8 ★</p>
                                <div className="flex gap-2 justify-center">
                                    <Button icon={<PhoneOutlined />} />
                                    <Button icon={<VideoCameraOutlined />}>Video Call</Button>
                                </div>
                            </div>
                        </Card>

                        <Card title="Payment Summary" className="shadow-sm">
                            <div className="flex justify-between mb-2">
                                <span>Fabric</span>
                                <span>₹2500</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span>Stitching</span>
                                <span>₹1500</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span>Delivery</span>
                                <span className="text-success">Free</span>
                            </div>
                            <Divider className="my-2" />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>₹4000</span>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
}
