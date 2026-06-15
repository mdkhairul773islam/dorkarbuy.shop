<?php

namespace App\Filament\Resources\Orders\Schemas;

use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class OrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->relationship('user', 'name')
                    ->required(),
                TextInput::make('order_number')
                    ->required(),
                Select::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'processing' => 'Processing',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled',
                        'refunded' => 'Refunded',
                    ])
                    ->default('pending')
                    ->required(),
                TextInput::make('subtotal')
                    ->required()
                    ->numeric(),
                TextInput::make('tax')
                    ->required()
                    ->numeric()
                    ->default(0.0),
                TextInput::make('discount')
                    ->required()
                    ->numeric()
                    ->default(0.0),
                TextInput::make('total')
                    ->required()
                    ->numeric(),
                TextInput::make('customer_name')
                    ->required(),
                TextInput::make('customer_email')
                    ->email()
                    ->required(),
                TextInput::make('customer_phone')
                    ->tel()
                    ->required(),
                Textarea::make('customer_address')
                    ->default(null)
                    ->columnSpanFull(),
                Textarea::make('notes')
                    ->default(null)
                    ->columnSpanFull(),

                Repeater::make('items')
                    ->relationship('items')
                    ->schema([
                        TextInput::make('product_name')
                            ->disabled()
                            ->label('Product Name'),
                        TextInput::make('size')
                            ->disabled()
                            ->label('Size'),
                        TextInput::make('price')
                            ->disabled()
                            ->numeric()
                            ->prefix('৳')
                            ->label('Price'),
                        TextInput::make('quantity')
                            ->disabled()
                            ->numeric()
                            ->label('Qty'),
                        TextInput::make('total')
                            ->disabled()
                            ->numeric()
                            ->prefix('৳')
                            ->label('Total'),
                    ])
                    ->columns(5)
                    ->disabled()
                    ->deletable(false)
                    ->addable(false)
                    ->label('Ordered Items')
                    ->columnSpanFull(),
            ]);
    }
}
