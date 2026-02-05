import { useState } from 'react';
import { Card, Button, List, Empty, Modal, Form, Input, DatePicker, message, Tag, Divider } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

export default function Checkout() {
    const { cart, removeFromCart, clearCart, user, placeOrder } = useStore();
    const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const totalAmount = cart.reduce((sum, item) => sum + (item.finalPrice || item.price), 0);

    const handleCheckout = async (values) => {
        if (!user) {
            message.error('Please login first');
            return;
        }

        setLoading(true);

        try {
            // Place each cart item as a separate order
            const orderPromises = cart.map(item => {
                const orderData = {
                    id: `ORD${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    user_email: user.email,
                    item_name: item.name,
                    status: 'Pending',
                    tailor: 'Auto-assigned',
                    delivery_date: values.deliveryDate.format('YYYY-MM-DD'),
                    price: item.finalPrice || item.price
                };

                return placeOrder(orderData);
            });

            const results = await Promise.all(orderPromises);

            const allSuccess = results.every(r => r.success);

            if (allSuccess) {
                Modal.success({
                    title: 'Order Placed Successfully!',
                    content: (
                        <div>
                            <p>Your {cart.length} item(s) have been ordered.</p>
                            <p>Total Amount: ₹{totalAmount}</p>
                            <p>Expected Delivery: {values.deliveryDate.format('DD MMM YYYY')}</p>
                        </div>
                    ),
                    onOk: () => {
                        clearCart();
                        setCheckoutModalOpen(false);
                        navigate('/dashboard');
                    }
                });
            } else {
                throw new Error('Some orders failed');
            }
        } catch (error) {
            message.error('Failed to place order. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="section-container">
                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

                {cart.length === 0 ? (
                    <Card>
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="Your cart is empty"
                        >
                            <Button type="primary" onClick={() => navigate('/services')}>
                                Browse Services
                            </Button>
                        </Empty>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <Card title={`Cart Items (${cart.length})`}>
                                <List
                                    dataSource={cart}
                                    renderItem={(item) => (
                                        <List.Item
                                            actions={[
                                                <Button
                                                    danger
                                                    type="text"
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => removeFromCart(item.id)}
                                                >
                                                    Remove
                                                </Button>
                                            ]}
                                        >
                                            <List.Item.Meta
                                                avatar={<img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />}
                                                title={<span className="font-semibold">{item.name}</span>}
                                                description={
                                                    <div className="space-y-1">
                                                        <div><Tag color="blue">{item.category}</Tag></div>
                                                        {item.customization && (
                                                            <div className="text-xs text-gray-500">
                                                                <div>Fabric: {item.customization.fabric}</div>
                                                                <div>Neckline: {item.customization.neckline}</div>
                                                                {item.customization.embroidery && <div>+ Hand Embroidery</div>}
                                                            </div>
                                                        )}
                                                    </div>
                                                }
                                            />
                                            <div className="text-lg font-bold text-primary">
                                                ₹{item.finalPrice || item.price}
                                            </div>
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </div>

                        {/* Order Summary */}
                        <div>
                            <Card title="Order Summary" className="sticky top-24">
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span>Subtotal ({cart.length} items)</span>
                                        <span className="font-semibold">₹{totalAmount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Delivery Charges</span>
                                        <span className="text-green-600 font-semibold">FREE</span>
                                    </div>
                                    <Divider className="my-2" />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total Amount</span>
                                        <span className="text-primary">₹{totalAmount}</span>
                                    </div>

                                    <Button
                                        type="primary"
                                        size="large"
                                        block
                                        icon={<CheckCircleOutlined />}
                                        onClick={() => setCheckoutModalOpen(true)}
                                        disabled={!user}
                                        className="bg-primary h-12 mt-4"
                                    >
                                        {user ? 'Proceed to Checkout' : 'Login to Checkout'}
                                    </Button>

                                    <Button
                                        block
                                        onClick={() => navigate('/services')}
                                    >
                                        Continue Shopping
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Checkout Modal */}
                <Modal
                    title="Complete Your Order"
                    open={checkoutModalOpen}
                    onCancel={() => setCheckoutModalOpen(false)}
                    footer={null}
                    width={600}
                >
                    <Form
                        layout="vertical"
                        onFinish={handleCheckout}
                        initialValues={{
                            deliveryDate: dayjs().add(7, 'days'),
                            address: ''
                        }}
                    >
                        <Form.Item
                            label="Delivery Address"
                            name="address"
                            rules={[{ required: true, message: 'Please enter delivery address' }]}
                        >
                            <Input.TextArea rows={3} placeholder="Enter your complete address" />
                        </Form.Item>

                        <Form.Item
                            label="Expected Delivery Date"
                            name="deliveryDate"
                            rules={[{ required: true, message: 'Please select delivery date' }]}
                        >
                            <DatePicker
                                className="w-full"
                                disabledDate={(current) => current && current < dayjs().add(5, 'days')}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Contact Number"
                            name="phone"
                            rules={[{ required: true, message: 'Please enter contact number' }]}
                        >
                            <Input placeholder="+91 XXXXX XXXXX" />
                        </Form.Item>

                        <div className="bg-gray-50 p-4 rounded mb-4">
                            <div className="flex justify-between mb-2">
                                <span>Total Items:</span>
                                <span className="font-semibold">{cart.length}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold">
                                <span>Amount to Pay:</span>
                                <span className="text-primary">₹{totalAmount}</span>
                            </div>
                        </div>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                size="large"
                                loading={loading}
                                icon={<ShoppingCartOutlined />}
                                className="bg-primary h-12"
                            >
                                Place Order
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
}
