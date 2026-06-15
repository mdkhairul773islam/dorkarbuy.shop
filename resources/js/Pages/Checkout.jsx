import { Head, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import Layout from '../Layouts/Layout';

export default function Checkout({ auth, cart, paymentMethods, fbEventId }) {
    const { data, setData, post, processing, errors } = useForm({
        customer_name: auth?.user?.name || '',
        customer_email: auth?.user?.email || '',
        customer_phone: '',
        customer_address: '',
        payment_method: paymentMethods?.[0]?.code || 'bkash',
        notes: '',
    });

    const total = cart?.items?.reduce((sum, item) => {
        return sum + (parseFloat(item.price) * item.quantity);
    }, 0) || 0;

    useEffect(() => {
        if (typeof fbq !== 'undefined' && fbEventId) {
            fbq('track', 'InitiateCheckout', {
                value: total,
                currency: 'BDT',
                num_items: cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
                content_ids: cart?.items?.map(item => String(item.product_id)) || [],
                content_type: 'product',
            }, { eventID: fbEventId });
        }
    }, [fbEventId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/checkout');
    };

    return (
        <Layout>
            <Head title="Checkout" />

            <div className="bg-slate-50/50 min-h-screen py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-8">Checkout</h1>

                    <form onSubmit={handleSubmit} className="lg:grid lg:grid-cols-12 lg:gap-x-8">
                        {/* Shipping and Payment Forms */}
                        <div className="lg:col-span-7 space-y-6">
                            {/* Billing & Contact info card */}
                            <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-sm">
                                <h2 className="text-xl font-bold text-slate-900 mb-6">Contact & Shipping Information</h2>

                                <div className="space-y-5">
                                    {/* Full Name */}
                                    <div>
                                        <label htmlFor="customer_name" className="block text-sm font-semibold text-slate-700 mb-2">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                id="customer_name"
                                                value={data.customer_name}
                                                onChange={(e) => setData('customer_name', e.target.value)}
                                                className="block w-full pl-11 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 text-sm"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                        {errors.customer_name && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.customer_name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label htmlFor="customer_email" className="block text-sm font-semibold text-slate-700 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                </svg>
                                            </div>
                                            <input
                                                type="email"
                                                id="customer_email"
                                                value={data.customer_email}
                                                onChange={(e) => setData('customer_email', e.target.value)}
                                                className="block w-full pl-11 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 text-sm"
                                                placeholder="you@example.com"
                                                required
                                            />
                                        </div>
                                        {errors.customer_email && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.customer_email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Phone Number */}
                                    <div>
                                        <label htmlFor="customer_phone" className="block text-sm font-semibold text-slate-700 mb-2">
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="tel"
                                                id="customer_phone"
                                                value={data.customer_phone}
                                                onChange={(e) => setData('customer_phone', e.target.value)}
                                                className="block w-full pl-11 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 text-sm"
                                                placeholder="+880 1234-567890"
                                                required
                                            />
                                        </div>
                                        {errors.customer_phone && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.customer_phone}
                                            </p>
                                        )}
                                    </div>

                                    {/* Delivery Address */}
                                    <div>
                                        <label htmlFor="customer_address" className="block text-sm font-semibold text-slate-700 mb-2">
                                            Delivery Address
                                        </label>
                                        <div className="relative">
                                            <div className="absolute top-3.5 left-0 pl-3.5 pointer-events-none">
                                                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <textarea
                                                id="customer_address"
                                                rows={3}
                                                value={data.customer_address}
                                                onChange={(e) => setData('customer_address', e.target.value)}
                                                className="block w-full pl-11 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 text-sm resize-none"
                                                placeholder="House/Flat, Road, Area, City"
                                                required
                                            />
                                        </div>
                                        {errors.customer_address && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.customer_address}
                                            </p>
                                        )}
                                    </div>

                                    {/* Payment Method */}
                                    <div>
                                        <label htmlFor="payment_method" className="block text-sm font-semibold text-slate-700 mb-2">
                                            Payment Method
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                </svg>
                                            </div>
                                            <select
                                                id="payment_method"
                                                value={data.payment_method}
                                                onChange={(e) => setData('payment_method', e.target.value)}
                                                className="block w-full pl-11 pr-10 py-3 border border-slate-200 rounded-xl leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 text-sm appearance-none cursor-pointer"
                                                required
                                            >
                                                {paymentMethods?.map((method) => (
                                                    <option key={method.id} value={method.code}>
                                                        {method.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                        {errors.payment_method && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.payment_method}
                                            </p>
                                        )}
                                        {paymentMethods?.find(m => m.code === data.payment_method)?.description && (
                                            <p className="mt-3 text-xs font-semibold text-orange-700 bg-orange-50/80 p-3 rounded-lg border border-orange-100/60 leading-relaxed">
                                                {paymentMethods.find(m => m.code === data.payment_method).description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Order Notes */}
                                    <div>
                                        <label htmlFor="notes" className="block text-sm font-semibold text-slate-700 mb-2">
                                            Order Notes <span className="text-slate-400 font-normal">(Optional)</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute top-3.5 left-0 pl-3.5 pointer-events-none">
                                                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                </svg>
                                            </div>
                                            <textarea
                                                id="notes"
                                                rows={3}
                                                value={data.notes}
                                                onChange={(e) => setData('notes', e.target.value)}
                                                className="block w-full pl-11 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 text-sm resize-none"
                                                placeholder="Any special instructions or delivery preferences?"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary & Placement */}
                        <div className="mt-8 lg:mt-0 lg:col-span-5">
                            <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-sm">
                                <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>

                                <ul className="divide-y divide-slate-100 mb-6 max-h-[350px] overflow-y-auto pr-1">
                                    {cart?.items?.map((item) => (
                                        <li key={item.id} className="py-4 flex justify-between gap-4">
                                            <div className="flex-1">
                                                <h4 className="text-sm font-bold text-slate-900 leading-tight">
                                                    {item.product?.name}
                                                </h4>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <span className="text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-100 rounded-md px-2 py-0.5">Qty: {item.quantity}</span>
                                                    {item.size && (
                                                        <span className="text-[10px] font-bold text-orange-700 bg-orange-50 border border-orange-100 rounded-md px-2 py-0.5">Size: {item.size}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-sm font-bold text-slate-900 shrink-0">
                                                ৳{(parseFloat(item.price) * item.quantity).toFixed(2)}
                                            </p>
                                        </li>
                                    ))}
                                </ul>

                                <div className="border-t border-slate-100 pt-5 mt-5">
                                    <div className="flex justify-between items-center text-slate-900">
                                        <span className="text-base font-bold">Total Payable</span>
                                        <span className="text-2xl font-black text-orange-600">৳{total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing || !cart?.items?.length}
                                    className="w-full mt-8 bg-orange-600 hover:bg-orange-700 text-white rounded-xl py-4 px-6 text-base font-bold transition-all hover:shadow-lg hover:shadow-orange-600/20 active:scale-95 flex items-center justify-center disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none shadow-md"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Processing Order...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>Place Order</span>
                                            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
