import { Head, Link } from '@inertiajs/react';
import Layout from '../../Layouts/Layout';

export default function OrdersIndex({ orders }) {
    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-amber-100 text-amber-800 border-amber-200/50',
            processing: 'bg-blue-100 text-blue-800 border-blue-200/50',
            completed: 'bg-emerald-100 text-emerald-800 border-emerald-200/50',
            cancelled: 'bg-rose-100 text-rose-800 border-rose-200/50',
            refunded: 'bg-slate-100 text-slate-800 border-slate-200/50',
        };
        return colors[status] || 'bg-slate-100 text-slate-800 border-slate-200/50';
    };

    const getStatusIcon = (status) => {
        const icons = {
            pending: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            processing: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            ),
            completed: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            cancelled: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            refunded: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
            ),
        };
        return icons[status] || icons.pending;
    };

    const getPaymentStatusColor = (status) => {
        const colors = {
            pending: 'bg-amber-50 text-amber-700 border-amber-200/50',
            completed: 'bg-emerald-50 text-emerald-700 border-emerald-200/50',
            failed: 'bg-rose-50 text-rose-700 border-rose-200/50',
            refunded: 'bg-slate-50 text-slate-700 border-slate-200/50',
        };
        return colors[status] || 'bg-slate-50 text-slate-700 border-slate-200/50';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Layout>
            <Head title="My Orders" />

            <div className="bg-slate-50/50 min-h-screen py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">My Orders</h1>
                        <p className="text-sm text-slate-500">Track and manage your order history</p>
                    </div>

                    {orders?.data?.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-100 p-12 shadow-sm">
                            <div className="text-center">
                                <div className="mx-auto h-20 w-20 rounded-full bg-orange-100/60 flex items-center justify-center mb-6">
                                    <svg
                                        className="h-10 w-10 text-orange-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No orders yet</h3>
                                <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">
                                    Looks like you haven't placed any orders yet. Start exploring our collection!
                                </p>
                                <Link
                                    href="/products"
                                    className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-orange-600/20 transition-all duration-200 transform hover:scale-[1.01]"
                                >
                                    <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    Start Shopping
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders?.data?.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-white rounded-2xl border border-slate-100 hover:shadow-md transition-all duration-300 overflow-hidden shadow-sm"
                                >
                                    {/* Order Header */}
                                    <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0">
                                                    <div className="h-12 w-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                                                        <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-bold text-slate-900">
                                                        Order #{order.order_number}
                                                    </h3>
                                                    <p className="text-xs text-slate-500 flex items-center mt-1">
                                                        <svg className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {formatDate(order.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border capitalize ${getStatusColor(
                                                        order.status
                                                    )}`}
                                                >
                                                    {getStatusIcon(order.status)}
                                                    <span className="ml-1.5">{order.status}</span>
                                                </span>
                                                {order.payment && (
                                                    <span
                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border capitalize ${getPaymentStatusColor(
                                                            order.payment.status
                                                        )}`}
                                                    >
                                                        <svg className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                        </svg>
                                                        {order.payment.status}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items Preview */}
                                    <div className="px-6 py-5">
                                        <div className="space-y-4">
                                            {order.items?.slice(0, 2).map((item) => (
                                                <div key={item.id} className="flex items-center space-x-4">
                                                    <div className="flex-shrink-0 h-16 w-16 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden">
                                                        {item.product?.image ? (
                                                            <img
                                                                src={`/storage/${item.product.image}`}
                                                                alt={item.product_name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center">
                                                                <svg className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-slate-900 truncate">
                                                            {item.product_name}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            Qty: {item.quantity} × ৳{parseFloat(item.price).toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        <p className="text-sm font-bold text-slate-900">
                                                            ৳{parseFloat(item.total).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            {order.items?.length > 2 && (
                                                <div className="text-xs text-orange-600 font-bold pl-20">
                                                    +{order.items.length - 2} more item{order.items.length - 2 !== 1 ? 's' : ''}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Order Footer */}
                                    <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div className="flex items-center space-x-6">
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Items</p>
                                                    <p className="text-base font-bold text-slate-900 mt-0.5">
                                                        {order.items?.length}
                                                    </p>
                                                </div>
                                                <div className="h-8 w-px bg-slate-200"></div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Amount</p>
                                                    <p className="text-lg font-black text-orange-600 mt-0.5">
                                                        ৳{parseFloat(order.total).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-3">
                                                {order.payment?.status === 'pending' && (
                                                    <Link
                                                        href={`/payment/${order.id}`}
                                                        className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-emerald-600/20 transition-all duration-200"
                                                    >
                                                        <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                        </svg>
                                                        Pay Now
                                                    </Link>
                                                )}
                                                <Link
                                                    href={`/orders/${order.order_number}`}
                                                    className="inline-flex items-center px-4 py-2 border border-orange-600 text-orange-600 hover:bg-orange-50 bg-white text-xs font-bold rounded-xl shadow-sm transition-all duration-200"
                                                >
                                                    <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Pagination */}
                            {orders?.links && orders.links.length > 3 && (
                                <div className="mt-8 flex justify-center">
                                    <nav className="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px bg-white border border-slate-200 overflow-hidden">
                                        {orders.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                preserveScroll
                                                className={`relative inline-flex items-center px-4 py-3 text-xs font-bold transition-all duration-200 ${
                                                    link.active
                                                        ? 'z-10 bg-orange-600 text-white'
                                                        : 'text-slate-700 hover:bg-orange-50 hover:text-orange-600'
                                                } ${!link.url ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${
                                                    index !== 0 ? 'border-l border-slate-200' : ''
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
