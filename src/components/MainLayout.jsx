import { useState } from 'react';
import { Layout, Menu, Button, Drawer, Badge, Avatar, Dropdown, Modal, Form, Input, message } from 'antd';
import { MenuOutlined, ShoppingCartOutlined, UserOutlined, SearchOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';

const { Header, Content, Footer } = Layout;

export default function MainLayout() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, login, logout, cart } = useStore();

    const handleLogin = async (values) => {
        // Login is now handled entirely in the store (including mock check)
        const success = await login(values.email, values.password);
        if (success) {
            message.success('Welcome back, Priya!');
            setLoginModalOpen(false);
        } else {
            message.error('Invalid credentials');
        }
    };

    const userMenu = {
        items: [
            { key: 'dashboard', label: <Link to="/dashboard">Dashboard</Link> },
            { key: 'logout', label: 'Logout', icon: <LogoutOutlined />, onClick: logout },
        ]
    };

    const menuItems = [
        { key: '/', label: <Link to="/">Home</Link> },
        { key: '/services', label: <Link to="/services">Services</Link> },
        { key: '/dashboard', label: <Link to="/dashboard">Dashboard</Link> },
        { key: '/contact', label: <Link to="/contact">Contact</Link> },
    ];

    return (
        <Layout className="min-h-screen bg-white">
            <Header className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8 bg-white/95 backdrop-blur shadow-sm h-20">
                {/* Logo */}
                <div className="flex-shrink-0 cursor-pointer flex items-center gap-1 sm:gap-2" onClick={() => navigate('/')}>
                    <img src="/logo.png" alt="Thayal360" className="h-12 md:h-14 w-auto object-contain" />
                    <span className="text-xl md:text-2xl font-bold text-gray-900 tracking-wide font-serif">Thayal 360</span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex flex-1 justify-center items-center">
                    <Menu
                        mode="horizontal"
                        selectedKeys={[location.pathname]}
                        items={menuItems}
                        className="border-none bg-transparent min-w-[400px] justify-center text-base font-medium"
                    />
                </div>

                {/* Right Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <div className="hidden lg:flex items-center">
                        <Input.Search
                            placeholder="Search..."
                            allowClear
                            className="w-48"
                            style={{ height: '40px' }}
                        />
                    </div>

                    <Badge count={cart.length} showZero offset={[-5, 5]}>
                        <Button
                            type="text"
                            icon={<ShoppingCartOutlined style={{ fontSize: '20px' }} />}
                            className="flex items-center justify-center h-10 w-10"
                            onClick={() => navigate('/checkout')}
                        />
                    </Badge>

                    {user ? (
                        <Dropdown menu={userMenu}>
                            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-full transition">
                                <Avatar icon={<UserOutlined />} src="https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" />
                                <span className="font-medium text-gray-700">{user.name}</span>
                            </div>
                        </Dropdown>
                    ) : (
                        <Button
                            aria-label="login-trigger"
                            type="primary"
                            onClick={() => setLoginModalOpen(true)}
                            className="bg-primary hover:bg-red-700 h-10 px-6 flex items-center justify-center"
                        >
                            Login
                        </Button>
                    )}
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden flex items-center gap-3">
                    <Badge count={cart.length} size="small" offset={[-3, 3]}>
                        <Button
                            type="text"
                            icon={<ShoppingCartOutlined style={{ fontSize: '20px' }} />}
                            className="flex items-center justify-center"
                            onClick={() => navigate('/checkout')}
                        />
                    </Badge>
                    <Button
                        type="text"
                        icon={<MenuOutlined style={{ fontSize: '20px' }} />}
                        onClick={() => setMobileMenuOpen(true)}
                        className="flex items-center justify-center"
                    />
                </div>
            </Header>

            <Content className="pt-0">
                <Outlet />
            </Content>

            <Footer className="bg-dark text-white/80 text-center py-12">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
                    <div>
                        <img src="/logo.png" alt="Thayal360" className="h-24 mb-4 object-contain" />
                        <p>Custom stitching at your doorstep. Professional tailoring made easy.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link to="/services" className="hover:text-accent">Services</Link></li>
                            <li><Link to="/track/1" className="hover:text-accent">Track Order</Link></li>
                            <li><Link to="/contact" className="hover:text-accent">Support</Link></li>
                            <li><Link to="/admin" className="text-gray-500 hover:text-white text-xs">Admin Portal</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact</h4>
                        <p>support@thayal360.com</p>
                        <p>+91 63816 06246</p>
                        <p>Salem, Tamil Nadu</p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Newsletter</h4>
                        <div className="flex gap-2">
                            <Input placeholder="Email" className="rounded-md" />
                            <Button type="primary" className="bg-accent text-black border-none hover:bg-yellow-400">Join</Button>
                        </div>
                    </div>
                </div>
                <div className="border-t border-white/10 pt-8">
                    © 2024 Thayal360. All rights reserved.
                </div>
            </Footer>

            {/* Mobile Drawer */}
            <Drawer
                title={
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
                        <span className="font-serif text-lg">Thayal 360</span>
                    </div>
                }
                placement="right"
                onClose={() => setMobileMenuOpen(false)}
                open={mobileMenuOpen}
            >
                <Menu
                    mode="vertical"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={() => setMobileMenuOpen(false)}
                    className="border-none"
                />
                <div className="mt-8 px-4">
                    {!user ? (
                        <Button type="primary" block onClick={() => { setMobileMenuOpen(false); setLoginModalOpen(true); }}>Login</Button>
                    ) : (
                        <Button danger block onClick={() => { logout(); setMobileMenuOpen(false); }}>Logout ({user.name})</Button>
                    )}
                </div>
            </Drawer>

            {/* Login Modal */}
            <Modal
                title="Welcome to Thayal360"
                open={loginModalOpen}
                onCancel={() => setLoginModalOpen(false)}
                footer={null}
                destroyOnClose
            >
                <Form onFinish={handleLogin} layout="vertical" initialValues={{ email: 'priya@example.com', password: '123456' }}>
                    <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block className="h-10 text-lg bg-primary">
                            Login
                        </Button>
                    </Form.Item>

                    <div className="flex items-center gap-4 my-4">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="text-gray-400 text-sm">Or</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    <Button
                        block
                        className="h-10 text-lg flex items-center justify-center gap-2 hover:bg-gray-50 mb-4"
                        onClick={() => {
                            message.loading('Connecting to Google...', 1).then(() => {
                                handleLogin({ email: 'priya@example.com', password: 'mock-google-token' });
                            });
                        }}
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                        Sign in with Google
                    </Button>

                    <div className="text-center text-gray-500 text-sm">
                        Use priya@example.com / 123456
                    </div>
                </Form>
            </Modal>
        </Layout>
    );
}
