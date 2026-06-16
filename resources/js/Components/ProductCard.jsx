import { Link } from '@inertiajs/react';

const FallbackImage = ({ type }) => {
    let gradient = "from-slate-100 to-slate-200 text-slate-400";
    let icon = (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
    );

    if (type === 'clothing') {
        gradient = "from-amber-500/10 to-orange-500/10 text-orange-500";
        icon = (
            <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 7.5c0-.828-.672-1.5-1.5-1.5H16.8L13.8 3.5c-.3-.3-.7-.5-1.1-.5s-.8.2-1.1.5L8.6 6H4.5A1.5 1.5 0 003 7.5v12A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-12zM12 5l2.2 2.2H9.8L12 5zm-7.5 4.7h15v9.6h-15V9.7z" />
            </svg>
        );
    } else if (type === 'electronics') {
        gradient = "from-blue-500/10 to-indigo-500/10 text-blue-500";
        icon = (
            <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
        );
    } else if (type === 'book') {
        gradient = "from-emerald-500/10 to-teal-500/10 text-emerald-600";
        icon = (
            <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        );
    } else if (type === 'course') {
        gradient = "from-purple-500/10 to-pink-500/10 text-purple-600";
        icon = (
            <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        );
    } else if (type === 'digital') {
        gradient = "from-rose-500/10 to-red-500/10 text-rose-500";
        icon = (
            <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
        );
    }

    return (
        <div className={`w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center p-6 gap-2`}>
            {icon}
            <span className="text-[10px] uppercase tracking-widest font-black opacity-40">DorkarBuy</span>
        </div>
    );
};

export default function ProductCard({ product }) {
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
            case 'clothing': return 'bg-amber-100/80 text-amber-800 border-amber-200/50';
            case 'electronics': return 'bg-blue-100/80 text-blue-800 border-blue-200/50';
            case 'book': return 'bg-emerald-100/80 text-emerald-800 border-emerald-200/50';
            case 'course': return 'bg-purple-100/80 text-purple-800 border-purple-200/50';
            case 'digital': return 'bg-rose-100/80 text-rose-800 border-rose-200/50';
            default: return 'bg-gray-100/80 text-gray-800 border-gray-200/50';
        }
    };

    const calculatedPrice = product.discount_price 
        ? (product.discount_type === 'flat' 
            ? (parseFloat(product.price) - parseFloat(product.discount_price)).toFixed(2)
            : (parseFloat(product.price) * (1 - parseFloat(product.discount_price) / 100)).toFixed(2)
          )
        : parseFloat(product.price).toFixed(2);

    return (
        <div className="group relative bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-orange-500/30 transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
            {/* Image Container */}
            <div className="w-full relative bg-slate-50 aspect-square overflow-hidden shrink-0 border-b border-gray-100">
                <Link href={`/products/${product.slug}`} className="block w-full h-full">
                    {product.image ? (
                        <img
                            src={`/storage/${product.image}`}
                            alt={product.name}
                            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                    ) : (
                        <FallbackImage type={product.type} />
                    )}
                </Link>
                
                {/* Discount Badge */}
                {product.discount_price && product.show_discount_badge && (
                    <div className="absolute top-3 right-3 z-10">
                        <span className="bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-sm tracking-wide">
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
                    className="absolute bottom-3 right-3 bg-orange-600 text-white p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hover:bg-orange-700 z-10"
                    title="View Details"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </div>
            
            {/* Details Container */}
            <div className="p-4 flex flex-col flex-1">
                {/* Product Type Tag */}
                <span className={`inline-block self-start px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getTypeColor(product.type)} mb-2`}>
                    {getTypeLabel(product.type)}
                </span>
                
                {/* Title */}
                <Link href={`/products/${product.slug}`} className="block mb-1 group-hover:text-orange-600 transition-colors">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 min-h-[2.5rem] leading-snug">
                        {product.name}
                    </h3>
                </Link>
                
                {/* Author/Vendor */}
                {product.author ? (
                    <p className="text-[11px] text-gray-400 italic mb-3">By {product.author}</p>
                ) : (
                    <div className="h-4 mb-3"></div>
                )}

                {/* Footer details - Aligned to bottom */}
                <div className="mt-auto pt-3 border-t border-gray-150 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-base font-extrabold text-gray-950">
                            ৳{calculatedPrice}
                        </span>
                        {product.discount_price ? (
                            <span className="text-[10px] text-gray-400 line-through">
                                ৳{parseFloat(product.price).toFixed(2)}
                            </span>
                        ) : (
                            <span className="text-[10px] text-transparent select-none">-</span>
                        )}
                    </div>

                    <Link 
                        href={`/products/${product.slug}`}
                        className="px-3 py-1.5 bg-orange-50 text-orange-700 text-xs font-bold rounded-lg border border-orange-100 hover:bg-orange-600 hover:text-white hover:border-transparent transition-all duration-200 shadow-sm"
                    >
                        অর্ডার করুন
                    </Link>
                </div>
            </div>
        </div>
    );
}
