import { Head, Link, useForm } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import { useTranslation } from '../hooks/useTranslation';

export default function Payment({ auth, order, paymentMethod }) {
    const { __ } = useTranslation();
    const { data, setData, post, processing } = useForm({
        transaction_reference: '',
    });

    const handleConfirm = (e) => {
        e.preventDefault();
        post(`/payment/${order.id}/confirm`);
    };

    const getPaymentInstructions = () => {
        const merchantNumber = paymentMethod?.config?.merchant_number || '01XXXXXXXXX';
        
        switch (paymentMethod?.code) {
            case 'bkash':
                return {
                    steps: [
                        __('Open your bKash app'),
                        __('Select "Send Money"'),
                        `${__('Enter merchant number:')} ${merchantNumber}`,
                        `${__('Enter amount:')} ৳${order.total}`,
                        __('Enter your PIN and confirm'),
                        __('Note down the transaction ID'),
                        __('Enter the transaction ID below and click "Confirm Payment"')
                    ],
                    color: 'bg-pink-50 border-pink-100',
                    iconColor: 'text-pink-600'
                };
            case 'rocket':
                return {
                    steps: [
                        __('Dial *322# from your mobile'),
                        __('Select "Payment"'),
                        `${__('Enter merchant number:')} ${merchantNumber}`,
                        `${__('Enter amount:')} ৳${order.total}`,
                        __('Enter your PIN and confirm'),
                        __('Note down the transaction ID'),
                        __('Enter the transaction ID below and click "Confirm Payment"')
                    ],
                    color: 'bg-purple-50 border-purple-100',
                    iconColor: 'text-purple-600'
                };
            case 'nagad':
                return {
                    steps: [
                        __('Open your Nagad app'),
                        __('Select "Send Money"'),
                        `${__('Enter merchant number:')} ${merchantNumber}`,
                        `${__('Enter amount:')} ৳${order.total}`,
                        __('Enter your PIN and confirm'),
                        __('Note down the transaction ID'),
                        __('Enter the transaction ID below and click "Confirm Payment"')
                    ],
                    color: 'bg-orange-50 border-orange-100',
                    iconColor: 'text-orange-600'
                };
            case 'cash':
                return {
                    steps: [
                        __('Your order has been placed successfully'),
                        __('You will pay with cash when you receive your order'),
                        __('Our delivery person will contact you soon'),
                        __('Please keep the exact amount ready'),
                        __('Click "Confirm Order" below to proceed')
                    ],
                    color: 'bg-green-50 border-green-100',
                    iconColor: 'text-green-600'
                };
            default:
                return {
                    steps: [__('Complete your payment and confirm below')],
                    color: 'bg-slate-50 border-slate-100',
                    iconColor: 'text-slate-600'
                };
        }
    };

    const instructions = getPaymentInstructions();
    const isCashOnDelivery = paymentMethod?.code === 'cash';

    return (
        <Layout>
            <Head title={__('Complete Payment')} />

            <div className="min-h-screen bg-slate-50/50 py-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Success Message */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 mb-8 shadow-sm">
                        <div className="flex items-center">
                            <div className="shrink-0">
                                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-md shadow-emerald-500/10">
                                    <svg className="h-7 w-7 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-bold text-emerald-900">
                                    {__('Order Placed Successfully!')}
                                </h3>
                                <div className="mt-1 text-sm text-emerald-700">
                                    <p>{__('Order Number:')} <span className="font-extrabold text-emerald-900 text-base">#{order.order_number}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Instructions */}
                    <div className="bg-white shadow-sm rounded-2xl overflow-hidden mb-8 border border-slate-100">
                        <div className="px-6 py-5 bg-gradient-to-r from-orange-600 to-amber-500">
                            <h2 className="text-xl font-bold text-white tracking-tight">
                                {isCashOnDelivery ? __('Order Confirmation Badge') : __('Complete Your Payment Badge')}
                            </h2>
                            <p className="mt-1 text-sm text-orange-50">
                                {__('Payment Method:')} <span className="font-extrabold text-white">{paymentMethod?.name ? __(paymentMethod.name) : ''}</span>
                            </p>
                        </div>

                        <div className={`px-6 py-6 border-b border-slate-100 ${instructions.color}`}>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className={`shrink-0 ${instructions.iconColor}`}>
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <h3 className="text-base font-bold text-slate-900 mb-3">
                                            {isCashOnDelivery ? __('Instructions:') : __('Follow these steps:')}
                                        </h3>
                                        <div className="mt-2">
                                            <ol className="space-y-2.5">
                                                {instructions.steps.map((step, index) => (
                                                    <li key={index} className="flex items-start">
                                                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${instructions.iconColor} bg-white font-bold text-sm mr-3 shadow-sm flex-shrink-0`}>
                                                            {index + 1}
                                                        </span>
                                                        <span className="text-sm text-slate-700 pt-0.5">{step}</span>
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="px-6 py-5 bg-slate-50/50">
                            <h3 className="text-base font-bold text-slate-900 mb-4">{__('Order Summary')}</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 font-semibold">{__('Subtotal:')}</span>
                                    <span className="font-bold text-slate-900">৳{parseFloat(order.subtotal).toFixed(2)}</span>
                                </div>
                                {order.discount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-semibold">{__('Discount:')}</span>
                                        <span className="font-bold text-emerald-600">-৳{parseFloat(order.discount).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="border-t border-slate-200 pt-3 flex justify-between">
                                    <span className="text-base font-bold text-slate-900">{__('Total payable amount:')}</span>
                                    <span className="text-lg font-black text-orange-600">৳{parseFloat(order.total).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Confirmation Form */}
                    <div className="bg-white shadow-sm rounded-2xl p-6 sm:p-8 border border-slate-100">
                        <form onSubmit={handleConfirm} className="space-y-6">
                            {!isCashOnDelivery && (
                                <div>
                                    <label htmlFor="transaction_reference" className="block text-sm font-bold text-slate-700 mb-2">
                                        {__('Transaction ID / Reference Number')}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            id="transaction_reference"
                                            value={data.transaction_reference}
                                            onChange={(e) => setData('transaction_reference', e.target.value)}
                                            className="block w-full pl-11 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 text-sm"
                                            placeholder={__('e.g., TRX123456789')}
                                            required={!isCashOnDelivery}
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-slate-500 flex items-center">
                                        <svg className="w-4 h-4 mr-1.5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{__('Please enter the transaction ID you received after payment')}</span>
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center justify-between space-x-4 pt-4">
                                {auth?.user && (
                                    <Link
                                        href={`/orders/${order.order_number}`}
                                        className="inline-flex items-center px-6 py-3.5 border border-slate-200 shadow-sm text-sm font-bold rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-all duration-200"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {__('Pay Later')}
                                    </Link>
                                )}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 inline-flex justify-center items-center px-6 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-md hover:shadow-orange-600/20 text-base font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>{__('Confirming...')}</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{isCashOnDelivery ? __('Confirm Order') : __('Confirm Payment')}</span>
                                            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 border-t border-slate-100 pt-6">
                            <div className="flex items-center justify-center text-xs text-slate-500">
                                <svg className="w-5 h-5 mr-2 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <p className="text-center">
                                    {__('agree declaration 1')} {isCashOnDelivery ? __('reviewed') : __('completed')} {__('agree declaration 2')}
                                    {!isCashOnDelivery && ' ' + __('verify payment notice')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Help Section */}
                    <div className="mt-8 text-center">
                        <div className="inline-flex items-center justify-center px-6 py-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                            <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <p className="text-sm text-slate-600">
                                {__('Need help?')}{' '}
                                <a href="#" className="font-bold text-orange-600 hover:text-orange-800 underline transition-colors">
                                    {__('Contact Support')}
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
