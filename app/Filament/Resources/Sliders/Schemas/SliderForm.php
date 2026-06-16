<?php

namespace App\Filament\Resources\Sliders\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class SliderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Slider Info')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextInput::make('title')
                                    ->default(null),
                                Toggle::make('is_active')
                                    ->label('Active Status')
                                    ->default(true)
                                    ->required(),
                            ]),
                        Grid::make(2)
                            ->schema([
                                TextInput::make('button_text')
                                    ->default(null),
                                TextInput::make('button_link')
                                    ->default(null),
                            ]),
                        Textarea::make('description')
                            ->default(null)
                            ->columnSpanFull()
                            ->rows(3),
                    ]),

                Section::make('Slider Media')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                FileUpload::make('image')
                                    ->image()
                                    ->imageEditor()
                                    ->imageCropAspectRatio('12:5')
                                    ->imageResizeTargetWidth(1920)
                                    ->imageResizeTargetHeight(800)
                                    ->disk('public')
                                    ->directory('sliders')
                                    ->helperText('Slider banners are automatically cropped to a 12:5 aspect ratio and resized to 1920x800 px for optimal speed on desktop, mobile, and tablet. Click the Edit button on the image to adjust the crop area.'),
                                FileUpload::make('video')
                                    ->disk('public')
                                    ->acceptedFileTypes(['video/mp4', 'video/mkv', 'video/webm'])
                                    ->maxSize(20480)
                                    ->directory('sliders/videos')
                                    ->helperText('Optional background video banner (mp4, mkv, webm, max 20MB)'),
                            ]),
                    ]),
            ]);
    }
}
