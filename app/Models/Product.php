<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'name_bn',
        'slug',
        'type',
        'description',
        'description_bn',
        'content',
        'content_bn',
        'price',
        'discount_price',
        'discount_type',
        'image',
        'images',
        'stock',
        'author',
        'author_bn',
        'duration',
        'is_featured',
        'is_active',
        'show_discount_badge',
        'specification',
        'specification_bn',
        'author_details',
        'author_details_bn',
        'look_inside_type',
        'look_inside_pdf',
        'look_inside_images',
        'look_inside_text',
        'look_inside_text_bn',
        'digital_file',
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

    protected function content(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => (app()->getLocale() === 'bn' && ! empty($this->content_bn)) ? $this->content_bn : $value,
        );
    }

    protected function author(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => (app()->getLocale() === 'bn' && ! empty($this->author_bn)) ? $this->author_bn : $value,
        );
    }

    protected function specification(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => (app()->getLocale() === 'bn' && ! empty($this->specification_bn)) ? $this->specification_bn : $value,
        );
    }

    protected function authorDetails(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => (app()->getLocale() === 'bn' && ! empty($this->author_details_bn)) ? $this->author_details_bn : $value,
        );
    }

    protected function lookInsideText(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => (app()->getLocale() === 'bn' && ! empty($this->look_inside_text_bn)) ? $this->look_inside_text_bn : $value,
        );
    }

    protected $casts = [
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'images' => 'array',
        'look_inside_images' => 'array',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'show_discount_badge' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function getFinalPriceAttribute(): string
    {
        if (! $this->discount_price) {
            return $this->price;
        }

        if ($this->discount_type === 'flat') {
            return bcsub((string) $this->price, (string) $this->discount_price, 2);
        }

        // percentage
        $discountAmount = bcmul((string) $this->price, bcdiv((string) $this->discount_price, '100', 4), 2);

        return bcsub((string) $this->price, $discountAmount, 2);
    }
}
