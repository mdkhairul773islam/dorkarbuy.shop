<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Category extends Model
{
    protected $fillable = [
        'name',
        'name_bn',
        'slug',
        'description',
        'description_bn',
        'image',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => (app()->getLocale() === 'bn' && ! empty($this->name_bn)) ? $this->name_bn : $value,
        );
    }

    protected function description(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => (app()->getLocale() === 'bn' && ! empty($this->description_bn)) ? $this->description_bn : $value,
        );
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($category) {
            if (empty($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
