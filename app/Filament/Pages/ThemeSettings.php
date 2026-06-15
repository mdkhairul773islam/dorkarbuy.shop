<?php

namespace App\Filament\Pages;

use App\Models\Setting;
use Filament\Actions\Action;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\Section;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class ThemeSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-paint-brush';

    protected static ?string $navigationLabel = 'Theme Settings';

    protected static ?string $title = 'Theme Settings';

    protected static ?int $navigationSort = 100;

    protected string $view = 'filament.pages.theme-settings';

    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill([
            'theme_primary_color' => Setting::get('theme_primary_color', '#ea580c'),
            'theme_hover_color' => Setting::get('theme_hover_color', '#c2410c'),
            'theme_bg_color' => Setting::get('theme_bg_color', '#f8fafc'),
            'theme_text_color' => Setting::get('theme_text_color', '#0f172a'),
        ]);
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Brand Colors')
                    ->description('Manage primary actions and hover colors for buttons, tags, and highlights.')
                    ->schema([
                        ColorPicker::make('theme_primary_color')
                            ->label('Primary Brand Color')
                            ->default('#ea580c')
                            ->required(),
                        ColorPicker::make('theme_hover_color')
                            ->label('Primary Brand Hover Color')
                            ->default('#c2410c')
                            ->required(),
                    ])->columns(2),

                Section::make('Body & Layout Style')
                    ->description('Set general background and typography colors for all frontend pages.')
                    ->schema([
                        ColorPicker::make('theme_bg_color')
                            ->label('Body Background Color')
                            ->default('#f8fafc')
                            ->required(),
                        ColorPicker::make('theme_text_color')
                            ->label('Primary Text Color')
                            ->default('#0f172a')
                            ->required(),
                    ])->columns(2),
            ])
            ->statePath('data');
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Save Changes')
                ->submit('save'),
        ];
    }

    public function save(): void
    {
        $data = $this->form->getState();

        foreach ($data as $key => $value) {
            Setting::set($key, $value, 'text', 'appearance');
        }

        Setting::clearCache();

        Notification::make()
            ->title('Theme settings saved successfully!')
            ->success()
            ->send();
    }
}
