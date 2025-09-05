## Events that already exist

| VTEX Event                | CleverTap Event              |
|----------------------------|------------------------------|
| vtex:search                | Products Searched            |
| vtex:filterManipulation    | Product Filtered             |
| vtex:pageInfo / categoryView | Product List Viewed        |
| vtex:promoView             | Promotion Viewed             |
| vtex:promotionClick        | Promotion Clicked            |
| vtex:productClick          | Product Clicked              |
| vtex:productView           | Product Viewed               |
| vtex:addToCart             | Product Added to Cart        |
| vtex:removeFromCart        | Product Removed from Cart    |
| vtex:viewCart              | Cart Viewed                  |
| vtex:addToWishlist         | Product Added to Wishlist    |
| vtex:removeToWishlist      | Product Removed from Wishlist|
| vtex:share                 | Product Shared               |

---

## Events that exist but payload is incomplete

| VTEX Event          | CleverTap Event            | Notes / Missing Fields |
|----------------------|----------------------------|-------------------------|
| vtex:addToCart       | Product Added to Cart      | Missing: product_is_wishlisted |
| vtex:removeFromCart  | Product Removed from Cart  | Missing: product_is_wishlisted |
| vtex:addToWishlist   | Product Added to Wishlist  | Missing: wishlist_id |
| vtex:removeToWishlist| Product Removed from Wishlist | Missing: wishlist_id |
| vtex:share           | Product Shared             | Missing: product_id, category, name, brand, variant, price, quantity, url, image_url |

---

## Events to be implemented in the checkout CDN script

| VTEX Event            | CleverTap Event          |
|------------------------|--------------------------|
| vtex:beginCheckout     | Checkout Started         |
| vtex:addPaymentInfo    | Payment Info Entered     |
| vtex:orderPlaced       | Order Created            |
| –                      | Checkout Step Viewed     |
| –                      | Checkout Step Completed  |
| –                      | Coupon Applied           |
| –                      | Coupon Denied            |

---

## Events to be implemented (Backend & Others)

| VTEX Event            | CleverTap Event          |
|------------------------|--------------------------|
| –                      | Sign Up Started          |
| –                      | Checkout Failed          |
| –                      | Cart Shared              |
| –                      | Order Paid               |
| –                      | Order Updated            |
| –                      | Charged                  |
| –                      | Order Cancelled          |
| –                      | Product Reviewed         |
