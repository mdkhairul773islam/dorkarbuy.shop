import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import Layout from '../../Layouts/Layout';
import { useTranslation } from '../../hooks/useTranslation';

export default function ShowOrder({ auth, order }) {
    const { __, locale } = useTranslation();
    const { flash } = usePage().props;

    useEffect(() => {
        if (typeof fbq !== 'undefined' && flash?.fb_event?.type === 'Purchase') {
            const { event_id, data } = flash.fb_event;
            fbq('track', 'Purchase', data, { eventID: event_id });
        }
    }, [flash?.fb_event]);

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

    const getPaymentStatusColor = (status) => {
        const colors = {
            pending: 'bg-amber-100 text-amber-800 border-amber-200/50',
            completed: 'bg-emerald-100 text-emerald-800 border-emerald-200/50',
            failed: 'bg-rose-100 text-rose-800 border-rose-200/50',
            refunded: 'bg-slate-100 text-slate-800 border-slate-200/50',
        };
        return colors[status] || 'bg-slate-100 text-slate-800 border-slate-200/50';
    };

    return (
        <Layout>
            <Head title={`${__('Order')} ${order.order_number}`} />

            <div className="bg-slate-50/50 min-h-screen py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <Link href="/orders" className="inline-flex items-center text-sm font-bold text-orange-600 hover:text-orange-500 transition-colors">
                            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            {__('Back to Orders')}
                        </Link>
                    </div>

                    <div className="space-y-6">
                        {/* Order Header */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 sm:px-8">
                                <h3 className="text-lg font-bold text-slate-900">
                                    {__('Order details for')} #{order.order_number}
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    {__('Placed on')} {new Date(order.created_at).toLocaleDateString(locale === 'bn' ? 'bn-BD' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                            <div className="px-6 py-5 sm:px-8">
                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider">{__('Status')}</dt>
                                        <dd className="mt-1">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full capitalize border ${getStatusColor(order.status)}`}>
                                                {__(order.status)}
                                            </span>
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider">{__('Customer Name')}</dt>
                                        <dd className="mt-1 text-sm font-bold text-slate-900">
                                            {order.customer_name}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider">{__('Email Address')}</dt>
                                        <dd className="mt-1 text-sm font-bold text-slate-900 break-all">
                                            {order.customer_email}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider">{__('Phone Number')}</dt>
                                        <dd className="mt-1 text-sm font-bold text-slate-900">
                                            {order.customer_phone}
                                        </dd>
                                    </div>
                                    {order.customer_address && (
                                        <div className="md:col-span-2">
                                            <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider">{__('Delivery Address')}</dt>
                                            <dd className="mt-1 text-sm font-bold text-slate-900">
                                                {order.customer_address}
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 sm:px-8">
                                <h3 className="text-lg font-bold text-slate-900">{__('Order Items')}</h3>
                            </div>
                            <div>
                                <ul className="divide-y divide-slate-100">
                                    {order.items.map((item) => (
                                        <li key={item.id} className="px-6 py-5 sm:px-8">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    {item.product?.image ? (
                                                        <img
                                                            src={`/storage/${item.product.image}`}
                                                            alt={item.product_name}
                                                            className="h-16 w-16 rounded-xl object-cover border border-slate-100 shadow-sm"
                                                        />
                                                    ) : (
                                                        <div className="h-16 w-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                                                            <span className="text-xs text-slate-400">{__('No image')}</span>
                                                        </div>
                                                    )}
                                                    <div className="ml-4">
                                                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                                                            {item.product_name}
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2 mt-1.5">
                                                            <span className="text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-100 rounded-md px-2 py-0.5 capitalize">{item.product_type}</span>
                                                            {item.size && (
                                                                <span className="text-[10px] font-bold text-orange-700 bg-orange-50 border border-orange-100 rounded-md px-2 py-0.5">{__('Size:')} {item.size}</span>
                                                            )}
                                                            <span className="text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-100 rounded-md px-2 py-0.5">{__('Qty:')} {item.quantity}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-sm font-bold text-slate-900">
                                                    ৳{parseFloat(item.total).toFixed(2)}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Payment Info */}
                        {order.payment && (
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-100 sm:px-8 flex flex-wrap justify-between items-center gap-4">
                                    <h3 className="text-lg font-bold text-slate-900">{__('Payment Information')}</h3>
                                    {order.payment.status === 'pending' && (
                                        <Link
                                            href={`/payment/${order.id}`}
                                            className="inline-flex items-center px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-orange-600/20 transition-all active:scale-95 space-x-2"
                                        >
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                            <span>{__('Complete Payment')}</span>
                                        </Link>
                                    )}
                                </div>
                                <div>
                                    <dl className="px-6 py-5 sm:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider">{__('Payment Method')}</dt>
                                            <dd className="mt-1 text-sm font-bold text-slate-900 uppercase">
                                                {__(order.payment.payment_method)}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider">{__('Payment Status')}</dt>
                                            <dd className="mt-1">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full capitalize border ${getPaymentStatusColor(order.payment.status)}`}>
                                                    {__(order.payment.status)}
                                                </span>
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider">{__('Transaction ID')}</dt>
                                            <dd className="mt-1 text-sm font-bold text-slate-900 break-all">
                                                {order.payment.transaction_id || 'N/A'}
                                            </dd>
                                        </div>
                                        
                                        {order.payment.status === 'pending' && (
                                            <div className="md:col-span-3 bg-amber-50 border border-amber-100 rounded-xl p-4 flex">
                                                <div className="shrink-0">
                                                    <svg className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-semibold text-amber-800">
                                                        {__('Your payment is pending. Please complete the payment to process your order.')}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                            </div>
                        )}

                        {/* Order Summary */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden max-w-xl ml-auto">
                            <div className="px-6 py-5 border-b border-slate-100 sm:px-8">
                                <h3 className="text-lg font-bold text-slate-900">{__('Order Summary')}</h3>
                            </div>
                            <div className="px-6 py-5 sm:px-8">
                                <dl className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <dt className="font-semibold text-slate-500">{__('Subtotal')}</dt>
                                        <dd className="font-bold text-slate-900">
                                            ৳{parseFloat(order.subtotal).toFixed(2)}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <dt className="font-semibold text-slate-500">{__('Tax')}</dt>
                                        <dd className="font-bold text-slate-900">
                                            ৳{parseFloat(order.tax).toFixed(2)}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <dt className="font-semibold text-slate-500">{__('Discount')}</dt>
                                        <dd className="font-bold text-slate-900">
                                            ৳{parseFloat(order.discount).toFixed(2)}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                                        <dt className="text-base font-bold text-slate-900">{__('Total')}</dt>
                                        <dd className="text-xl font-black text-orange-600">
                                            ৳{parseFloat(order.total).toFixed(2)}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
