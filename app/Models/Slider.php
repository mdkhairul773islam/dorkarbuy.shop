<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Slider extends Model
{
    protected $fillable = [
        'title',
        'title_bn',
        'description',
        'description_bn',
        'image',
        'video',
        'button_text',
        'button_text_bn',
        'button_link',
        'is_active',
    ];

    protected function title(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => (app()->getLocale() === 'bn' && ! empty($this->title_bn)) ? $this->title_bn : $value,
        );
    }

    protected function description(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => (app()->getLocale() === 'bn' && ! empty($this->description_bn)) ? $this->description_bn : $value,
        );
    }

    protected function buttonText(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => (app()->getLocale() === 'bn' && ! empty($this->button_text_bn)) ? $this->button_text_bn : $value,
        );
    }
}
