import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Layout from '../Layouts/Layout';

export default function Cart({ auth, cart }) {
    const { flash } = usePage().props;
    const { delete: destroy } = useForm();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
        if (typeof fbq !== 'undefined' && flash?.fb_event?.type === 'AddToCart') {
            const { event_id, data } = flash.fb_event;
            fbq('track', 'AddToCart', data, { eventID: event_id });
        }
    }, [flash?.fb_event]);

    const removeFromCart = (itemId) => {
        setItemToDelete(itemId);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            destroy(`/cart/${itemToDelete}`);
            setShowDeleteModal(false);
            setItemToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setItemToDelete(null);
    };

    const updateQuantity = (itemId, quantity) => {
        if (quantity < 1) return;
        router.patch(`/cart/${itemId}`, 
            { quantity },
            { preserveScroll: true }
        );
    };

    const total = cart?.items?.reduce((sum, item) => {
        return sum + (parseFloat(item.price) * item.quantity);
    }, 0) || 0;

    return (
        <Layout>
            <Head title="Shopping Cart" />

            <div className="bg-slate-50/50 min-h-screen py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-8">Shopping Cart</h1>

                    {cart?.items?.length > 0 ? (
                        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
                            {/* Cart Items List */}
                            <div className="lg:col-span-7">
                                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                    <ul className="divide-y divide-slate-100">
                                        {cart.items.map((item) => (
                                            <li key={item.id} className="p-6 flex flex-col sm:flex-row gap-6">
                                                {/* Image */}
                                                <div className="shrink-0 flex justify-center sm:block">
                                                    {item.product?.image ? (
                                                        <img
                                                            src={`/storage/${item.product.image}`}
                                                            alt={item.product.name}
                                                            className="w-24 h-24 rounded-xl object-center object-cover border border-slate-100 shadow-sm"
                                                        />
                                                    ) : (
                                                        <div className="w-24 h-24 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                                                            <span className="text-xs text-slate-400 font-semibold">No image</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Info & Quantity controls */}
                                                <div className="flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex justify-between gap-4 text-base font-bold text-slate-900">
                                                            <h3 className="hover:text-orange-600 transition-colors">
                                                                <Link href={`/products/${item.product?.slug}`}>
                                                                    {item.product?.name}
                                                                </Link>
                                                            </h3>
                                                            <p className="shrink-0 text-slate-900">৳{(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                                                        </div>
                                                        <p className="mt-1 text-xs text-slate-400 uppercase tracking-wider font-semibold">
                                                            {item.product?.type}
                                                        </p>
                                                        {item.size && (
                                                            <p className="mt-2">
                                                                <span className="text-xs font-bold text-orange-700 bg-orange-50 rounded-lg px-2.5 py-1 border border-orange-100">Size: {item.size}</span>
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center justify-between mt-4 sm:mt-0 pt-4 sm:pt-0">
                                                        {/* Quantity selector */}
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-xs font-bold text-slate-500">Qty:</span>
                                                            <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                    disabled={item.quantity <= 1}
                                                                    className="px-2.5 py-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                                >
                                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                                                    </svg>
                                                                </button>
                                                                <input
                                                                    type="number"
                                                                    id={`quantity-${item.id}`}
                                                                    min="1"
                                                                    value={item.quantity}
                                                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                                                    className="w-10 text-center border-0 focus:ring-0 font-bold text-slate-800 bg-transparent text-sm p-0"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                    className="px-2.5 py-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                                                                >
                                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Remove Button */}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="flex items-center gap-1.5 font-bold text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            <span>Remove</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Summary Section */}
                            <div className="mt-8 lg:mt-0 lg:col-span-5">
                                <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-sm">
                                    <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
                                    
                                    <div className="space-y-4 text-sm text-slate-600">
                                        <div className="flex justify-between">
                                            <span>Subtotal</span>
                                            <span className="font-semibold text-slate-800">৳{total.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between pb-4 border-b border-slate-100">
                                            <span>Shipping</span>
                                            <span className="text-emerald-600 font-bold">Free</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-base font-bold text-slate-900">Total Amount</span>
                                            <span className="text-xl font-black text-orange-600">৳{total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <Link
                                            href="/checkout"
                                            className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-xl py-4 px-6 text-base font-bold transition-all hover:shadow-lg hover:shadow-orange-600/20 active:scale-95 flex items-center justify-center space-x-2 shadow-md"
                                        >
                                            <span>Proceed to Checkout</span>
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </Link>
                                    </div>

                                    <div className="mt-4 text-center">
                                        <Link href="/products" className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors inline-flex items-center space-x-1">
                                            <span>&larr; Continue Shopping</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Empty Cart View */
                        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-2xl mx-auto px-6">
                            <div className="w-20 h-20 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h3>
                            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Looks like you haven't added anything to your cart yet. Let's find some great products for you!</p>
                            <Link
                                href="/products"
                                className="inline-flex items-center px-6 py-3.5 bg-orange-600 hover:bg-orange-700 text-white text-base font-bold rounded-xl shadow-lg hover:shadow-orange-600/20 transition-all active:scale-95"
                            >
                                Browse Products
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div 
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                        onClick={cancelDelete}
                    ></div>

                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 transform transition-all border border-slate-100">
                            {/* Icon */}
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-6">
                                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>

                            {/* Content */}
                            <div className="text-center">
                                <h3 className="text-2xl font-black text-slate-900 mb-2">
                                    Remove Item?
                                </h3>
                                <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                                    Are you sure you want to remove this item from your cart? This action cannot be undone.
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={cancelDelete}
                                    className="flex-1 px-6 py-3.5 border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 active:scale-95 transition-all text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-6 py-3.5 bg-gradient-to-r from-red-600 to-orange-600 border border-transparent rounded-xl text-white font-bold hover:from-red-700 hover:to-orange-700 active:scale-95 transition-all shadow-md text-sm"
                                >
                                    Yes, Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
