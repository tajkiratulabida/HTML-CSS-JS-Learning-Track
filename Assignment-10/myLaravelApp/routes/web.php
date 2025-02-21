<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

Route::get('/', function () {
    return view('welcome');
});

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/dashboard', [ProductController::class, 'index'])->name('dashboard');
});

// Product Management Routes
Route::post('/products', [ProductController::class, 'store'])->name('products.store');

// Cart Management Routes
Route::post('/cart/add/{id}', [ProductController::class, 'addToCart']);
Route::post('/cart/update/{id}', [ProductController::class, 'updateCart']);
Route::post('/cart/remove/{id}', [ProductController::class, 'removeFromCart']); // Ensure this function exists
Route::get('/cart/clear', [ProductController::class, 'clearCart']);


Route::get('/cart', function () {
    return response()->json([
        'cart' => session()->get('cart', [])
    ]);
});

