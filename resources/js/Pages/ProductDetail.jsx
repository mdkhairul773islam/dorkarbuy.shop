import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import Layout from '../Layouts/Layout';

export default function ProductDetail({ auth, product, fbEventId }) {
    const [activeTab, setActiveTab] = useState('summary');
    const [isLookInsideOpen, setIsLookInsideOpen] = useState(false);
    const [activeImage, setActiveImage] = useState(null);

    // Zoom Lightbox States
    const [isZoomOpen, setIsZoomOpen] = useState(false);
    const [zoomScale, setZoomScale] = useState(1);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Collect all gallery images in an array
    const allImages = [];
    if (product.image) {
        allImages.push(`/storage/${product.image}`);
    }
    if (product.images && product.images.length > 0) {
        product.images.forEach(img => {
            const path = `/storage/${img}`;
            if (!allImages.includes(path)) {
                allImages.push(path);
            }
        });
    }

    // Panning handlers
    const handleMouseDown = (e) => {
        if (zoomScale <= 1) return;
        setIsDragging(true);
        setDragStart({ x: e.clientX - zoomPosition.x, y: e.clientY - zoomPosition.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setZoomPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleImageClick = (e) => {
        e.stopPropagation();
        if (zoomScale === 1) {
            setZoomScale(2);
            setZoomPosition({ x: 0, y: 0 });
        } else {
            setZoomScale(1);
            setZoomPosition({ x: 0, y: 0 });
        }
    };

    // Keyboard navigation listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isZoomOpen) return;
            if (e.key === 'Escape') {
                setIsZoomOpen(false);
                setZoomScale(1);
                setZoomPosition({ x: 0, y: 0 });
            } else if (e.key === 'ArrowLeft' && allImages.length > 1) {
                const currentIndex = allImages.indexOf(activeImage);
                const newIndex = currentIndex === 0 ? allImages.length - 1 : currentIndex - 1;
                setActiveImage(allImages[newIndex]);
                setZoomScale(1);
                setZoomPosition({ x: 0, y: 0 });
            } else if (e.key === 'ArrowRight' && allImages.length > 1) {
                const currentIndex = allImages.indexOf(activeImage);
                const newIndex = currentIndex === allImages.length - 1 ? 0 : currentIndex + 1;
                setActiveImage(allImages[newIndex]);
                setZoomScale(1);
                setZoomPosition({ x: 0, y: 0 });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isZoomOpen, activeImage, allImages]);

    useEffect(() => {
        if (product.image) {
            setActiveImage(`/storage/${product.image}`);
        } else if (product.images && product.images.length > 0) {
            setActiveImage(`/storage/${product.images[0]}`);
        } else {
            setActiveImage(null);
        }
    }, [product]);

    useEffect(() => {
        if (typeof fbq !== 'undefined' && fbEventId) {
            fbq('track', 'ViewContent', {
                content_ids: [String(product.id)],
                content_name: product.name,
                content_type: 'product',
                value: parseFloat(product.final_price || product.price),
                currency: 'BDT',
            }, { eventID: fbEventId });
        }
    }, [fbEventId]);

    const sizes = product.duration ? product.duration.split(',').map(s => s.trim()) : [];
    const [selectedSize, setSelectedSize] = useState(null);

    useEffect(() => {
        const productSizes = product.duration ? product.duration.split(',').map(s => s.trim()) : [];
        if (product.type === 'clothing' && productSizes.length > 0) {
            setSelectedSize(productSizes[0]);
        } else {
            setSelectedSize(null);
        }
    }, [product]);

    const { data, setData, post, processing } = useForm({
        product_id: product.id,
        quantity: 1,
        size: null,
    });

    useEffect(() => {
        setData('size', selectedSize);
    }, [selectedSize]);

    const addToCart = (e) => {
        e.preventDefault();
        post('/cart/add');
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

    const getDurationLabel = (type) => {
        switch (type) {
            case 'book': return 'Pages';
            case 'clothing': return 'Sizes Available';
            case 'electronics': return 'Model/Warranty';
            case 'course': return 'Duration';
            default: return 'Specification/Duration';
        }
    };

    return (
        <Layout>
            <Head title={product.name} />

            <div className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-x-10 lg:items-start">
                        {/* Image & Gallery */}
                        <div className="flex flex-col">
                            <div className="w-full relative shadow-sm rounded-2xl overflow-hidden bg-white border border-gray-200 p-4 flex items-center justify-center min-h-[300px] sm:min-h-[450px]">
                                {activeImage ? (
                                    <div 
                                        className="relative group cursor-pointer w-full flex justify-center"
                                        onClick={() => (product.type === 'book' && product.look_inside_type) ? setIsLookInsideOpen(true) : setIsZoomOpen(true)}
                                    >
                                        <img
                                            src={activeImage}
                                            alt={product.name}
                                            className="w-auto h-auto max-w-full max-h-[450px] object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                                        />
                                        
                                        {/* Look Inside Overlay */}
                                        {product.type === 'book' && product.look_inside_type && (
                                            <div className="absolute top-0 inset-x-0 w-full bg-white bg-opacity-95 py-2.5 px-4 shadow text-center transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                                <div className="text-orange-600 font-bold flex items-center justify-center space-x-2">
                                                    <span>Look Inside</span>
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                        {product.type === 'book' && product.look_inside_type && (
                                            <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md z-10 flex items-center space-x-1 outline outline-1 outline-gray-200">
                                                <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 13H7v-2h2v2zm0-4H7V5h2v4z"/></svg>
                                                <span className="text-xs font-bold text-gray-700">Look Inside</span>
                                            </div>
                                        )}
                                        {/* Zoom Indicator for non-book or books without look inside */}
                                        {(product.type !== 'book' || !product.look_inside_type) && (
                                            <div className="absolute top-4 right-4 bg-white hover:bg-orange-50 p-2.5 rounded-full shadow-md z-10 transition-colors duration-200 outline outline-1 outline-gray-200 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-gray-600 hover:text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-full h-96 bg-gray-100 flex items-center justify-center rounded-2xl">
                                        <span className="text-gray-400">No image</span>
                                    </div>
                                )}
                            </div>

                            {/* Gallery Thumbnails */}
                            {((product.image && product.images && product.images.length > 0) || (product.images && product.images.length > 1)) && (
                                <div className="flex flex-wrap gap-2 mt-4 justify-start">
                                    {product.image && (
                                        <button
                                            type="button"
                                            onClick={() => setActiveImage(`/storage/${product.image}`)}
                                            className={`w-16 h-16 sm:w-20 sm:h-20 p-1 bg-white border-2 rounded-xl overflow-hidden flex items-center justify-center transition-all ${
                                                activeImage === `/storage/${product.image}`
                                                    ? 'border-orange-500 ring-2 ring-orange-500/20'
                                                    : 'border-gray-200 hover:border-orange-400'
                                            }`}
                                        >
                                            <img
                                                src={`/storage/${product.image}`}
                                                alt="Main preview"
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        </button>
                                    )}
                                    {product.images && product.images.map((img, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => setActiveImage(`/storage/${img}`)}
                                            className={`w-16 h-16 sm:w-20 sm:h-20 p-1 bg-white border-2 rounded-xl overflow-hidden flex items-center justify-center transition-all ${
                                                activeImage === `/storage/${img}`
                                                    ? 'border-orange-500 ring-2 ring-orange-500/20'
                                                    : 'border-gray-200 hover:border-orange-400'
                                            }`}
                                        >
                                            <img
                                                src={`/storage/${img}`}
                                                alt={`Gallery preview ${index + 1}`}
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product info */}
                        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-black border ${getTypeColor(product.type)} mb-4`}>
                                {getTypeLabel(product.type)}
                            </span>

                            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 leading-tight">
                                {product.name}
                            </h1>

                            <div className="mt-4">
                                <h2 className="sr-only">Product information</h2>
                                <p className="text-3xl font-black text-gray-950">
                                    ৳{product.discount_price 
                                        ? (product.discount_type === 'flat' 
                                            ? (parseFloat(product.price) - parseFloat(product.discount_price)).toFixed(2)
                                            : (parseFloat(product.price) * (1 - parseFloat(product.discount_price) / 100)).toFixed(2)
                                          )
                                        : parseFloat(product.price).toFixed(2)
                                    }
                                    {product.discount_price && (
                                        <span className="ml-3 text-xl text-gray-400 line-through font-normal">
                                            ৳{parseFloat(product.price).toFixed(2)}
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div className="mt-6">
                                <h3 className="sr-only">Description</h3>
                                <div className="text-base text-gray-600 leading-relaxed">
                                    {product.description}
                                </div>
                            </div>

                            <div className="mt-6 space-y-2.5 border-t border-b border-gray-100 py-6">
                                {product.author && (
                                    <div className="flex items-center">
                                        <span className="text-sm font-bold text-gray-500 mr-2">{product.author_title || 'Author/Brand'}:</span>
                                        <span className="text-sm font-bold text-gray-900">{product.author}</span>
                                    </div>
                                )}
                                {product.duration && product.type !== 'clothing' && (
                                    <div className="flex items-center">
                                        <span className="text-sm font-bold text-gray-500 mr-2">{getDurationLabel(product.type)}:</span>
                                        <span className="text-sm font-bold text-gray-900">{product.duration}</span>
                                    </div>
                                )}
                                <div className="flex items-center">
                                    <span className="text-sm font-bold text-gray-500 mr-2">Stock Availability:</span>
                                    <span className={`text-sm font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {product.stock > 0 ? `${product.stock} items left in stock` : 'Out of stock'}
                                    </span>
                                </div>
                            </div>

                            {/* Size Selector for Clothing */}
                            {product.type === 'clothing' && sizes.length > 0 && (
                                <div className="mt-6 border-t border-gray-100 pt-6">
                                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Select Size</h3>
                                    <div className="grid grid-cols-4 gap-3 mt-3">
                                        {sizes.map((size) => (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => setSelectedSize(size)}
                                                className={`flex items-center justify-center rounded-xl py-3 px-4 text-sm font-bold uppercase transition-all duration-200 border-2 ${
                                                    selectedSize === size
                                                        ? 'bg-orange-600 border-orange-600 text-white shadow-md shadow-orange-500/20'
                                                        : 'bg-white border-gray-200 text-gray-900 hover:border-orange-500'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <form onSubmit={addToCart} className="mt-8 flex gap-4">
                                <button
                                    type="submit"
                                    disabled={processing || product.stock === 0}
                                    className="flex-1 bg-orange-600 border border-transparent rounded-xl py-4 px-8 flex items-center justify-center text-base font-bold text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-lg"
                                >
                                    {product.stock === 0 ? 'Out of Stock' : 'অর্ডার করুন / Add to Cart'}
                                </button>
                                
                                {product.type === 'book' && product.look_inside_type && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setIsLookInsideOpen(true);
                                        }}
                                        className="flex-1 bg-white border-2 border-orange-600 rounded-xl py-4 px-8 flex items-center justify-center text-base font-bold text-orange-600 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        Look Inside
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Dynamic Details block */}
                    <div className="mt-16 w-full text-left">
                        <h2 className="text-2xl font-bold mb-6 text-gray-950">পণ্য বিবরণী / Details</h2>
                        
                        <div className="flex space-x-1 border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab('summary')}
                                className={`px-6 py-3 border-b-2 font-bold text-sm focus:outline-none transition-colors ${
                                    activeTab === 'summary'
                                        ? 'border-orange-600 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {product.summary_title || 'Summary'}
                            </button>
                            <button
                                onClick={() => setActiveTab('specification')}
                                className={`px-6 py-3 border-b-2 font-bold text-sm transition-colors focus:outline-none ${
                                    activeTab === 'specification'
                                        ? 'border-orange-600 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {product.specification_title || 'Specification'}
                            </button>
                            {product.author && (
                                <button
                                    onClick={() => setActiveTab('author_details')}
                                    className={`px-6 py-3 border-b-2 font-bold text-sm transition-colors focus:outline-none ${
                                        activeTab === 'author_details'
                                            ? 'border-orange-600 text-orange-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {product.author_title || 'Author/Brand'}
                                </button>
                            )}
                        </div>

                        <div className="py-8 min-h-[200px]">
                            {activeTab === 'summary' && (
                                <div className="rokomari-content" dangerouslySetInnerHTML={{ __html: product.content || '<p>No summary provided for this product.</p>' }} />
                            )}
                            {activeTab === 'specification' && (
                                product.specification ? (
                                    <div className="rokomari-content" dangerouslySetInnerHTML={{ __html: product.specification }} />
                                ) : (
                                    <div className="text-gray-400 py-8 text-center italic border border-dashed border-gray-200 rounded-xl">Specification details have not been added yet.</div>
                                )
                            )}
                            {activeTab === 'author_details' && (
                                product.author_details ? (
                                    <div className="rokomari-content" dangerouslySetInnerHTML={{ __html: product.author_details }} />
                                ) : (
                                    <div className="text-gray-400 py-8 text-center italic border border-dashed border-gray-200 rounded-xl">Author details have not been added yet.</div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Look Inside Modal */}
            {isLookInsideOpen && product.type === 'book' && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsLookInsideOpen(false)}></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 relative">
                                <button 
                                    onClick={() => setIsLookInsideOpen(false)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-gray-100 rounded-full p-2"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                
                                <div className="mt-3 text-center sm:mt-0 sm:text-left h-[75vh] flex flex-col">
                                    <h3 className="text-xl font-bold leading-6 text-gray-900 mb-4" id="modal-title">
                                        Look Inside - {product.name}
                                    </h3>
                                    
                                    <div className="flex-1 w-full bg-gray-50 rounded border border-gray-200 overflow-y-auto">
                                        {product.look_inside_type === 'pdf' && product.look_inside_pdf && (
                                            <iframe src={`/storage/${product.look_inside_pdf}`} className="w-full h-full" title="PDF Preview"></iframe>
                                        )}
                                        {product.look_inside_type === 'text' && product.look_inside_text && (
                                            <div className="p-8 rokomari-content" dangerouslySetInnerHTML={{ __html: product.look_inside_text }}></div>
                                        )}
                                        {(!product.look_inside_type || (!product.look_inside_pdf && !product.look_inside_text)) && (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                No preview content available.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Zoom Modal (Lightbox) */}
            {isZoomOpen && (product.type !== 'book' || !product.look_inside_type) && (
                <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-95 flex flex-col justify-between" role="dialog" aria-modal="true">
                    {/* Top Control Bar */}
                    <div className="w-full flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent z-10">
                        <div className="text-white font-bold text-sm sm:text-base max-w-[50%] truncate">
                            {product.name}
                        </div>
                        
                        {/* Control Buttons */}
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            {/* Zoom Out */}
                            <button
                                onClick={() => {
                                    setZoomScale(prev => Math.max(0.5, prev - 0.25));
                                    if (zoomScale <= 1.25) setZoomPosition({ x: 0, y: 0 });
                                }}
                                className="text-white hover:text-orange-400 bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors focus:outline-none"
                                title="Zoom Out"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                </svg>
                            </button>
                            
                            {/* Scale Indicator / Reset */}
                            <button
                                onClick={() => {
                                    setZoomScale(1);
                                    setZoomPosition({ x: 0, y: 0 });
                                }}
                                className="text-white hover:text-orange-400 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors focus:outline-none"
                                title="Reset Zoom"
                            >
                                {Math.round(zoomScale * 100)}%
                            </button>

                            {/* Zoom In */}
                            <button
                                onClick={() => setZoomScale(prev => Math.min(3, prev + 0.25))}
                                className="text-white hover:text-orange-400 bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors focus:outline-none"
                                title="Zoom In"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            </button>

                            {/* Close */}
                            <button
                                onClick={() => {
                                    setIsZoomOpen(false);
                                    setZoomScale(1);
                                    setZoomPosition({ x: 0, y: 0 });
                                }}
                                className="text-white hover:text-orange-400 bg-orange-600 hover:bg-orange-700 p-2 rounded-lg transition-colors focus:outline-none"
                                title="Close"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Image Viewer Area */}
                    <div 
                        className="flex-1 w-full relative flex items-center justify-center overflow-hidden select-none"
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    >
                        {/* Left Nav Button */}
                        {allImages.length > 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const currentIndex = allImages.indexOf(activeImage);
                                    const newIndex = currentIndex === 0 ? allImages.length - 1 : currentIndex - 1;
                                    setActiveImage(allImages[newIndex]);
                                    setZoomScale(1);
                                    setZoomPosition({ x: 0, y: 0 });
                                }}
                                className="absolute left-4 z-10 text-white hover:text-orange-400 bg-black/40 hover:bg-black/60 p-3 rounded-full transition-colors focus:outline-none"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        )}

                        {/* Image Container & Image */}
                        <div className="relative max-w-full max-h-[75vh] flex items-center justify-center p-4">
                            <img
                                src={activeImage}
                                alt={product.name}
                                onMouseDown={handleMouseDown}
                                onClick={handleImageClick}
                                className="max-w-full max-h-[75vh] object-contain select-none transition-transform duration-150 ease-out"
                                style={{
                                    transform: `translate(${zoomPosition.x}px, ${zoomPosition.y}px) scale(${zoomScale})`,
                                    cursor: zoomScale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
                                }}
                                draggable={false}
                            />
                        </div>

                        {/* Right Nav Button */}
                        {allImages.length > 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const currentIndex = allImages.indexOf(activeImage);
                                    const newIndex = currentIndex === allImages.length - 1 ? 0 : currentIndex + 1;
                                    setActiveImage(allImages[newIndex]);
                                    setZoomScale(1);
                                    setZoomPosition({ x: 0, y: 0 });
                                }}
                                className="absolute right-4 z-10 text-white hover:text-orange-400 bg-black/40 hover:bg-black/60 p-3 rounded-full transition-colors focus:outline-none"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Bottom Gallery Preview Grid */}
                    {allImages.length > 1 && (
                        <div className="w-full bg-black/85 py-4 px-6 flex justify-center gap-2 overflow-x-auto z-10 border-t border-white/5">
                            {allImages.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setActiveImage(img);
                                        setZoomScale(1);
                                        setZoomPosition({ x: 0, y: 0 });
                                    }}
                                    className={`w-14 h-14 p-0.5 bg-white border-2 rounded-lg overflow-hidden flex items-center justify-center transition-all focus:outline-none ${
                                        activeImage === img ? 'border-orange-500 ring-2 ring-orange-500/20 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'
                                    }`}
                                >
                                    <img src={img} alt="" className="max-w-full max-h-full object-contain" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </Layout>
    );
}
