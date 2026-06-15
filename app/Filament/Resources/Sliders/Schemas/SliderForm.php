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
                    ->imageEditorAspectRatios([
                        '16:5',
                        '21:9',
                        '16:9',
                    ])
                    ->disk('public')
                    ->directory('sliders')
                    ->helperText('Recommended aspect ratio: 16:5 (e.g. 1920x600 px) for wide desktop screens. You can crop the image after uploading by clicking the Edit/Crop button.'),
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
