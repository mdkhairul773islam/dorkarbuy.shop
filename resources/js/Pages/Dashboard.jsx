import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import Layout from '../Layouts/Layout';
import { useTranslation } from '../hooks/useTranslation';

export default function Dashboard() {
    const { auth, flash, locale } = usePage().props;
    const { __ } = useTranslation();

    useEffect(() => {
        if (typeof fbq !== 'undefined' && flash?.fb_event?.type === 'CompleteRegistration') {
            const { event_id, data } = flash.fb_event;
            fbq('track', 'CompleteRegistration', data, { eventID: event_id });
        }
    }, [flash?.fb_event]);

    return (
        <Layout>
            <Head title={__('Dashboard')} />

            <div className="bg-slate-50/50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/10">
                                <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div className="ml-5">
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                                    {__('Welcome back')}, {auth.user.name}! 👋
                                </h1>
                                <p className="mt-2 text-slate-500 text-sm sm:text-base">
                                    {__('Dashboard subtitle')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* My Orders Card */}
                        <Link
                            href="/orders"
                            className="group bg-white overflow-hidden shadow-sm rounded-2xl hover:shadow-md transition-all duration-300 border border-slate-100 transform hover:-translate-y-0.5"
                        >
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="shrink-0 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 shadow-md shadow-orange-500/10 group-hover:scale-105 transition-transform duration-300">
                                        <svg
                                            className="h-7 w-7 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                {__('My Orders')}
                                            </dt>
                                            <dd className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                                                {__('View all orders')}
                                            </dd>
                                        </dl>
                                    </div>
                                    <svg className="w-5 h-5 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>

                        {/* Profile Card */}
                        <Link
                            href="/profile"
                            className="group bg-white overflow-hidden shadow-sm rounded-2xl hover:shadow-md transition-all duration-300 border border-slate-100 transform hover:-translate-y-0.5"
                        >
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="shrink-0 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 shadow-md shadow-emerald-500/10 group-hover:scale-105 transition-transform duration-300">
                                        <svg
                                            className="h-7 w-7 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                {__('My Profile')}
                                            </dt>
                                            <dd className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                                                {__('Update info')}
                                            </dd>
                                        </dl>
                                    </div>
                                    <svg className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>

                        {/* Browse Products Card */}
                        <Link
                            href="/products"
                            className="group bg-white overflow-hidden shadow-sm rounded-2xl hover:shadow-md transition-all duration-300 border border-slate-100 transform hover:-translate-y-0.5"
                        >
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="shrink-0 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl p-4 shadow-md shadow-violet-500/10 group-hover:scale-105 transition-transform duration-300">
                                        <svg
                                            className="h-7 w-7 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                {__('Browse Products')}
                                            </dt>
                                            <dd className="text-lg font-bold text-slate-900 group-hover:text-violet-600 transition-colors">
                                                {__('Shop now')}
                                            </dd>
                                        </dl>
                                    </div>
                                    <svg className="w-5 h-5 text-slate-400 group-hover:text-violet-600 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Account Information */}
                    <div className="mt-8 bg-white shadow-sm rounded-2xl overflow-hidden border border-slate-100">
                        <div className="px-6 py-5 bg-gradient-to-r from-orange-600 to-amber-500">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                    </svg>
                                </div>
                                <h2 className="ml-4 text-xl font-bold text-white tracking-tight">
                                    {__('Account Information')}
                                </h2>
                            </div>
                        </div>
                        
                        <div className="p-6 sm:p-8 bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Name */}
                                <div className="flex items-center p-4 bg-slate-50/50 rounded-xl border border-slate-100 hover:shadow-sm transition-all duration-200">
                                    <div className="shrink-0">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/10">
                                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{__('Full Name')}</p>
                                        <p className="text-base font-bold text-slate-900 mt-0.5">{auth.user.name}</p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-center p-4 bg-slate-50/50 rounded-xl border border-slate-100 hover:shadow-sm transition-all duration-200">
                                    <div className="shrink-0">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md shadow-green-500/10">
                                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{__('Email Address')}</p>
                                        <p className="text-base font-bold text-slate-900 mt-0.5 break-all">{auth.user.email}</p>
                                    </div>
                                </div>

                                {/* Member Since */}
                                <div className="flex items-center p-4 bg-slate-50/50 rounded-xl border border-slate-100 hover:shadow-sm transition-all duration-200">
                                    <div className="shrink-0">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md shadow-purple-500/10">
                                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{__('Member Since')}</p>
                                        <p className="text-base font-bold text-slate-900 mt-0.5">
                                            {new Date(auth.user.created_at).toLocaleDateString(locale === 'bn' ? 'bn-BD' : 'en-US', { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Edit Profile Button */}
                            <div className="mt-8 border-t border-slate-100 pt-6">
                                <Link
                                    href="/profile"
                                    className="inline-flex justify-center items-center px-6 py-3.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-md hover:shadow-orange-600/20 text-sm font-bold transition-all active:scale-95 space-x-2"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    <span>{__('Edit Profile Settings')}</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
