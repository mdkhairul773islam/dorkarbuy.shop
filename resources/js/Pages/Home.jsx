import { Head, Link } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function Home({ auth, featuredProducts, categories, sliders }) {
    const getCategoryIcon = (slug, name) => {
        const s = (slug || name || '').toLowerCase();
        if (s.includes('cloth') || s.includes('fashion') || s.includes('pant') || s.includes('shirt') || s.includes('wear')) return '👕';
        if (s.includes('electro') || s.includes('gadget') || s.includes('phone') || s.includes('watch') || s.includes('tech') || s.includes('computer')) return '🎧';
        if (s.includes('book') || s.includes('novel') || s.includes('read') || s.includes('publication')) return '📚';
        if (s.includes('course') || s.includes('digital') || s.includes('sub') || s.includes('learn') || s.includes('tutorial')) return '💻';
        return '🛍️';
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'clothing': return 'Clothing & Fashion';
            case 'electronics': return 'Electronics & Gadgets';
            case 'book': return 'Book';
            case 'course': return 'Course/Tutorial';
            case 'digital': return 'Digital Product';
            default: return type || 'Product';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'clothing': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'electronics': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'book': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'course': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'digital': return 'bg-rose-100 text-rose-800 border-rose-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <Layout>
            <Head title="Home" />

            {/* Hero Slider Section */}
            {sliders && sliders.length > 0 ? (
                <div className="relative w-full h-[500px] md:h-[600px] bg-[#0B1E36] overflow-hidden">
                    <Swiper
                        spaceBetween={0}
                        centeredSlides={true}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        pagination={{ clickable: true }}
                        navigation={true}
                        modules={[Autoplay, Pagination, Navigation]}
                        className="w-full h-full"
                    >
                        {sliders.map((slider) => (
                            <SwiperSlide key={slider.id} className="relative w-full h-full flex items-center">
                                {/* Background Image/Video */}
                                {slider.video ? (
                                    <video 
                                        className="absolute inset-0 w-full h-full object-cover opacity-50" 
                                        src={`/storage/${slider.video}`} 
                                        autoPlay loop muted playsInline 
                                    />
                                ) : slider.image ? (
                                    <img 
                                        src={`/storage/${slider.image}`} 
                                        alt={slider.title} 
                                        className="absolute inset-0 w-full h-full object-cover opacity-50" 
                                    />
                                ) : (
                                    <div className="absolute inset-0 w-full h-full bg-slate-900 opacity-50" />
                                )}

                                {/* Overlay Content */}
                                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col h-[80%] justify-center">
                                    <div className="sm:text-center lg:text-left pt-10 md:pt-16">
                                        {slider.title && (
                                            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl drop-shadow-lg">
                                                {slider.title}
                                            </h1>
                                        )}
                                        {slider.description && (
                                            <p className="mt-4 text-base text-gray-200 sm:mt-6 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-6 md:text-xl lg:mx-0 drop-shadow-md min-h-[3rem]">
                                                {slider.description}
                                            </p>
                                        )}
                                        {slider.button_text && (
                                            <div className="mt-10 sm:mt-12 md:mt-16 sm:flex sm:justify-center lg:justify-start">
                                                <div className="rounded-md shadow hover:shadow-lg transition-shadow">
                                                    <Link href={slider.button_link || '#'} className="w-full flex items-center justify-center px-8 py-3 lg:py-4 border border-transparent text-base font-bold rounded-md text-orange-600 bg-white hover:bg-orange-50 md:text-lg md:px-10 transition-colors">
                                                        {slider.button_text}
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            ) : (
                <div className="relative bg-[#0D233A] overflow-hidden py-16 sm:py-24 lg:py-32">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 via-transparent to-transparent z-0"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
                            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-7 lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                                    <span className="block">আপনার প্রয়োজনীয় সব</span>
                                    <span className="block text-orange-500">এক জায়গায়</span>
                                </h1>
                                <p className="mt-4 text-base text-gray-300 sm:mt-5 sm:text-xl leading-relaxed">
                                    দরকারবাই-এ রয়েছে পোশাক, গ্যাজেটস, বই এবং প্রিমিয়াম ডিজিটাল কোর্স। সেরা মানের পণ্য এবং দ্রুততম হোম ডেলিভারি সেবা।
                                </p>
                                <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                        <Link href="/products" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-lg text-white bg-orange-600 hover:bg-orange-700 shadow-lg transition-all transform hover:-translate-y-0.5">
                                            সব প্রোডাক্ট দেখুন
                                        </Link>
                                        <Link href="/products?type=clothing" className="inline-flex items-center justify-center px-6 py-3 border border-slate-600 text-base font-bold rounded-lg text-white hover:bg-slate-800 transition-colors">
                                            ফ্যাশন কালেকশন
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-12 sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-5 flex justify-center">
                                <div className="relative mx-auto w-full rounded-2xl shadow-2xl overflow-hidden border border-slate-700 bg-slate-900/60 p-5 backdrop-blur-sm">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Link href="/products?type=clothing" className="bg-slate-800/80 hover:bg-slate-700/80 p-6 rounded-xl text-center transition-all group hover:scale-[1.03]">
                                            <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">👕</span>
                                            <span className="text-white font-bold block text-sm">Clothing</span>
                                        </Link>
                                        <Link href="/products?type=electronics" className="bg-slate-800/80 hover:bg-slate-700/80 p-6 rounded-xl text-center transition-all group hover:scale-[1.03]">
                                            <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">🎧</span>
                                            <span className="text-white font-bold block text-sm">Electronics</span>
                                        </Link>
                                        <Link href="/products?type=book" className="bg-slate-800/80 hover:bg-slate-700/80 p-6 rounded-xl text-center transition-all group hover:scale-[1.03]">
                                            <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">📚</span>
                                            <span className="text-white font-bold block text-sm">Books</span>
                                        </Link>
                                        <Link href="/products?type=course" className="bg-slate-800/80 hover:bg-slate-700/80 p-6 rounded-xl text-center transition-all group hover:scale-[1.03]">
                                            <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">💻</span>
                                            <span className="text-white font-bold block text-sm">Courses</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Categories */}
            <div className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">ক্যাটাগরি সমূহ</h2>
                    <p className="text-gray-500 mb-8">ক্যাটাগরি নির্বাচন করে আপনার পছন্দের পণ্যটি সহজেই খুঁজে নিন।</p>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {categories?.map((category) => (
                            <Link
                                key={category.id}
                                href={`/products?category=${category.slug}`}
                                className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex items-center space-x-4 hover:border-orange-500 hover:shadow-md transition-all group transform hover:-translate-y-1"
                            >
                                <div className="text-4xl bg-orange-50 p-3 rounded-xl group-hover:bg-orange-100 transition-colors">
                                    {getCategoryIcon(category.slug, category.name)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-lg font-bold text-gray-950 group-hover:text-orange-600 transition-colors">{category.name}</p>
                                    <p className="text-sm text-gray-500 truncate mt-0.5">{category.description || 'পণ্য দেখতে ক্লিক করুন'}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Featured Products */}
            <div className="bg-gray-50 border-t border-gray-150">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-3xl font-extrabold text-gray-900">ফিচার্ড প্রোডাক্টস</h2>
                            <p className="text-gray-500 mt-1">আমাদের সেরা এবং টপ রেটেড পণ্যগুলোর তালিকা।</p>
                        </div>
                        <Link href="/products" className="hidden sm:inline-flex items-center text-sm font-bold text-orange-600 hover:text-orange-700">
                            সব প্রোডাক্ট দেখুন
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                        {featuredProducts?.map((product) => (
                            <div key={product.id} className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-orange-200 transition-all flex flex-col h-full">
                                <div className="w-full relative bg-gray-100 aspect-square overflow-hidden shrink-0">
                                    <Link href={`/products/${product.slug}`}>
                                        {product.image ? (
                                            <img
                                                src={`/storage/${product.image}`}
                                                alt={product.name}
                                                className="w-full h-56 object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-500">No image</span>
                                            </div>
                                        )}
                                    </Link>
                                    {/* Discount Badge */}
                                    {product.discount_price && product.show_discount_badge && (
                                        <div className="absolute top-3 right-3 z-10">
                                            <span className="bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
                                                {product.discount_type === 'flat' 
                                                    ? `৳${parseFloat(product.discount_price).toFixed(0)} OFF`
                                                    : `${Math.round(parseFloat(product.discount_price))}% OFF`
                                                }
                                            </span>
                                        </div>
                                    )}
                                    {/* Quick Buy Button Overlay */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            window.location.href = `/products/${product.slug}`;
                                        }}
                                        className="absolute bottom-3 right-3 bg-orange-600 text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-orange-700 z-10"
                                        title="View Details"
                                    >
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </button>
                                </div>
                                
                                <div className="p-5 flex flex-col flex-1">
                                    {/* Product Type Tag */}
                                    <span className={`inline-block self-start px-2 py-0.5 rounded-full text-xs font-bold border ${getTypeColor(product.type)} mb-2.5`}>
                                        {getTypeLabel(product.type)}
                                    </span>
                                    
                                    <Link href={`/products/${product.slug}`} className="flex-1">
                                        <h3 className="text-base font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                                            {product.name}
                                        </h3>
                                        {product.author && (
                                            <p className="text-xs text-gray-500 mt-1 italic">By {product.author}</p>
                                        )}
                                    </Link>

                                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-xl font-extrabold text-gray-950">
                                                ৳{product.discount_price 
                                                    ? (product.discount_type === 'flat' 
                                                        ? (parseFloat(product.price) - parseFloat(product.discount_price)).toFixed(2)
                                                        : (parseFloat(product.price) * (1 - parseFloat(product.discount_price) / 100)).toFixed(2)
                                                      )
                                                    : parseFloat(product.price).toFixed(2)
                                                }
                                            </span>
                                            {product.discount_price && (
                                                <span className="text-xs text-gray-400 line-through">
                                                    ৳{parseFloat(product.price).toFixed(2)}
                                                </span>
                                            )}
                                        </div>

                                        <Link 
                                            href={`/products/${product.slug}`}
                                            className="px-4 py-2 bg-orange-50 text-orange-700 text-xs font-bold rounded-xl hover:bg-orange-600 hover:text-white transition-colors"
                                        >
                                            অর্ডার করুন
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
