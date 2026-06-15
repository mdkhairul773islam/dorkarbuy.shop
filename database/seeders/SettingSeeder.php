<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // General
            ['key' => 'site_name', 'value' => 'DorkarBuy', 'type' => 'text', 'group' => 'general'],
            ['key' => 'site_name_bangla', 'value' => 'দরকারবাই', 'type' => 'text', 'group' => 'general'],
            ['key' => 'site_tagline', 'value' => 'আপনার প্রয়োজন, আমাদের অঙ্গীকার', 'type' => 'text', 'group' => 'general'],
            ['key' => 'site_description', 'value' => 'দরকারবাই - আপনার পছন্দের বই এবং কোর্স অনলাইন শপ', 'type' => 'textarea', 'group' => 'general'],

            // Appearance
            ['key' => 'site_logo', 'value' => null, 'type' => 'image', 'group' => 'appearance'],
            ['key' => 'site_favicon', 'value' => null, 'type' => 'image', 'group' => 'appearance'],

            // Contact
            ['key' => 'contact_phone', 'value' => '01914383816', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'hotline', 'value' => '01914383816', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'hotline_time', 'value' => '9 AM to 8 PM', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'contact_email', 'value' => 'info@dorkarbuy.shop', 'type' => 'email', 'group' => 'contact'],
            ['key' => 'support_email', 'value' => 'support@dorkarbuy.shop', 'type' => 'email', 'group' => 'contact'],
            ['key' => 'address', 'value' => 'Dhaka, Bangladesh', 'type' => 'textarea', 'group' => 'contact'],

            // Corporate
            ['key' => 'corporate_phone', 'value' => '01914383816', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'corporate_email', 'value' => 'info@dorkarbuy.shop', 'type' => 'email', 'group' => 'contact'],
            ['key' => 'retailer_phone', 'value' => '01914383816', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'wholesale_email', 'value' => 'info@dorkarbuy.shop', 'type' => 'email', 'group' => 'contact'],

            // Social Media
            ['key' => 'facebook_url', 'value' => 'https://facebook.com/dorkarbuy.shop', 'type' => 'text', 'group' => 'social'],
            ['key' => 'twitter_url', 'value' => 'https://twitter.com/dorkarbuy', 'type' => 'text', 'group' => 'social'],
            ['key' => 'instagram_url', 'value' => 'https://instagram.com/dorkarbuy', 'type' => 'text', 'group' => 'social'],
            ['key' => 'youtube_url', 'value' => 'https://youtube.com/@dorkarbuy', 'type' => 'text', 'group' => 'social'],
            ['key' => 'linkedin_url', 'value' => 'https://linkedin.com/company/dorkarbuy', 'type' => 'text', 'group' => 'social'],
            ['key' => 'telegram_url', 'value' => 'https://t.me/dorkarbuy', 'type' => 'text', 'group' => 'social'],
            ['key' => 'whatsapp_number', 'value' => '8801914383816', 'type' => 'text', 'group' => 'social'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
