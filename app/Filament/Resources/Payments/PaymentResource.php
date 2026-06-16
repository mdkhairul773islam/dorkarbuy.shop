<?php

namespace App\Filament\Resources\Payments;

use App\Filament\Resources\Payments\Pages\ManagePayments;
use App\Mail\OrderDigitalProductMail;
use App\Models\Payment;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Mail;

class PaymentResource extends Resource
{
    protected static ?string $model = Payment::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCreditCard;

    protected static ?string $recordTitleAttribute = 'transaction_id';

    protected static ?string $navigationLabel = 'Payments';

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('status', 'pending')->count() ?: null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return static::getModel()::where('status', 'pending')->exists() ? 'warning' : null;
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                // Payment Information
                TextInput::make('transaction_id')
                    ->disabled()
                    ->label('Transaction ID')
                    ->columnSpanFull(),

                TextInput::make('order_number_display')
                    ->disabled()
                    ->label('Order Number')
                    ->dehydrated(false)
                    ->formatStateUsing(fn ($record) => $record?->order?->order_number ?? 'N/A'),

                TextInput::make('payment_method')
                    ->disabled()
                    ->label('Payment Method')
                    ->formatStateUsing(fn ($state) => match ($state) {
                        'bkash' => 'bKash',
                        'rocket' => 'Rocket',
                        'nagad' => 'Nagad',
                        'cash' => 'Cash on Delivery',
                        default => $state ? ucfirst($state) : 'N/A',
                    }),

                TextInput::make('amount')
                    ->disabled()
                    ->prefix('৳')
                    ->label('Amount'),

                Select::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'completed' => 'Completed',
                        'failed' => 'Failed',
                        'refunded' => 'Refunded',
                    ])
                    ->required()
                    ->label('Payment Status'),

                DateTimePicker::make('paid_at')
                    ->label('Paid At'),

                // Customer Information
                TextInput::make('customer_name_display')
                    ->disabled()
                    ->label('Customer Name')
                    ->dehydrated(false)
                    ->formatStateUsing(fn ($record) => $record?->order?->customer_name ?? 'N/A'),

                TextInput::make('customer_email_display')
                    ->disabled()
                    ->label('Customer Email')
                    ->dehydrated(false)
                    ->formatStateUsing(fn ($record) => $record?->order?->customer_email ?? 'N/A'),

                TextInput::make('customer_phone_display')
                    ->disabled()
                    ->label('Customer Phone')
                    ->dehydrated(false)
                    ->formatStateUsing(fn ($record) => $record?->order?->customer_phone ?? 'N/A'),

                Textarea::make('customer_address_display')
                    ->disabled()
                    ->label('Customer Address')
                    ->rows(3)
                    ->dehydrated(false)
                    ->columnSpanFull()
                    ->formatStateUsing(fn ($record) => $record?->order?->customer_address ?? 'N/A'),

                // Transaction Details
                TextInput::make('transaction_reference_display')
                    ->disabled()
                    ->label('Transaction Reference')
                    ->dehydrated(false)
                    ->formatStateUsing(fn ($record) => $record?->payment_details['transaction_reference'] ?? 'N/A'),

                TextInput::make('confirmed_at_display')
                    ->disabled()
                    ->label('Confirmed At')
                    ->dehydrated(false)
                    ->formatStateUsing(fn ($record) => $record?->payment_details['confirmed_at'] ?? 'N/A'),

                Textarea::make('payment_details_display')
                    ->disabled()
                    ->label('Payment Details')
                    ->rows(6)
                    ->dehydrated(false)
                    ->columnSpanFull()
                    ->formatStateUsing(function ($record) {
                        if (! $record || ! $record->payment_details) {
                            return 'No payment details available';
                        }

                        $details = $record->payment_details;
                        $text = '';

                        if (isset($details['transaction_reference'])) {
                            $text .= 'Transaction Reference: '.$details['transaction_reference']."\n";
                        }

                        if (isset($details['confirmed_at'])) {
                            $text .= 'Confirmed At: '.$details['confirmed_at']."\n";
                        }

                        // Add any other details
                        foreach ($details as $key => $value) {
                            if (! in_array($key, ['transaction_reference', 'confirmed_at'])) {
                                $text .= ucfirst(str_replace('_', ' ', $key)).': '.(is_array($value) ? json_encode($value) : $value)."\n";
                            }
                        }

                        return $text ?: 'No additional details';
                    }),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('transaction_id')
            ->columns([
                TextColumn::make('transaction_id')
                    ->searchable()
                    ->sortable()
                    ->label('Transaction ID')
                    ->copyable(),

                TextColumn::make('order.order_number')
                    ->searchable()
                    ->sortable()
                    ->label('Order Number')
                    ->url(fn (Payment $record) => $record->order ? route('filament.admin.resources.orders.edit', $record->order) : null),

                TextColumn::make('order.customer_name')
                    ->searchable()
                    ->label('Customer')
                    ->limit(25)
                    ->tooltip(fn ($state) => $state),

                TextColumn::make('payment_method')
                    ->badge()
                    ->label('Method')
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'bkash' => 'bKash',
                        'rocket' => 'Rocket',
                        'nagad' => 'Nagad',
                        'cash' => 'Cash on Delivery',
                        default => ucfirst($state),
                    }),

                TextColumn::make('amount')
                    ->money('BDT')
                    ->sortable()
                    ->label('Amount'),

                TextColumn::make('status')
                    ->badge()
                    ->sortable()
                    ->label('Status')
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'completed' => 'success',
                        'failed' => 'danger',
                        'refunded' => 'info',
                        default => 'gray',
                    }),

                TextColumn::make('paid_at')
                    ->dateTime()
                    ->sortable()
                    ->label('Paid At')
                    ->toggleable(),

                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->label('Created At')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'completed' => 'Completed',
                        'failed' => 'Failed',
                        'refunded' => 'Refunded',
                    ]),
                SelectFilter::make('payment_method')
                    ->options([
                        'bkash' => 'bKash',
                        'rocket' => 'Rocket',
                        'nagad' => 'Nagad',
                        'cash' => 'Cash on Delivery',
                    ]),
            ])
            ->recordActions([
                ActionGroup::make([
                    Action::make('approve_payment')
                        ->label('Approve')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->requiresConfirmation()
                        ->modalHeading('Approve Payment')
                        ->modalDescription(fn (Payment $record) => 'Are you sure you want to approve the payment of BDT '.number_format($record->amount, 2)." for Order #{$record->order?->order_number}?")
                        ->action(function (Payment $record): void {
                            $record->update([
                                'status' => 'completed',
                                'paid_at' => now(),
                            ]);

                            if ($record->order) {
                                $hasPhysical = $record->order->items->some(fn ($item) => ! $item->product || ! $item->product->digital_file);
                                $newStatus = $hasPhysical ? 'processing' : 'completed';
                                $record->order->update(['status' => $newStatus]);

                                $hasDigital = $record->order->items->some(fn ($item) => $item->product && $item->product->digital_file);
                                if ($hasDigital && filled($record->order->customer_email)) {
                                    try {
                                        Mail::to($record->order->customer_email)
                                            ->send(new OrderDigitalProductMail($record->order));

                                        $record->order->update(['digital_sent_at' => now()]);
                                    } catch (\Exception $e) {
                                        // Handle email failure silently or log
                                    }
                                }
                            }

                            Notification::make()
                                ->title('Payment approved successfully')
                                ->success()
                                ->send();
                        })
                        ->visible(fn (Payment $record): bool => $record->status === 'pending'),
                    ViewAction::make(),
                    EditAction::make(),
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
            'index' => ManagePayments::route('/'),
        ];
    }
}
