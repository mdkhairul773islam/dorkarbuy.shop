<?php

namespace App\Filament\Resources\Orders\Tables;

use App\Mail\OrderDigitalProductMail;
use Filament\Actions\Action;
use Filament\Actions\BulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Mail;

class OrdersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('order_number')
                    ->searchable()
                    ->sortable()
                    ->label('Order #')
                    ->copyable(),

                TextColumn::make('user.name')
                    ->searchable()
                    ->label('User')
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('customer_name')
                    ->searchable()
                    ->label('Customer'),

                TextColumn::make('status')
                    ->badge()
                    ->sortable()
                    ->label('Order Status')
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'processing' => 'info',
                        'completed' => 'success',
                        'cancelled' => 'danger',
                        default => 'gray',
                    }),

                TextColumn::make('payment.status')
                    ->badge()
                    ->sortable()
                    ->label('Payment Status')
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'completed' => 'success',
                        'failed' => 'danger',
                        'refunded' => 'info',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => ucfirst($state)),

                TextColumn::make('payment.payment_method')
                    ->label('Payment Method')
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'bkash' => 'bKash',
                        'rocket' => 'Rocket',
                        'nagad' => 'Nagad',
                        'cash' => 'Cash',
                        default => ucfirst($state),
                    })
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('total')
                    ->money('BDT')
                    ->sortable()
                    ->label('Total'),

                TextColumn::make('customer_phone')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('customer_email')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->label('Created')
                    ->toggleable(isToggledHiddenByDefault: true),

                IconColumn::make('digital_sent_at')
                    ->label('File Sent')
                    ->icon(fn ($state) => $state ? 'heroicon-o-check-circle' : 'heroicon-o-x-circle')
                    ->color(fn ($state) => $state ? 'success' : 'gray')
                    ->tooltip(fn ($record) => $record->digital_sent_at
                        ? 'Sent: '.$record->digital_sent_at->format('d M Y, h:i A')
                        : 'Not sent yet'
                    ),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('status')
                    ->label('Order Status')
                    ->options([
                        'pending' => 'Pending',
                        'processing' => 'Processing',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled',
                    ]),
                SelectFilter::make('payment.status')
                    ->label('Payment Status')
                    ->options([
                        'pending' => 'Pending',
                        'completed' => 'Completed',
                        'failed' => 'Failed',
                        'refunded' => 'Refunded',
                    ]),
            ])
            ->recordActions([
                Action::make('send_email')
                    ->label(fn ($record) => $record->digital_sent_at ? 'Resend Email' : 'Send Email')
                    ->icon('heroicon-o-envelope')
                    ->color(fn ($record) => $record->digital_sent_at ? 'gray' : 'primary')
                    ->requiresConfirmation()
                    ->modalHeading(fn ($record) => 'Send Digital File to '.$record->customer_name)
                    ->modalDescription(fn ($record) => 'This will send the PDF file(s) to '.$record->customer_email.'.')
                    ->modalSubmitActionLabel('Send Now')
                    ->action(function ($record): void {
                        $record->load('items.product');

                        try {
                            Mail::to($record->customer_email)
                                ->send(new OrderDigitalProductMail($record));

                            $record->update(['digital_sent_at' => now()]);

                            Notification::make()
                                ->title('Email sent successfully!')
                                ->success()
                                ->send();
                        } catch (\Exception $e) {
                            Notification::make()
                                ->title('Failed to send email')
                                ->body($e->getMessage())
                                ->danger()
                                ->send();
                        }
                    })
                    ->visible(fn ($record): bool => filled($record->customer_email)
                        && $record->payment?->status === 'completed'
                        && $record->items->some(
                            fn ($item) => $item->product && $item->product->digital_file
                        )),
                Action::make('whatsapp')
                    ->label('WhatsApp')
                    ->icon('heroicon-o-chat-bubble-left-ellipsis')
                    ->color('success')
                    ->url(function ($record): string {
                        $phone = preg_replace('/\D/', '', $record->customer_phone);
                        if (str_starts_with($phone, '0') && strlen($phone) === 11) {
                            $phone = '880'.substr($phone, 1);
                        }

                        $productList = $record->items->map(
                            fn ($item) => '• '.$item->product_name.' (x'.$item->quantity.')'
                        )->implode("\n");

                        $message = "প্রিয় স্যার/ম্যাডাম,\n\n"
                        ."অর্ডার নম্বর: *{$record->order_number}*\n\n"
                        ."আপনার ক্রয়কৃত পণ্যসমূহ:\n{$productList}\n\n"
                        .'মোট মূল্য: *৳'.number_format($record->total, 2)."*\n\n"
                        ."─────────────────────\n\n"
                        ."আপনার ডিজিটাল ফাইল(গুলো) আপনার ইমেইলে পাঠানো হয়েছে।\n"
                        ."ইমেইল: {$record->customer_email}\n\n"
                        ."দয়া করে আপনার *Inbox* চেক করুন।\n"
                        ."যদি ইমেইল না পান তাহলে *Spam/Junk* ফোল্ডার চেক করুন।\n\n"
                        ."─────────────────────\n\n"
                        .'আমাদের সাথে কেনাকাটা করার জন্য আপনাকে ধন্যবাদ!';

                        return 'https://wa.me/'.$phone.'?text='.rawurlencode($message);
                    })
                    ->openUrlInNewTab()
                    ->visible(fn ($record): bool => filled($record->customer_phone)),
                Action::make('verify_payment')
                    ->label('Verify Payment')
                    ->icon('heroicon-o-check-badge')
                    ->color('success')
                    ->requiresConfirmation()
                    ->modalHeading('Verify and Approve Payment')
                    ->modalDescription(fn ($record) => "This will mark the payment for Order #{$record->order_number} as Completed, change order status, and dispatch digital downloads if applicable.")
                    ->action(function ($record): void {
                        $record->load('payment', 'items.product');

                        if ($record->payment) {
                            $record->payment->update([
                                'status' => 'completed',
                                'paid_at' => now(),
                            ]);
                        }

                        $hasPhysical = $record->items->some(fn ($item) => ! $item->product || ! $item->product->digital_file);
                        $newStatus = $hasPhysical ? 'processing' : 'completed';

                        $record->update(['status' => $newStatus]);

                        $hasDigital = $record->items->some(fn ($item) => $item->product && $item->product->digital_file);
                        if ($hasDigital && filled($record->customer_email)) {
                            try {
                                Mail::to($record->customer_email)
                                    ->send(new OrderDigitalProductMail($record));

                                $record->update(['digital_sent_at' => now()]);

                                Notification::make()
                                    ->title('Payment verified & digital files emailed!')
                                    ->success()
                                    ->send();
                            } catch (\Exception $e) {
                                Notification::make()
                                    ->title('Payment verified, but email delivery failed')
                                    ->body($e->getMessage())
                                    ->warning()
                                    ->send();
                            }
                        } else {
                            Notification::make()
                                ->title('Payment verified successfully!')
                                ->success()
                                ->send();
                        }
                    })
                    ->visible(fn ($record): bool => $record->payment && $record->payment->status === 'pending'),
                Action::make('mark_processing')
                    ->label('Mark Processing')
                    ->icon('heroicon-o-arrow-path')
                    ->color('info')
                    ->action(function ($record): void {
                        $record->update(['status' => 'processing']);

                        Notification::make()
                            ->title('Order marked as processing')
                            ->success()
                            ->send();
                    })
                    ->visible(fn ($record): bool => $record->status === 'pending'),
                Action::make('mark_completed')
                    ->label('Mark Completed')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->action(function ($record): void {
                        $record->update(['status' => 'completed']);

                        Notification::make()
                            ->title('Order marked as completed')
                            ->success()
                            ->send();
                    })
                    ->visible(fn ($record): bool => in_array($record->status, ['pending', 'processing'])),
                Action::make('cancel_order')
                    ->label('Cancel Order')
                    ->icon('heroicon-o-x-mark')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->modalHeading('Cancel Order')
                    ->modalDescription(fn ($record) => "Are you sure you want to cancel Order #{$record->order_number}?")
                    ->action(function ($record): void {
                        $record->update(['status' => 'cancelled']);

                        if ($record->payment && $record->payment->status === 'pending') {
                            $record->payment->update(['status' => 'failed']);
                        }

                        Notification::make()
                            ->title('Order cancelled successfully')
                            ->danger()
                            ->send();
                    })
                    ->visible(fn ($record): bool => $record->status !== 'cancelled'),
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    BulkAction::make('bulk_processing')
                        ->label('Mark Selected as Processing')
                        ->icon('heroicon-o-arrow-path')
                        ->color('info')
                        ->requiresConfirmation()
                        ->action(function (Collection $records): void {
                            $records->each->update(['status' => 'processing']);

                            Notification::make()
                                ->title('Selected orders marked as processing')
                                ->success()
                                ->send();
                        }),
                    BulkAction::make('bulk_completed')
                        ->label('Mark Selected as Completed')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->requiresConfirmation()
                        ->action(function (Collection $records): void {
                            $records->each->update(['status' => 'completed']);

                            Notification::make()
                                ->title('Selected orders marked as completed')
                                ->success()
                                ->send();
                        }),
                    BulkAction::make('bulk_cancel')
                        ->label('Cancel Selected Orders')
                        ->icon('heroicon-o-x-mark')
                        ->color('danger')
                        ->requiresConfirmation()
                        ->action(function (Collection $records): void {
                            $records->each(function ($record) {
                                $record->update(['status' => 'cancelled']);
                                if ($record->payment && $record->payment->status === 'pending') {
                                    $record->payment->update(['status' => 'failed']);
                                }
                            });

                            Notification::make()
                                ->title('Selected orders cancelled successfully')
                                ->danger()
                                ->send();
                        }),
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
