import { Head, Link } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import ProductCard from '../Components/ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useTranslation } from '../hooks/useTranslation';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function Home({ auth, featuredProducts, categories, sliders }) {
    const { __ } = useTranslation();
    const getCategoryIcon = (slug, name) => {
        const s = (slug || name || '').toLowerCase();
        if (s.includes('cloth') || s.includes('fashion') || s.includes('pant') || s.includes('shirt') || s.includes('wear')) return '👕';
        if (s.includes('electro') || s.includes('gadget') || s.includes('phone') || s.includes('watch') || s.includes('tech') || s.includes('computer')) return '🎧';
        if (s.includes('book') || s.includes('novel') || s.includes('read') || s.includes('publication')) return '📚';
        if (s.includes('course') || s.includes('digital') || s.includes('sub') || s.includes('learn') || s.includes('tutorial')) return '💻';
        return '🛍️';
    };

    return (
        <Layout>
            <Head title={__('Home')} />

            {/* Hero Slider Section */}
            {sliders && sliders.length > 0 ? (
                <div className="relative w-full bg-[#0B1E36] overflow-hidden">
                    <Swiper
                        spaceBetween={0}
                        centeredSlides={true}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        pagination={{ clickable: true }}
                        navigation={true}
                        modules={[Autoplay, Pagination, Navigation]}
                        className="w-full"
                    >
                        {sliders.map((slider) => {
                            const hasOverlay = slider.title || slider.description || slider.button_text;
                            return (
                                <SwiperSlide key={slider.id} className="relative w-full">
                                    {hasOverlay ? (
                                        <div className="relative w-full h-[350px] sm:h-[450px] md:h-[550px] lg:h-[600px] flex items-center">
                                            {/* Background Image/Video */}
                                            {slider.video ? (
                                                <video 
                                                    className="absolute inset-0 w-full h-full object-cover opacity-60" 
                                                    src={`/storage/${slider.video}`} 
                                                    autoPlay loop muted playsInline 
                                                />
                                            ) : slider.image ? (
                                                <img 
                                                    src={`/storage/${slider.image}`} 
                                                    alt={slider.title} 
                                                    className="absolute inset-0 w-full h-full object-cover opacity-60" 
                                                />
                                            ) : (
                                                <div className="absolute inset-0 w-full h-full bg-slate-900 opacity-60" />
                                            )}

                                            {/* Overlay Content */}
                                            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col h-[80%] justify-center">
                                                <div className="sm:text-center lg:text-left pt-10 md:pt-16">
                                                    {slider.title && (
                                                        <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl drop-shadow-lg">
                                                            {__(slider.title)}
                                                        </h1>
                                                    )}
                                                    {slider.description && (
                                                        <p className="mt-4 text-base text-gray-200 sm:mt-6 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-6 md:text-xl lg:mx-0 drop-shadow-md min-h-[3rem]">
                                                            {__(slider.description)}
                                                        </p>
                                                    )}
                                                    {slider.button_text && (
                                                        <div className="mt-10 sm:mt-12 md:mt-16 sm:flex sm:justify-center lg:justify-start">
                                                            <div className="rounded-md shadow hover:shadow-lg transition-shadow">
                                                                <Link href={slider.button_link || '#'} className="w-full flex items-center justify-center px-8 py-3 lg:py-4 border border-transparent text-base font-bold rounded-md text-orange-600 bg-white hover:bg-orange-50 md:text-lg md:px-10 transition-colors">
                                                                    {__(slider.button_text)}
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        // Slider without text overlay (Full-width pre-designed banner image)
                                        <div className="w-full relative bg-slate-900">
                                            {slider.button_link ? (
                                                <Link 
                                                    href={slider.button_link.startsWith('http') ? slider.button_link : (slider.button_link.startsWith('/') ? slider.button_link : `/products/${slider.button_link}`)} 
                                                    className="block w-full"
                                                >
                                                    {slider.video ? (
                                                        <video 
                                                            className="w-full h-auto block" 
                                                            src={`/storage/${slider.video}`} 
                                                            autoPlay loop muted playsInline 
                                                        />
                                                    ) : slider.image ? (
                                                        <img 
                                                            src={`/storage/${slider.image}`} 
                                                            alt="Slider Banner" 
                                                            className="w-full h-auto block"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-[220px] sm:h-[400px] bg-slate-900" />
                                                    )}
                                                </Link>
                                            ) : (
                                                slider.video ? (
                                                    <video 
                                                        className="w-full h-auto block" 
                                                        src={`/storage/${slider.video}`} 
                                                        autoPlay loop muted playsInline 
                                                    />
                                                ) : slider.image ? (
                                                    <img 
                                                        src={`/storage/${slider.image}`} 
                                                        alt="Slider Banner" 
                                                        className="w-full h-auto block"
                                                    />
                                                ) : (
                                                    <div className="w-full h-[220px] sm:h-[400px] bg-slate-900" />
                                                )
                                            )}
                                        </div>
                                    )}
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            ) : (
                <div className="relative bg-[#0D233A] overflow-hidden py-16 sm:py-24 lg:py-32">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 via-transparent to-transparent z-0"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
                            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-7 lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                                    <span className="block">{__('Your needs all')}</span>
                                    <span className="block text-orange-500">{__('In one place')}</span>
                                </h1>
                                <p className="mt-4 text-base text-gray-300 sm:mt-5 sm:text-xl leading-relaxed">
                                    {__('Hero fallback desc')}
                                </p>
                                <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                        <Link href="/products" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-lg text-white bg-orange-600 hover:bg-orange-700 shadow-lg transition-all transform hover:-translate-y-0.5">
                                            {__('See All Products')}
                                        </Link>
                                        <Link href="/products?type=clothing" className="inline-flex items-center justify-center px-6 py-3 border border-slate-600 text-base font-bold rounded-lg text-white hover:bg-slate-800 transition-colors">
                                            {__('Fashion Collection')}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-12 sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-5 flex justify-center">
                                <div className="relative mx-auto w-full rounded-2xl shadow-2xl overflow-hidden border border-slate-700 bg-slate-900/60 p-5 backdrop-blur-sm">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Link href="/products?type=clothing" className="bg-slate-800/80 hover:bg-slate-700/80 p-6 rounded-xl text-center transition-all group hover:scale-[1.03]">
                                            <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">👕</span>
                                            <span className="text-white font-bold block text-sm">{__('Clothing')}</span>
                                        </Link>
                                        <Link href="/products?type=electronics" className="bg-slate-800/80 hover:bg-slate-700/80 p-6 rounded-xl text-center transition-all group hover:scale-[1.03]">
                                            <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">🎧</span>
                                            <span className="text-white font-bold block text-sm">{__('Electronics')}</span>
                                        </Link>
                                        <Link href="/products?type=book" className="bg-slate-800/80 hover:bg-slate-700/80 p-6 rounded-xl text-center transition-all group hover:scale-[1.03]">
                                            <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">📚</span>
                                            <span className="text-white font-bold block text-sm">{__('Books')}</span>
                                        </Link>
                                        <Link href="/products?type=course" className="bg-slate-800/80 hover:bg-slate-700/80 p-6 rounded-xl text-center transition-all group hover:scale-[1.03]">
                                            <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">💻</span>
                                            <span className="text-white font-bold block text-sm">{__('Courses')}</span>
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
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{__('Categories title')}</h2>
                    <p className="text-gray-500 mb-8">{__('Categories desc')}</p>
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
                                    <p className="text-lg font-bold text-gray-950 group-hover:text-orange-600 transition-colors">{__(category.name)}</p>
                                    <p className="text-sm text-gray-500 truncate mt-0.5">{category.description ? __(category.description) : __('Category click view')}</p>
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
                            <h2 className="text-3xl font-extrabold text-gray-900">{__('Featured Products title')}</h2>
                            <p className="text-gray-500 mt-1">{__('Featured Products desc')}</p>
                        </div>
                        <Link href="/products" className="hidden sm:inline-flex items-center text-sm font-bold text-orange-600 hover:text-orange-700">
                            {__('See All Products')}
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                        {featuredProducts?.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
