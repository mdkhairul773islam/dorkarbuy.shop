<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        // 1. Calculate sales/revenue trend for last 7 days
        $revenueChartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $revenueChartData[] = (float) Payment::where('status', 'completed')
                ->whereDate('created_at', now()->subDays($i))
                ->sum('amount');
        }

        // 2. Calculate orders trend for last 7 days
        $ordersChartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $ordersChartData[] = (int) Order::whereDate('created_at', now()->subDays($i))->count();
        }

        $totalRevenue = Payment::where('status', 'completed')->sum('amount');
        $todayRevenue = Payment::where('status', 'completed')
            ->whereDate('created_at', today())
            ->sum('amount');
        $totalOrders = Order::count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $completedOrders = Order::where('status', 'completed')->count();
        $activeProducts = Product::where('is_active', true)->count();
        $inactiveProducts = Product::where('is_active', false)->count();

        return [
            Stat::make('Total Revenue', '৳ '.number_format($totalRevenue, 2))
                ->description('All time completed payments')
                ->descriptionIcon('heroicon-o-banknotes')
                ->chart($revenueChartData)
                ->color('success'),

            Stat::make('Today Revenue', '৳ '.number_format($todayRevenue, 2))
                ->description('Completed today')
                ->descriptionIcon('heroicon-o-arrow-trending-up')
                ->color('success'),

            Stat::make('Total Orders', $totalOrders)
                ->description('Order volume (last 7 days trend)')
                ->descriptionIcon('heroicon-o-shopping-cart')
                ->chart($ordersChartData)
                ->color('info'),

            Stat::make('Pending Orders', $pendingOrders)
                ->description($pendingOrders > 0 ? 'Requires attention' : 'All caught up')
                ->descriptionIcon($pendingOrders > 0 ? 'heroicon-o-exclamation-triangle' : 'heroicon-o-check-circle')
                ->color($pendingOrders > 0 ? 'warning' : 'success'),

            Stat::make('Active Products', $activeProducts)
                ->description("{$inactiveProducts} products are inactive")
                ->descriptionIcon('heroicon-o-cube')
                ->color('primary'),
        ];
    }
}
