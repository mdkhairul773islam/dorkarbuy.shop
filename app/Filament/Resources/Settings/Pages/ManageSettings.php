<?php

namespace App\Filament\Resources\Settings\Pages;

use App\Filament\Resources\Settings\SettingResource;
use App\Models\Setting;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;
use Filament\Schemas\Components\Tabs\Tab;
use Illuminate\Database\Eloquent\Builder;

class ManageSettings extends ManageRecords
{
    protected static string $resource = SettingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()
                ->mutateFormDataUsing(function (array $data): array {
                    $type = $data['type'] ?? 'text';
                    if (in_array($type, ['text', 'email', 'phone'])) {
                        $value = $data['value_text'] ?? null;
                    } else {
                        $value = $data['value_'.$type] ?? null;
                    }
                    $data['value'] = $value;
                    unset($data['value_text'], $data['value_textarea'], $data['value_richtext'], $data['value_image']);

                    return $data;
                })
                ->after(function () {
                    Setting::clearCache();
                }),
        ];
    }

    public function getTabs(): array
    {
        return [
            'all' => Tab::make('All Settings'),
            'general' => Tab::make('General')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('group', 'general'))
                ->badge(static::getResource()::getModel()::where('group', 'general')->count())
                ->badgeColor('success'),
            'appearance' => Tab::make('Appearance')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('group', 'appearance'))
                ->badge(static::getResource()::getModel()::where('group', 'appearance')->count())
                ->badgeColor('warning'),
            'contact' => Tab::make('Contact')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('group', 'contact'))
                ->badge(static::getResource()::getModel()::where('group', 'contact')->count())
                ->badgeColor('info'),
            'social' => Tab::make('Social Media')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('group', 'social'))
                ->badge(static::getResource()::getModel()::where('group', 'social')->count())
                ->badgeColor('danger'),
            'pages' => Tab::make('Pages')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('group', 'pages'))
                ->badge(static::getResource()::getModel()::where('group', 'pages')->count())
                ->badgeColor('gray'),
        ];
    }
}
