<?php

namespace App\Filament\Resources\Sliders\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class SliderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->default(null),
                Textarea::make('description')
                    ->default(null)
                    ->columnSpanFull(),
                FileUpload::make('image')
                    ->image()
                    ->imageEditor()
                    ->imageResizeTargetWidth(1920)
                    ->disk('public')
                    ->directory('sliders')
                    ->helperText('Banners are automatically optimized and resized to a max width of 1920px to keep the website fast, while preserving the full original aspect ratio. Use the Edit button if you want to manually crop the image.'),
                FileUpload::make('video')
                    ->disk('public')
                    ->acceptedFileTypes(['video/mp4', 'video/mkv', 'video/webm'])
                    ->maxSize(20480)
                    ->directory('sliders/videos'),
                TextInput::make('button_text')
                    ->default(null),
                TextInput::make('button_link')
                    ->default(null),
                Toggle::make('is_active')
                    ->default(true)
                    ->required(),
            ]);
    }
}
