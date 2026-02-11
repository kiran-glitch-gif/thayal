import { useState, useEffect } from 'react';
import { Row, Col, Card, Checkbox, Slider, Select, Button, Modal, Tag, Typography, Rate, Collapse } from 'antd';
import { FilterOutlined, ShoppingCartOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { API_URL } from '../config';

const { Title, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

// Fabrics and Necklines (Static for now)
const fabrics = [
    { id: 'silk', name: 'Raw Silk', color: '#E6E6FA' },
    { id: 'cotton', name: 'Pure Cotton', color: '#F5F5DC' },
    { id: 'georgette', name: 'Georgette', color: '#FFE4E1' },
    { id: 'velvet', name: 'Velvet', color: '#8B0000' }
];

const necklines = ['Round', 'V-Neck', 'Boat Neck', 'Collar', 'Sweetheart'];

export default function Services() {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [priceRange, setPriceRange] = useState([500, 15000]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { addToCart } = useStore();

    // Modal State
    const [customization, setCustomization] = useState({
        fabric: 'silk',
        embroidery: false,
        neckline: 'Round'
    });

    useEffect(() => {
        fetch(`${API_URL}/api/products`)
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error('Error fetching products:', err));
    }, []);

    const filteredProducts = products.length > 0 ? products.filter(p => {
        const catMatch = selectedCategory.length === 0 || selectedCategory.includes(p.category);
        const priceMatch = p.price >= priceRange[0] && p.price <= priceRange[1];
        return catMatch && priceMatch;
    }) : [];

    // ... (Use previous productsData as fallback if needed, but we rely on API now)

    // ... rest of logic

    const handleAddToCart = () => {
        const finalPrice = selectedProduct.price + (customization.embroidery ? 1000 : 0);
        addToCart({
            ...selectedProduct,
            customization,
            finalPrice,
            id: Date.now() // Simple unique id
        });
        setSelectedProduct(null);
        Modal.success({ content: 'Added to cart successfully!' });
    };

    return (
        <div className="bg-light min-h-screen pb-12">
            {/* Header */}
            <div className="bg-white shadow-sm py-8 mb-8">
                <div className="section-container py-0">
                    <Title level={2}>Services & Designs</Title>
                    <Text className="text-gray-500">Choose a design or upload your own to get started.</Text>
                </div>
            </div>

            <div className="section-container py-0">
                <Row gutter={32}>
                    {/* Filters Sidebar */}
                    <Col xs={24} md={6} className="mb-8 hidden md:block">
                        <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
                            <div className="flex items-center gap-2 mb-6">
                                <FilterOutlined /> <span className="font-bold text-lg">Filters</span>
                            </div>

                            <div className="mb-6">
                                <h4 className="font-semibold mb-3">Category</h4>
                                <Checkbox.Group
                                    options={['Women', 'Men', 'Kids']}
                                    className="flex flex-col gap-2"
                                    onChange={setSelectedCategory}
                                />
                            </div>

                            <div className="mb-6">
                                <h4 className="font-semibold mb-3">Price Range</h4>
                                <Slider
                                    range
                                    min={500}
                                    max={20000}
                                    defaultValue={[500, 15000]}
                                    onChange={setPriceRange}
                                    step={100}
                                />
                                <div className="flex justify-between text-sm text-gray-500 mt-2">
                                    <span>₹{priceRange[0]}</span>
                                    <span>₹{priceRange[1]}</span>
                                </div>
                            </div>

                            <Button block onClick={() => { setSelectedCategory([]); setPriceRange([500, 15000]); }}>
                                Reset Filters
                            </Button>
                        </div>
                    </Col>

                    {/* Product Grid */}
                    <Col xs={24} md={18}>
                        <div className="flex justify-between items-center mb-6">
                            <Text strong>{filteredProducts.length} Results Found</Text>
                            <Select defaultValue="popular" style={{ width: 150 }}>
                                <Option value="popular">Most Popular</Option>
                                <Option value="lowToHigh">Price: Low to High</Option>
                                <Option value="highToLow">Price: High to Low</Option>
                            </Select>
                        </div>

                        <Row gutter={[24, 24]}>
                            {filteredProducts.map(product => (
                                <Col xs={24} sm={12} lg={8} key={product.id}>
                                    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <Card
                                            hoverable
                                            className="overflow-hidden border-none shadow-md group h-full flex flex-col"
                                            cover={
                                                <div className="relative overflow-hidden h-64">
                                                    <img alt={product.name} src={product.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                </div>
                                            }
                                            bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                                        >
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <Tag color="gold">{product.category}</Tag>
                                                    <span className="flex items-center text-xs gap-1"><Rate disabled defaultValue={1} count={1} className="text-sm" /> {product.rating}</span>
                                                </div>
                                                <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                                                <Title level={4} className="text-primary m-0">₹{product.price}</Title>
                                            </div>
                                            <Button type="primary" block className="mt-4 bg-dark" onClick={() => setSelectedProduct(product)}>
                                                Stitch Now
                                            </Button>
                                        </Card>
                                    </motion.div>
                                </Col>
                            ))}
                        </Row>
                        {filteredProducts.length === 0 && (
                            <div className="text-center py-12 text-gray-400">
                                <p>No products found. Attempting to fetch from new backend...</p>
                            </div>
                        )}
                    </Col>
                </Row>
            </div>

            {/* Detail Modal */}
            {selectedProduct && (
                <Modal
                    open={!!selectedProduct}
                    onCancel={() => setSelectedProduct(null)}
                    footer={null}
                    width={800}
                    centered
                    className="rounded-xl overflow-hidden"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                        <div className="h-full">
                            <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-[400px] object-cover rounded-lg" />
                        </div>

                        <div className="flex flex-col h-full">
                            <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
                            <div className="text-3xl text-primary font-bold mb-6">
                                ₹{selectedProduct.price + (customization.embroidery ? 1000 : 0)}
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                                <div>
                                    <h4 className="font-semibold mb-2 flex items-center gap-2"><EnvironmentOutlined className="text-primary" /> Service Location</h4>
                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-4">
                                        <Text strong className="block text-sm">Primary Workshop: Salem Center</Text>
                                        <Text type="secondary" className="text-xs">123 Textile Road, Kangayam, Tamil Nadu</Text>
                                    </div>
                                    <Select
                                        className="w-full mb-2"
                                        defaultValue="workshop"
                                        options={[
                                            { value: 'workshop', label: 'Salem Workshop (Default)' },
                                            { value: 'express', label: 'Erode Express Center' },
                                            { value: 'remote', label: 'Partner Workshop (Coimbatore)' }
                                        ]}
                                    />
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2">Fabric Source</h4>
                                    <Select
                                        className="w-full mb-2"
                                        defaultValue="buy"
                                        options={[
                                            { value: 'buy', label: 'Buy from Thayal360 Store (Premium Quality)' },
                                            { value: 'pickup', label: 'I have my own fabric (Pickup from my home)' }
                                        ]}
                                    />
                                    <div className="flex gap-3 mb-2">
                                        {fabrics.map(f => (
                                            <div
                                                key={f.id}
                                                onClick={() => setCustomization({ ...customization, fabric: f.id })}
                                                className={`cursor-pointer border-2 rounded-full p-1 transition-all ${customization.fabric === f.id ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'}`}
                                            >
                                                <div className="w-8 h-8 rounded-full border border-gray-200" style={{ backgroundColor: f.color }} title={f.name}></div>
                                            </div>
                                        ))}
                                    </div>
                                    <Text type="secondary" className="text-xs mt-1 block italic">Selected Material: {fabrics.find(f => f.id === customization.fabric)?.name}</Text>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold mb-2">Measurement</h4>
                                        <Select
                                            className="w-full"
                                            defaultValue="ai"
                                            options={[
                                                { value: 'ai', label: 'AI Scanner' },
                                                { value: 'visit', label: 'Home Visit' },
                                                { value: 'sample', label: 'Use Sample' }
                                            ]}
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">Neckline</h4>
                                        <Select
                                            className="w-full"
                                            value={customization.neckline}
                                            onChange={(val) => setCustomization({ ...customization, neckline: val })}
                                        >
                                            {necklines.map(n => <Option key={n} value={n}>{n}</Option>)}
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2">Premium Add-ons</h4>
                                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                                        <Checkbox
                                            checked={customization.embroidery}
                                            onChange={(e) => setCustomization({ ...customization, embroidery: e.target.checked })}
                                            className="font-medium"
                                        >
                                            Intricate Hand Embroidery (+₹1000)
                                        </Checkbox>
                                        <p className="text-xs text-gray-500 mt-2 ml-6">Adds 2-3 days to delivery time for artisanal quality.</p>
                                    </div>
                                </div>

                                <Collapse ghost className="care-collapse">
                                    <Panel header={<Text strong className="text-xs uppercase tracking-wider text-gray-400">View Care Instructions</Text>} key="1">
                                        <div className="bg-amber-50 p-3 rounded text-amber-800 text-sm">
                                            Hand wash recommended. Use mild detergent. Do not dry in direct sunlight to maintain color vibrancy.
                                        </div>
                                    </Panel>
                                </Collapse>
                            </div>

                            <div className="mt-8 pt-4 border-t">
                                <Button type="primary" size="large" block className="bg-primary h-12" onClick={handleAddToCart} icon={<ShoppingCartOutlined />}>
                                    Add to Cart — ₹{selectedProduct.price + (customization.embroidery ? 1000 : 0)}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
