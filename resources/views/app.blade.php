<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
        @inertiaHead
        @if(config('facebook.pixel_id'))
        <!-- Facebook Pixel Code -->
        <script>
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '{{ config('facebook.pixel_id') }}');
            fbq('track', 'PageView');
        </script>
        <noscript><img height="1" width="1" style="display:none"
            src="https://www.facebook.com/tr?id={{ config('facebook.pixel_id') }}&ev=PageView&noscript=1"
        /></noscript>
        <!-- End Facebook Pixel Code -->
        @endif
        
        <!-- Dynamic Theme Variables -->
        <style>
            :root {
                --theme-primary-color: {{ \App\Models\Setting::get('theme_primary_color', '#ea580c') }};
                --theme-hover-color: {{ \App\Models\Setting::get('theme_hover_color', '#c2410c') }};
                --theme-bg-color: {{ \App\Models\Setting::get('theme_bg_color', '#f8fafc') }};
                --theme-text-color: {{ \App\Models\Setting::get('theme_text_color', '#0f172a') }};
            }
        </style>
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
