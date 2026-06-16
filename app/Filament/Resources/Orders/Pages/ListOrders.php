<?php

namespace App\Filament\Resources\Orders\Pages;

use App\Filament\Resources\Orders\OrderResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
use Filament\Schemas\Components\Tabs\Tab;
use Illuminate\Database\Eloquent\Builder;

class ListOrders extends ListRecords
{
    protected static string $resource = OrderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }

    protected function getTableQuery(): Builder
    {
        return parent::getTableQuery()->with('payment', 'items');
    }

    public function getTabs(): array
    {
        return [
            'all' => Tab::make('All'),
            'pending' => Tab::make('Pending')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'pending'))
                ->badge(static::getResource()::getModel()::where('status', 'pending')->count())
                ->badgeColor('warning'),
            'processing' => Tab::make('Processing')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'processing'))
                ->badge(static::getResource()::getModel()::where('status', 'processing')->count())
                ->badgeColor('info'),
            'completed' => Tab::make('Completed')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'completed'))
                ->badge(static::getResource()::getModel()::where('status', 'completed')->count())
                ->badgeColor('success'),
            'digital' => Tab::make('Digital Orders')
                ->modifyQueryUsing(fn (Builder $query) => $query->whereHas('items.product', fn (Builder $q) => $q->whereNotNull('digital_file')))
                ->badge(static::getResource()::getModel()::whereHas('items.product', fn (Builder $q) => $q->whereNotNull('digital_file'))->count())
                ->badgeColor('primary'),
        ];
    }
}
