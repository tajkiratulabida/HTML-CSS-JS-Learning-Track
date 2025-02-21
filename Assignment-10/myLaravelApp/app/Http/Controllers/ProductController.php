<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();
        return view('dashboard', compact('products'));
    }

    public function store(Request $request)
    {
        try {
            // Validate Request
            $request->validate([
                'name' => 'required|string|max:255',
                'type' => 'required|string|max:255',
                'purchase_price' => 'required|numeric|min:0',
                'selling_price' => 'required|numeric|min:0',
                'total_sold_quantity' => 'required|integer|min:0',
            ]);

            // Create Product
            $product = Product::create($request->all());

            // Return JSON response
            return response()->json(['success' => true, 'product' => $product]);

        } catch (\Exception $e) {
            Log::error("Product Insertion Error: " . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Error adding product!'], 500);
        }
    }

    public function addToCart($id)
    {
        $product = Product::findOrFail($id);
        $cart = session()->get('cart', []);

        if (isset($cart[$id])) {
            $cart[$id]['quantity']++;
        } else {
            $cart[$id] = [
                'name' => $product->name,
                'quantity' => 1,
                'price' => $product->selling_price,
            ];
        }

        session()->put('cart', $cart);

        return response()->json([
            'success' => true,
            'message' => 'Product added to cart!',
            'cart' => $cart
        ]);
    }

    public function updateCart(Request $request, $id)
    {
        $cart = Session::get('cart', []);

        if (isset($cart[$id])) {
            if ($request->action == 'increase') {
                $cart[$id]['quantity']++;
            } elseif ($request->action == 'decrease' && $cart[$id]['quantity'] > 1) {
                $cart[$id]['quantity']--;
            } else {
                unset($cart[$id]);
            }
        }

        Session::put('cart', $cart);
        return response()->json(['success' => true, 'message' => 'Cart updated!']);
    }

    public function clearCart()
    {
        Session::forget('cart');
        return response()->json(['success' => true, 'message' => 'Cart cleared successfully!']);
    }
}

