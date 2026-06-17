import { usePage, router } from '@inertiajs/react';
import { useSelector, useDispatch } from 'react-redux';
import { closeDrawer } from '../Redux/cartSlice';
import { useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';

export default function CartDrawer() {
    const dispatch = useDispatch();
    const { isDrawerOpen } = useSelector((state) => state.cart);
    const { cart, locale } = usePage().props;
    const { __ } = useTranslation();

    // Close drawer on escape key press
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') dispatch(closeDrawer());
        };
        if (isDrawerOpen) {
            window.addEventListener('keydown', handleKeyDown);
            // Disable page scroll when open
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isDrawerOpen, dispatch]);

    const handleUpdateQuantity = (itemId, currentQty, stock, increment) => {
        const newQty = increment ? currentQty + 1 : currentQty - 1;
        if (newQty < 1) return;
        if (increment && newQty > stock) {
            alert('⚠️ ' + __('Insufficient stock available!'));
            return;
        }

        router.patch(`/cart/${itemId}`, { quantity: newQty }, {
            preserveScroll: true,
            preserveState: true
        });
    };

    const handleRemoveItem = (itemId) => {
        if (confirm(__('Are you sure you want to remove this item?'))) {
            router.delete(`/cart/${itemId}`, {
                preserveScroll: true,
                preserveState: true
            });
        }
    };

    const cartItems = cart?.items || [];
    const subtotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);

    return (
        <div className={`relative z-50 ${isDrawerOpen ? 'block' : 'pointer-events-none'}`}>
            {/* Backdrop Overlay */}
            <div 
                className={`fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ${
                    isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => dispatch(closeDrawer())}
            />

            {/* Panel */}
            <div className={`fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
                isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
                {/* Header */}
                <div className="p-5 border-b border-gray-150 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-2.5">
                        <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <h2 className="text-lg font-black text-gray-900 tracking-tight">{__('Your Shopping Bag')}</h2>
                        {cartItems.length > 0 && (
                            <span className="bg-orange-100 text-orange-800 text-xs font-black px-2 py-0.5 rounded-full">
                                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                            </span>
                        )}
                    </div>
                    <button 
                        onClick={() => dispatch(closeDrawer())}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-150 transition-colors"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                            <div className="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-800">{__('Your Shopping Bag is empty')}</h3>
                                <p className="text-xs text-gray-400 mt-1 max-w-[200px] mx-auto">{__('Add some products to your bag and try again!')}</p>
                            </div>
                            <button
                                onClick={() => dispatch(closeDrawer())}
                                className="px-5 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl hover:bg-orange-700 transition-colors shadow-sm"
                            >
                                {__('Start Shopping')}
                            </button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="flex gap-4 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-all bg-white relative group">
                                {/* Image */}
                                <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                                    {item.product.image ? (
                                        <img 
                                            src={`/storage/${item.product.image}`} 
                                            alt={item.product.name} 
                                            className="w-full h-full object-contain p-1"
                                        />
                                    ) : (
                                        <div className="text-[9px] text-gray-400 font-extrabold uppercase">DorkarBuy</div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex-1 flex flex-col justify-between min-w-0">
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-900 line-clamp-2 leading-tight">
                                            {item.product.name}
                                        </h4>
                                        {item.size && (
                                            <span className="inline-block mt-1 bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded font-medium">
                                                {__('Size:')} {item.size}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="flex items-center justify-between mt-2">
                                        {/* Price */}
                                        <span className="text-sm font-black text-gray-950">
                                            ৳{(parseFloat(item.price) * item.quantity).toFixed(2)}
                                        </span>

                                        {/* Quantity Selector */}
                                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-7 bg-gray-50">
                                            <button 
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity, item.product.stock, false)}
                                                className="px-2 text-gray-500 hover:bg-gray-200 transition-colors h-full flex items-center"
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <span className="px-2 text-xs font-bold text-gray-800 min-w-[1.25rem] text-center">
                                                {item.quantity}
                                            </span>
                                            <button 
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity, item.product.stock, true)}
                                                className="px-2 text-gray-500 hover:bg-gray-200 transition-colors h-full flex items-center"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Remove Button */}
                                <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50 cursor-pointer"
                                    title="Remove Item"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer / Summary */}
                {cartItems.length > 0 && (
                    <div className="p-5 border-t border-gray-150 bg-gray-50/50 space-y-4">
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>{__('Total Items')}</span>
                                <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}{locale === 'bn' ? ' টি' : ''}</span>
                            </div>
                            <div className="flex justify-between text-base font-black text-gray-900 pt-1 border-t border-gray-100">
                                <span>{__('Total Price')}</span>
                                <span className="text-orange-600">৳{subtotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button
                                onClick={() => dispatch(closeDrawer())}
                                className="w-full py-3 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                {__('Continue Shopping')}
                            </button>
                            <a
                                href="/checkout"
                                className="w-full py-3 bg-orange-600 text-white text-xs font-black rounded-xl hover:bg-orange-700 transition-colors text-center shadow-md shadow-orange-500/10 block"
                            >
                                {__('Proceed to Checkout')}
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
