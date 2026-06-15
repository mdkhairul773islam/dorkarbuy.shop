<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('cart_items', function (Blueprint $table) {
            $table->string('size')->nullable()->after('price');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->string('product_type')->change();
            $table->string('size')->nullable()->after('total');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cart_items', function (Blueprint $table) {
            $table->dropColumn('size');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->enum('product_type', ['book', 'course'])->change();
            $table->dropColumn('size');
        });
    }
};
