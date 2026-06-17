<?php

use Illuminate\Support\Facades\App;

test('can switch locale to bangla and store in session', function () {
    $response = $this->get('/lang/bn');

    $response->assertSessionHas('locale', 'bn');
    $response->assertRedirect();
});

test('can switch locale to english and store in session', function () {
    $response = $this->get('/lang/en');

    $response->assertSessionHas('locale', 'en');
    $response->assertRedirect();
});

test('does not switch to invalid locale', function () {
    $response = $this->get('/lang/invalid');

    $response->assertSessionMissing('locale');
});

test('locale middleware applies session locale to application', function () {
    $this->withSession(['locale' => 'bn']);

    $this->get('/');

    expect(App::getLocale())->toBe('bn');
});
