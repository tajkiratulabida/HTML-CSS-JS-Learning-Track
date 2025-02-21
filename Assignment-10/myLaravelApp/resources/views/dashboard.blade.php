<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
                <button id="openModalBtn" class="bg-green-500 text-white px-4 py-2 rounded-lg">
                    Add New Item
                </button>

                <!-- Add Item Modal -->
                <div id="addItemModal" class="hidden fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div class="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 class="text-xl font-semibold mb-4">Add New Product</h2>
                        <form id="addProductForm">
                            @csrf
                            <label class="block mb-2">Product Name</label>
                            <input type="text" id="name" name="name" class="w-full border p-2 rounded mb-3" required>

                            <label class="block mb-2">Product Type</label>
                            <select id="type" name="type" class="w-full border p-2 rounded mb-3" required>
                                <option value="Coffee">Coffee</option>
                                <option value="Beverages">Beverages</option>
                                <option value="BBQ">BBQ</option>
                                <option value="Snacks">Snacks</option>
                                <option value="Desserts">Desserts</option>
                            </select>

                            <label class="block mb-2">Purchase Price</label>
                            <input type="number" id="purchase_price" name="purchase_price" class="w-full border p-2 rounded mb-3" required>

                            <label class="block mb-2">Selling Price</label>
                            <input type="number" id="selling_price" name="selling_price" class="w-full border p-2 rounded mb-3" required>

                            <label class="block mb-2">Total Sold Quantity</label>
                            <input type="number" id="total_sold_quantity" name="total_sold_quantity" class="w-full border p-2 rounded mb-3" required>

                            <div class="flex justify-end">
                                <button type="button" id="closeModalBtn" class="bg-red-500 text-white px-4 py-2 rounded-lg mr-2">
                                    Cancel
                                </button>
                                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-lg">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Product Card List Section -->
                <div id="productList" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                    @foreach ($products as $product)
                        <div class="bg-white border rounded-lg shadow-md p-4 flex flex-col items-center product-card">
                        <img src="{{ asset('images/logo.jpg') }}" alt="Product Image" class="w-32 h-32 object-cover rounded-md mb-4">
                        <h4 class="text-lg font-semibold mb-2">{{ $product->name }}</h4>
                            <p class="text-gray-600 mb-4">${{ $product->selling_price }}</p>
                            <button class="bg-gray-500 hover:bg-gray-800 text-white px-4 py-2 rounded-lg addToCartBtn"
                                    data-id="{{ $product->id }}">
                                Add to Cart
                            </button>
                        </div>
                    @endforeach
                </div>

                <h3 class="mt-6 text-2xl font-bold text-gray-800">Checkout</h3>
                <hr class="border-t-2 border-gray-300 my-4">

                <div id="cartItems" ></div>
                <!-- Calculation Section -->
                <div class="mt-4 border-t pt-4 text-lg">
                    <p id="subtotal" class="text-gray-700">Subtotal: <span class="font-semibold">$0.00</span></p>
                    <p id="discount" class="text-gray-700">Discount (5%): <span class="font-semibold">$0.00</span></p>
                    <p id="tax" class="text-gray-700">Tax (1.5%): <span class="font-semibold">$0.00</span></p>
                    <p id="total" class="text-2xl font-bold text-green-600">Total: $0.00</p>
                </div>


                <!-- Pay Button and Cancel Button-->
                <div class="flex gap-4 mt-4">
                    <button id="cancelOrderBtn" class="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg">
                        Cancel Order
                    </button>
                    <button id="payBtn" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg">
                        Pay $0.00
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- Toastr CSS & JS after jQuery -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css" rel="stylesheet"/>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>


    <script>

        $(document).ready(function () {

        // Open and Close Modal
        $("#openModalBtn").click(function() {
            $("#addItemModal").removeClass("hidden");
        });

        $("#closeModalBtn").click(function() {
            $("#addItemModal").addClass("hidden");
        });



        // Handle Product Form Submission
        $("#addProductForm").submit(function (e) {
            e.preventDefault();

            $.ajax({
                url: "{{ route('products.store') }}",
                method: "POST",
                headers: {
                    'X-CSRF-TOKEN': $('input[name="_token"]').val()
                },
                data: $(this).serialize(),
                success: function(response) {
                    $("#addItemModal").addClass("hidden");
                    $("#addProductForm")[0].reset();
                    location.reload();

                },
                error: function (xhr) {
                    console.log("Error: ", xhr.responseText);
                    toastr.error("Error adding product!");
                }

            });
        });

        //Calculation partt
        function calculateTotals(cart) {
            let subtotal = 0;
            $.each(cart, function(id, item) {
                subtotal += item.price * item.quantity;
            });
            let discount = subtotal * 0.05;
            let tax = subtotal * 0.015;
            let total = subtotal - discount + tax;

            $("#subtotal").text(`Subtotal: $${subtotal.toFixed(2)}`);
            $("#discount").text(`Discount (5%): $${discount.toFixed(2)}`);
            $("#tax").text(`Tax (1.5%): $${tax.toFixed(2)}`);
            $("#total").text(`Total: $${total.toFixed(2)}`);
            $("#payBtn").text(`Pay $${total.toFixed(2)}`);
        }


        // Load Cart 
        function loadCart() {
            $.get("/cart", function(response) {
                var cartHtml = '';
                $.each(response.cart, function(id, item) {
                    cartHtml += `<div class="cart-item bg-gray-100 p-4 rounded-lg mb-3 flex justify-between items-center">
                        <p class="font-medium">${item.name} - $${item.price} x ${item.quantity}</p>
                        <div class="flex gap-2">
                            <button class="updateCart bg-sky-500 hover:bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center" 
                                    data-id="${id}" data-action="increase">+</button>
                            <button class="updateCart bg-gray-500 hover:bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center" 
                                    data-id="${id}" data-action="decrease">-</button>
                            <button class="updateCart bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center" 
                                    data-id="${id}" data-action="delete">🗑️</button>
                        </div>
                    </div>`;
                });
                $("#cartItems").html(cartHtml);
                calculateTotals(response.cart);
            });
        }

        // Add to Cart
        $("body").on("click", ".addToCartBtn", function() {
            var productId = $(this).data("id");
            $.post("/cart/add/" + productId, { _token: "{{ csrf_token() }}" }, function(response) {
                if (response.success) {
                    alert(response.message);
                    loadCart();
                }
            }).fail(function() {
                alert("Failed to add product to cart!");
            });
        });

        // Update Cart Quantity (+, -, Delete)
        $("body").on("click", ".updateCart", function() {
            var productId = $(this).data("id");
            var action = $(this).data("action");

            $.ajax({
                url: "/cart/update/" + productId,
                method: "POST",
                headers: {
                    'X-CSRF-TOKEN': "{{ csrf_token() }}"
                },
                data: { action: action },
                success: function(response) {
                    if (response.success) {
                        loadCart();
                    } else {
                        alert("Failed to update cart!");
                    }
                },
                error: function () {
                    alert("Error updating cart!");
                }
            });
        });


        // Pay Button with Toastr
        $("#payBtn").click(function () {
            toastr.options = {
                "closeButton": true,
                "progressBar": true,
                "timeOut": "3000",
                "positionClass": "toast-top-right",
                "showDuration": "300",
                "hideDuration": "1000",
                "extendedTimeOut": "1000"
            };
            if ($("#cartItems").is(':empty')) {
                toastr.error("Cart is empty!"); //show error if cart is empty
                return;
            }

            $.get("/cart/clear", function(response) {
                toastr.success("Payment Successful!"); //success notification 
                loadCart();
            }).fail(function() {
                toastr.error("Failed to clear cart!"); //error notification 
            });
        });

        // Cancel Order Button with Toastr
        $("#cancelOrderBtn").click(function () {
            toastr.options = {
                "closeButton": true,
                "progressBar": true,
                "timeOut": "3000",
                "positionClass": "toast-top-right",
                "showDuration": "300",
                "hideDuration": "1000",
                "extendedTimeOut": "1000"
            };

            if ($("#cartItems").is(':empty')) {
                toastr.error("Cart is already empty!"); 
                return;
            }

            $.get("/cart/clear", function(response) {
                toastr.success("Order canceled and cart cleared!"); 
                loadCart();
            }).fail(function() {
                toastr.error("Failed to clear cart!"); 
            });
        });

        loadCart();
    });
    </script>
</x-app-layout>
