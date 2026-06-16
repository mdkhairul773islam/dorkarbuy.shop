<?php

namespace App\Filament\Resources\PaymentMethods;

use App\Filament\Resources\PaymentMethods\Pages\ManagePaymentMethods;
use App\Models\PaymentMethod;
use BackedEnum;
use Filament\Actions\ActionGroup;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;

class PaymentMethodResource extends Resource
{
    protected static ?string $model = PaymentMethod::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBanknotes;

    protected static ?string $recordTitleAttribute = 'name';

    protected static ?string $navigationLabel = 'Payment Methods';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Basic Details')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextInput::make('name')
                                    ->required()
                                    ->maxLength(255)
                                    ->label('Payment Method Name')
                                    ->placeholder('e.g., bKash, Rocket, Nagad'),

                                TextInput::make('code')
                                    ->required()
                                    ->maxLength(50)
                                    ->unique(ignoreRecord: true)
                                    ->label('Code')
                                    ->placeholder('e.g., bkash, rocket, nagad')
                                    ->helperText('Unique identifier for this payment method'),
                            ]),

                        Textarea::make('description')
                            ->maxLength(500)
                            ->label('Description')
                            ->placeholder('Brief description of this payment method')
                            ->rows(3),

                        TextInput::make('sort_order')
                            ->numeric()
                            ->default(1)
                            ->minValue(1)
                            ->label('Sort Order')
                            ->helperText('Display order (lower numbers appear first)'),
                    ]),

                Section::make('Branding & Configuration')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                FileUpload::make('logo')
                                    ->image()
                                    ->maxSize(1024)
                                    ->label('Logo')
                                    ->directory('payment-logos')
                                    ->helperText('Upload payment method logo (max 1MB)'),

                                Toggle::make('is_active')
                                    ->default(true)
                                    ->label('Active Status')
                                    ->helperText('Enable/disable this payment method'),
                            ]),

                        KeyValue::make('config')
                            ->label('Configuration')
                            ->keyLabel('Key')
                            ->valueLabel('Value')
                            ->helperText('Additional configuration (e.g., merchant_number, api_key)'),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->label('Name'),

                TextColumn::make('code')
                    ->searchable()
                    ->sortable()
                    ->badge()
                    ->label('Code'),

                TextColumn::make('description')
                    ->limit(50)
                    ->label('Description'),

                ToggleColumn::make('is_active')
                    ->sortable()
                    ->label('Active'),

                TextColumn::make('sort_order')
                    ->sortable()
                    ->label('Order'),

                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true)
                    ->label('Created At'),
            ])
            ->defaultSort('sort_order', 'asc')
            ->filters([
                //
            ])
            ->recordActions([
                ActionGroup::make([
                    EditAction::make(),
                    DeleteAction::make(),
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

    public static function getPages(): array
    {
        return [
            'index' => ManagePaymentMethods::route('/'),
        ];
    }
}
