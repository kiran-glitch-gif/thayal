import { Tabs, Form, Input, Button, Upload, Alert, Card, DatePicker, Rate } from 'antd';
import { UploadOutlined, VideoCameraOutlined, FormOutlined, CalendarOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

export default function Measurements() {
    const onFinish = (values) => {
        console.log('Measurements:', values);
    };

    return (
        <div className="section-container">
            <h2 className="text-3xl font-bold mb-8 text-center">Your Measurements</h2>

            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm max-w-4xl mx-auto">
                <Tabs defaultActiveKey="2" centered type="card">
                    <TabPane tab={<span className="flex items-center gap-2"><VideoCameraOutlined /> AI Measurement</span>} key="1">
                        <div className="text-center py-12">
                            <div className="bg-gray-100 h-64 w-full md:w-2/3 mx-auto rounded-lg flex items-center justify-center mb-6">
                                <VideoCameraOutlined className="text-6xl text-gray-400" />
                            </div>
                            <p className="text-lg mb-4">Allow camera access to scan your body measurements with 95% accuracy.</p>
                            <Button type="primary" size="large">Start AI Scan</Button>
                        </div>
                    </TabPane>

                    <TabPane tab={<span className="flex items-center gap-2"><FormOutlined /> Self Measure</span>} key="2">
                        <Form layout="vertical" onFinish={onFinish} className="mt-6">
                            <Alert message="Guide" description="Use a standard inch tape. Keep one finger gap for comfort." type="info" showIcon className="mb-6" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Form.Item label="Bust (inches)" name="bust" rules={[{ required: true }]}>
                                    <Input type="number" placeholder="32" />
                                </Form.Item>
                                <Form.Item label="Waist (inches)" name="waist" rules={[{ required: true }]}>
                                    <Input type="number" placeholder="28" />
                                </Form.Item>
                                <Form.Item label="Hips (inches)" name="hips" rules={[{ required: true }]}>
                                    <Input type="number" placeholder="36" />
                                </Form.Item>
                                <Form.Item label="Shoulder (inches)" name="shoulder" rules={[{ required: true }]}>
                                    <Input type="number" placeholder="14" />
                                </Form.Item>
                                <Form.Item label="Arm Hole (inches)" name="armhole">
                                    <Input type="number" />
                                </Form.Item>
                                <Form.Item label="Sleeve Length (inches)" name="sleeve">
                                    <Input type="number" />
                                </Form.Item>
                            </div>

                            <Form.Item label="Upload Reference Photos (Optional)">
                                <Upload>
                                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                </Upload>
                            </Form.Item>

                            <Button type="primary" htmlType="submit" size="large" block className="mt-4 bg-primary">
                                Save Measurements
                            </Button>
                        </Form>
                    </TabPane>

                    <TabPane tab={<span className="flex items-center gap-2"><CalendarOutlined /> Book Tailor</span>} key="3">
                        <div className="mt-6 text-center">
                            <h3 className="font-semibold text-lg mb-6">Expert measurement at your home for ₹199</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
                                <Card size="small" title="Rajesh Kumar" extra={<Rate disabled defaultValue={5} className="text-xs" />}>
                                    <p>5 years exp • 150+ visits</p>
                                    <Button type="link">Select</Button>
                                </Card>
                                <Card size="small" title="Anjali Devi" extra={<Rate disabled defaultValue={4.5} className="text-xs" />}>
                                    <p>3 years exp • 80+ visits</p>
                                    <Button type="link">Select</Button>
                                </Card>
                            </div>
                            <Form layout="inline" className="justify-center">
                                <Form.Item><DatePicker /></Form.Item>
                                <Button type="primary">Book Appointment</Button>
                            </Form>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
}
