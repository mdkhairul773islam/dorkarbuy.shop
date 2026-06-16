import { Head, Link, router } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import ProductCard from '../Components/ProductCard';
import { useState, useEffect } from 'react';

export default function Products({ auth, products, categories, filters, fbEventId, fbEventType }) {
    const [selectedCategory, setSelectedCategory] = useState(filters?.category || '');
    const [selectedType, setSelectedType] = useState(filters?.type || '');
    const [search, setSearch] = useState(filters?.search || '');

    useEffect(() => {
        if (typeof fbq !== 'undefined' && fbEventId && fbEventType) {
            if (fbEventType === 'Search') {
                fbq('track', 'Search', {
                    search_string: filters?.search,
                    content_type: 'product',
                }, { eventID: fbEventId });
            } else if (fbEventType === 'ViewCategory') {
                fbq('trackCustom', 'ViewCategory', {
                    content_category: filters?.category,
                    content_type: 'product',
                }, { eventID: fbEventId });
            }
        }
    }, [fbEventId]);

    const applyFilters = (category, type, searchVal) => {
        const params = new URLSearchParams();
        if (category) params.set('category', category);
        if (type) params.set('type', type);
        if (searchVal) params.set('search', searchVal);
        window.location.href = `/products?${params.toString()}`;
    };

    return (
        <Layout>
            <Head title="Products" />

            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-950">সব প্রোডাক্টস</h1>
                            <p className="text-gray-500 mt-1">আমাদের কালেকশন থেকে আপনার প্রয়োজনীয় পণ্যটি বেছে নিন।</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="category" className="block text-sm font-bold text-gray-800 mb-2">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    value={selectedCategory}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setSelectedCategory(value);
                                        applyFilters(value, selectedType, search);
                                    }}
                                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm font-medium"
                                >
                                    <option value="">All Categories</option>
                                    {categories?.map((category) => (
                                        <option key={category.id} value={category.slug}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="type" className="block text-sm font-bold text-gray-800 mb-2">
                                    Product Type
                                </label>
                                <select
                                    id="type"
                                    value={selectedType}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setSelectedType(value);
                                        applyFilters(selectedCategory, value, search);
                                    }}
                                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm font-medium"
                                >
                                    <option value="">All Types</option>
                                    <option value="clothing">Clothing & Fashion</option>
                                    <option value="electronics">Electronics & Gadgets</option>
                                    <option value="book">Books</option>
                                    <option value="course">Courses & Tutorials</option>
                                    <option value="digital">Digital Subscriptions</option>
                                </select>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="mt-4">
                            <label htmlFor="search" className="block text-sm font-bold text-gray-800 mb-2">
                                Search Products
                            </label>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    applyFilters(selectedCategory, selectedType, search);
                                }}
                                className="flex gap-3"
                            >
                                <input
                                    id="search"
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="কী খুঁজছেন? এখানে সার্চ করুন..."
                                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm"
                                />
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors whitespace-nowrap text-sm shadow-sm"
                                >
                                    খুঁজুন
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {products?.data?.length === 0 ? (
                        <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl">
                            <p className="text-gray-500 text-lg">দুঃখিত, কোনো প্রোডাক্ট পাওয়া যায়নি।</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                                {products?.data?.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {products?.links && products.links.length > 3 && (
                                <div className="mt-12 flex justify-center">
                                    <nav className="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px border border-gray-250 overflow-hidden">
                                        {products.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                preserveScroll
                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-bold ${
                                                    link.active
                                                        ? 'z-10 bg-orange-600 text-white'
                                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                                } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
}
