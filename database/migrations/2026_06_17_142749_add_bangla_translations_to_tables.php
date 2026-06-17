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
        Schema::table('categories', function (Blueprint $table) {
            $table->string('name_bn')->nullable()->after('name');
            $table->text('description_bn')->nullable()->after('description');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->string('name_bn')->nullable()->after('name');
            $table->text('description_bn')->nullable()->after('description');
            $table->longText('content_bn')->nullable()->after('content');
            $table->string('author_bn')->nullable()->after('author');
            $table->longText('specification_bn')->nullable()->after('specification');
            $table->longText('author_details_bn')->nullable()->after('author_details');
            $table->longText('look_inside_text_bn')->nullable()->after('look_inside_text');
        });

        Schema::table('sliders', function (Blueprint $table) {
            $table->string('title_bn')->nullable()->after('title');
            $table->text('description_bn')->nullable()->after('description');
            $table->string('button_text_bn')->nullable()->after('button_text');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn(['name_bn', 'description_bn']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'name_bn',
                'description_bn',
                'content_bn',
                'author_bn',
                'specification_bn',
                'author_details_bn',
                'look_inside_text_bn',
            ]);
        });

        Schema::table('sliders', function (Blueprint $table) {
            $table->dropColumn(['title_bn', 'description_bn', 'button_text_bn']);
        });
    }
};
