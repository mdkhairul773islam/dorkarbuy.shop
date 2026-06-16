<?php

namespace App\Filament\Resources\Products\Tables;

use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ProductsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('category.name')
                    ->searchable(),
                TextColumn::make('name')
                    ->searchable(),
                TextColumn::make('slug')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('type')
                    ->badge()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('price')
                    ->money('BDT')
                    ->sortable(),
                TextColumn::make('discount_price')
                    ->money('BDT')
                    ->sortable(),
                ImageColumn::make('image')
                    ->disk('public'),
                TextColumn::make('stock')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('author')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('duration')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                IconColumn::make('is_featured')
                    ->label('Featured')
                    ->icon(fn ($state) => $state ? 'heroicon-s-star' : 'heroicon-o-star')
                    ->color(fn ($state) => $state ? 'warning' : 'gray'),
                IconColumn::make('is_active')
                    ->label('Active')
                    ->icon(fn ($state) => $state ? 'heroicon-o-check-circle' : 'heroicon-o-x-circle')
                    ->color(fn ($state) => $state ? 'success' : 'gray'),
                IconColumn::make('digital_file')
                    ->label('Digital File')
                    ->icon(fn ($state) => $state ? 'heroicon-o-document-text' : 'heroicon-o-minus')
                    ->color(fn ($state) => $state ? 'success' : 'gray')
                    ->tooltip(fn ($record) => $record->digital_file ? 'PDF uploaded' : 'No digital file')
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                ActionGroup::make([
                    EditAction::make(),
                    Action::make('toggle_featured')
                        ->label(fn ($record) => $record->is_featured ? 'Remove Featured' : 'Make Featured')
                        ->icon(fn ($record) => $record->is_featured ? 'heroicon-o-star' : 'heroicon-s-star')
                        ->color('warning')
                        ->action(function ($record) {
                            $record->update(['is_featured' => ! $record->is_featured]);
                            Notification::make()
                                ->title($record->is_featured ? 'Product marked as featured' : 'Product removed from featured')
                                ->success()
                                ->send();
                        }),
                    Action::make('toggle_active')
                        ->label(fn ($record) => $record->is_active ? 'Deactivate Product' : 'Activate Product')
                        ->icon(fn ($record) => $record->is_active ? 'heroicon-o-eye-slash' : 'heroicon-o-eye')
                        ->color(fn ($record) => $record->is_active ? 'danger' : 'success')
                        ->action(function ($record) {
                            $record->update(['is_active' => ! $record->is_active]);
                            Notification::make()
                                ->title($record->is_active ? 'Product activated successfully' : 'Product deactivated successfully')
                                ->success()
                                ->send();
                        }),
                ])
                    ->icon('heroicon-m-ellipsis-vertical')
                    ->tooltip('Actions')
                    ->color('gray'),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
