import { Carousel, Button, Card, Statistic, Row, Col, Typography, Steps, theme } from 'antd';
import { ArrowRightOutlined, ScissorOutlined, SkinOutlined, CarOutlined, SmileOutlined, RocketOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const heroSlides = [
    {
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop',
        title: 'Your Personal Fashion Designer',
        sub: 'Custom-made outfits, delivered to your doorstep. Experience the future of tailoring.'
    },
    {
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2070&auto=format&fit=crop',
        title: 'Any Style, Any Design',
        sub: 'From Lehengas to Blazers, we stitch perfection for every occasion.'
    },
    {
        image: 'https://images.unsplash.com/photo-1616616086701-4475510667b3?q=80&w=2070&auto=format&fit=crop',
        title: 'Hassle-Free Measurements',
        sub: 'Book a home visit or measure yourself with our AI tool.'
    }
];

const features = [
    { icon: <SkinOutlined />, title: 'Doorstep Measurements', desc: 'Expert tailors visit you for precision.' },
    { icon: <CarOutlined />, title: 'Fabric Pickup', desc: 'We pick up your fabric from home.' },
    { icon: <RocketOutlined />, title: 'Express Delivery', desc: 'Get your outfit in as less as 24 hours.' },
];

const categories = [
    { name: 'Blouse', img: 'https://images.unsplash.com/photo-1596462502278-27bfdd403cc2?w=500' }, // New Saree Blouse image
    { name: 'Kurta', img: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500' }, // Reusing working Salwar image which looks like Kurta
    { name: 'Lehenga', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500' },
    { name: 'Gown', img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500' },
    { name: 'Salwar', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500' }, // New Salwar image
    { name: 'Western', img: 'https://images.unsplash.com/photo-1634543787768-45c110900eMc?w=500' }, // New Western Dress image
];

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="bg-white min-h-screen pb-12">

            {/* Hero Section */}
            <Carousel autoplay effect="fade" className="h-[70vh] md:h-[80vh]">
                {heroSlides.map((slide, i) => (
                    <div key={i} className="relative h-[70vh] md:h-[80vh]">
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10" />
                        <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 z-20 flex flex-col justify-center items-start text-left text-white px-8 md:px-24 max-w-4xl">
                            <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                                <Title level={1} style={{ color: 'white' }} className="text-4xl md:text-7xl font-bold mb-6 drop-shadow-lg leading-tight">
                                    {slide.title}
                                </Title>
                            </motion.div>
                            <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                                <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl font-light">{slide.sub}</p>
                                <div className="flex gap-4">
                                    <Button
                                        type="primary"
                                        size="large"
                                        className="bg-accent hover:bg-yellow-500 text-black border-none h-14 px-10 text-xl rounded-lg font-semibold"
                                        onClick={() => navigate('/services')}
                                    >
                                        Design Now
                                    </Button>
                                    <Button
                                        size="large"
                                        ghost
                                        className="text-white border-white hover:text-accent hover:border-accent h-14 px-10 text-xl rounded-lg"
                                        onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                                    >
                                        How it Works
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                ))}
            </Carousel>

            {/* Trust Features Strip */}
            <div className="bg-light py-12 section-container -mt-8 relative z-30 rounded-xl shadow-lg">
                <Row gutter={[24, 24]} justify="center">
                    {features.map((f, i) => (
                        <Col xs={12} md={6} key={i} className="text-center">
                            <div className="text-4xl text-primary mb-3">{f.icon}</div>
                            <h3 className="font-bold text-lg mb-1">{f.title}</h3>
                            <p className="text-gray-500 text-sm px-4">{f.desc}</p>
                        </Col>
                    ))}
                </Row>
            </div>

            {/* Must Have Categories */}
            <div className="section-container pt-16">
                <div className="text-center mb-12">
                    <Title level={2} className="uppercase tracking-wide">Must Have Categories</Title>
                    <div className="w-24 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
                </div>

                <Row gutter={[24, 24]}>
                    {[
                        { name: 'BLOUSE', img: 'https://images.unsplash.com/photo-1596462502278-27bfdd403cc2?w=600&h=800&fit=crop' },
                        { name: 'KURTI', img: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop' },
                        { name: 'SALWAR KAMEEZ', img: 'https://images.unsplash.com/photo-1585850407137-b64eb119567c?w=600&h=800&fit=crop' },
                        { name: 'LEHENGA', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop' },
                        { name: 'DRESS', img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=800&fit=crop' },
                        { name: 'READY TO WEAR SAREE', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop' },
                    ].map((cat, i) => (
                        <Col xs={12} sm={8} md={4} key={i}>
                            <motion.div
                                whileHover={{ y: -10 }}
                                className="cursor-pointer group"
                                onClick={() => navigate('/services')}
                            >
                                <div className="rounded-xl overflow-hidden shadow-md mb-4 h-[350px] relative">
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition z-10" />
                                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                </div>
                                <h3 className="text-center font-bold text-lg tracking-wider text-gray-800 group-hover:text-primary transition">{cat.name}</h3>
                            </motion.div>
                        </Col>
                    ))}
                </Row>
            </div>

            {/* Seamless Workflow */}
            <div id="how-it-works" className="bg-[#FAF8F5] py-20 mt-20">
                <div className="section-container">
                    <Row gutter={48} align="middle">
                        <Col xs={24} md={12}>
                            <Title level={2}>How Thayal360 Works</Title>
                            <Text className="text-lg text-gray-500 block mb-8">A simplified experience from design to delivery.</Text>

                            <Steps
                                direction="vertical"
                                current={1}
                                size="small"
                                items={[
                                    { title: <span className="font-bold text-lg">Choose Your Style</span>, description: 'Select from our designs or upload your own sketch.' },
                                    { title: <span className="font-bold text-lg">Get Measured</span>, description: 'Book a home visit or use our AI measurement tool.' },
                                    { title: <span className="font-bold text-lg">Pick Your Fabric</span>, description: 'We pickup your fabric or you can buy from us.' },
                                    { title: <span className="font-bold text-lg">Stitching & Delivery</span>, description: 'Track live progress and get doorstep delivery.' },
                                ]}
                            />

                            <Button type="primary" size="large" className="mt-8 bg-dark h-12 px-8" onClick={() => navigate('/services')}>
                                Start Your Order
                            </Button>
                        </Col>
                        <Col xs={24} md={12} className="hidden md:block">
                            <div className="grid grid-cols-2 gap-4">
                                <img src="https://images.unsplash.com/photo-1590736969955-71cc94801759?w=600" className="rounded-lg shadow-lg mt-12" />
                                <img src="https://images.unsplash.com/photo-1528642765578-1f5064af5add?w=600" className="rounded-lg shadow-lg" />
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* CTA */}
            <div className="section-container text-center py-20 pb-24">
                <div className="bg-primary rounded-3xl p-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <div className="relative z-10">
                        <Title level={2} style={{ color: 'white' }} className="mb-4">Ready to Stitch?</Title>
                        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">Join the revolution of digital tailoring. Perfect fit guaranteed.</p>
                        <Button size="large" className="bg-white text-primary border-none h-14 px-12 text-lg font-bold rounded-full hover:bg-gray-100" onClick={() => navigate('/services')}>
                            Book Appointment
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
