import { Form, Input, Button, Collapse, Row, Col, Typography, message } from 'antd';
import { MailOutlined, WhatsAppOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { API_URL } from '../config';

const { Title } = Typography;
const { Panel } = Collapse;

export default function Contact() {
    return (
        <div className="section-container bg-light/50">
            <div className="text-center mb-12">
                <Title level={2}>Contact Support</Title>
                <p className="text-gray-500">We're here to help you 24/7</p>
            </div>

            <Row gutter={48}>
                <Col xs={24} md={12} className="mb-8">
                    <Form
                        layout="vertical"
                        size="large"
                        className="bg-white p-6 rounded-lg shadow-sm"
                        onFinish={async (values) => {
                            try {
                                const res = await fetch(`${API_URL}/api/contact`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(values)
                                });
                                if (res.ok) {
                                    message.success("Message sent! Our team will contact you soon.");
                                } else {
                                    throw new Error('Failed to send message');
                                }
                            } catch (e) {
                                message.error("Could not send message. Please try again.");
                            }
                        }}
                    >
                        <Form.Item label="Name" name="name" rules={[{ required: true }]}><Input /></Form.Item>
                        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}><Input /></Form.Item>
                        <Form.Item label="Message" name="message" rules={[{ required: true }]}><Input.TextArea rows={4} /></Form.Item>
                        <Button type="primary" htmlType="submit" className="bg-primary w-full">Send Message</Button>
                    </Form>
                </Col>

                <Col xs={24} md={12}>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-green-100 p-3 rounded-full"><WhatsAppOutlined className="text-2xl text-green-600" /></div>
                            <div>
                                <h4 className="font-bold">WhatsApp</h4>
                                <p className="text-gray-600">+91 98765 43210</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-100 p-3 rounded-full"><MailOutlined className="text-2xl text-blue-600" /></div>
                            <div>
                                <h4 className="font-bold">Email</h4>
                                <p className="text-gray-600">support@thayal360.com</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-orange-100 p-3 rounded-full"><EnvironmentOutlined className="text-2xl text-orange-600" /></div>
                            <div>
                                <h4 className="font-bold">Workshop</h4>
                                <p className="text-gray-600">123 Textile Road, Kangayam, Tamil Nadu</p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h4 className="font-bold mb-4">Frequently Asked Questions</h4>
                            <Collapse accordion>
                                <Panel header="How do I measure myself?" key="1"><p>Use our AI tool or book a home visit.</p></Panel>
                                <Panel header="What is the delivery time?" key="2"><p>Standard delivery is 5-7 days.</p></Panel>
                                <Panel header="Do you provide fabric?" key="3"><p>Yes, we have a wide range of premium fabrics.</p></Panel>
                            </Collapse>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
}
