<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Basic Information')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                Select::make('category_id')
                                    ->relationship('category', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->required(),
                                Select::make('type')
                                    ->options([
                                        'book' => 'Book',
                                        'course' => 'Course',
                                        'clothing' => 'Clothing',
                                        'electronics' => 'Electronics',
                                        'digital' => 'Digital Product/Subscription',
                                    ])
                                    ->default('book')
                                    ->reactive()
                                    ->required(),
                            ]),
                        Grid::make(2)
                            ->schema([
                                TextInput::make('name')
                                    ->required()
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn ($set, ?string $state) => $set('slug', Str::slug($state))),
                                TextInput::make('slug')
                                    ->required()
                                    ->unique(ignoreRecord: true),
                            ]),
                        Grid::make(3)
                            ->schema([
                                TextInput::make('author')
                                    ->default(null),
                                TextInput::make('duration')
                                    ->label('Duration / Size')
                                    ->default(null),
                                TextInput::make('stock')
                                    ->required()
                                    ->numeric()
                                    ->default(0),
                            ]),
                    ]),

                Section::make('Pricing & Discounts')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                TextInput::make('price')
                                    ->required()
                                    ->numeric()
                                    ->prefix('৳'),
                                Select::make('discount_type')
                                    ->options([
                                        'percentage' => 'Percentage (%)',
                                        'flat' => 'Flat Amount (৳)',
                                    ])
                                    ->default('percentage')
                                    ->required(),
                                TextInput::make('discount_price')
                                    ->numeric()
                                    ->default(null)
                                    ->prefix('৳')
                                    ->helperText('Flat amount or percentage value'),
                            ]),
                        Grid::make(3)
                            ->schema([
                                Toggle::make('is_active')
                                    ->label('Active Status')
                                    ->default(true)
                                    ->required(),
                                Toggle::make('is_featured')
                                    ->label('Featured Product')
                                    ->required(),
                                Toggle::make('show_discount_badge')
                                    ->label('Show Discount Badge')
                                    ->default(true),
                            ]),
                    ]),

                Section::make('Product Media')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                FileUpload::make('image')
                                    ->label('Main Product Image')
                                    ->image()
                                    ->imageEditor()
                                    ->imageEditorAspectRatios(['1:1'])
                                    ->imageCropAspectRatio('1:1')
                                    ->disk('public')
                                    ->visibility('public')
                                    ->getUploadedFileNameForStorageUsing(
                                        fn ($file) => 'products/'.$file->hashName()
                                    )
                                    ->helperText('Product image must be 1:1 aspect ratio (square).')
                                    ->required(),
                                FileUpload::make('images')
                                    ->label('Product Gallery')
                                    ->multiple()
                                    ->image()
                                    ->imageEditor()
                                    ->imageEditorAspectRatios(['1:1'])
                                    ->imageCropAspectRatio('1:1')
                                    ->disk('public')
                                    ->visibility('public')
                                    ->directory('products/gallery')
                                    ->getUploadedFileNameForStorageUsing(
                                        fn ($file) => 'products/gallery/'.$file->hashName()
                                    )
                                    ->helperText('Gallery images must be 1:1 aspect ratio.'),
                            ]),
                    ]),

                Section::make('Look Inside')
                    ->schema([
                        Select::make('look_inside_type')
                            ->label('Content Type')
                            ->options([
                                'pdf' => 'PDF Document',
                                'text' => 'Rich Text',
                            ])
                            ->reactive()
                            ->default(null),

                        FileUpload::make('look_inside_pdf')
                            ->label('PDF File')
                            ->disk('public')
                            ->directory('look_inside/pdfs')
                            ->acceptedFileTypes(['application/pdf'])
                            ->visible(fn ($get) => $get('look_inside_type') === 'pdf'),

                        RichEditor::make('look_inside_text')
                            ->label('Read a Little (Text)')
                            ->visible(fn ($get) => $get('look_inside_type') === 'text')
                            ->columnSpanFull(),
                    ])
                    ->collapsible()
                    ->collapsed(true)
                    ->columns(1)
                    ->visible(fn ($get) => $get('type') === 'book'),

                Section::make('Digital Delivery file')
                    ->schema([
                        FileUpload::make('digital_file')
                            ->label('Digital File (PDF)')
                            ->disk('public')
                            ->directory('products/digital')
                            ->acceptedFileTypes(['application/pdf'])
                            ->downloadable()
                            ->openable()
                            ->helperText('Upload the PDF that will be delivered to customers after ordering')
                            ->columnSpanFull(),
                    ])
                    ->visible(fn ($get) => $get('type') === 'digital'),

                Section::make('Product Descriptions')
                    ->schema([
                        Textarea::make('description')
                            ->default(null)
                            ->columnSpanFull()
                            ->label('Summary'),
                        RichEditor::make('content')
                            ->default(null)
                            ->columnSpanFull()
                            ->label('Additional Details'),
                        RichEditor::make('specification')
                            ->default(null)
                            ->columnSpanFull()
                            ->label('Specification'),
                        RichEditor::make('author_details')
                            ->default(null)
                            ->columnSpanFull()
                            ->label('Author Details'),
                    ])
                    ->collapsible()
                    ->collapsed(true),
            ]);
    }
}
