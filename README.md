# Amazone

Amazone is a full-stack ecommerce storefront inspired by the Amazon.in shopping experience. It is built as a local educational clone to practice React UI, product browsing, cart workflows, location-based delivery, checkout, and a small Express API.

This project is not affiliated with Amazon.

## What It Includes

- Amazon.in-style ecommerce homepage
- Sticky top navigation with brand, delivery location, search, account, orders, and cart
- Department tabs with selected-state highlighting
- Search suggestions and searchable product catalog
- Product filters for category, price, rating, stock, deals, and wishlist
- Sorting by featured, price, rating, and discount
- Product cards with image, discount, rating, stock, delivery estimate, wishlist, and add-to-cart
- Product quick-view modal
- Cart drawer with quantity controls, coupon, delivery fee, subtotal, and checkout
- Coupon support with `AMAZON10`
- Location modal with city cards, pincode lookup, map preview, saved addresses, and browser geolocation
- Delivery estimates that change based on selected city/pincode
- Checkout with address, payment method, order summary, and demo order placement
- Orders modal with persisted order history
- Account modal with saved address, wishlist, and order counts
- Express backend serving products from a JSON database

## Tech Stack

- React
- Vite
- Express
- Node.js
- Lucide React icons
- JSON file database for products
- OpenStreetMap embed for location preview
- Browser `localStorage` for cart, wishlist, address, payment, and order persistence

## Project Structure

```text
Amazone/
├── data/
│   └── products.json
├── src/
│   ├── main.jsx
│   └── styles.css
├── index.html
├── package.json
├── server.mjs
├── serve-dist.mjs
└── README.md
```

## API Routes

```text
GET /api/products
GET /api/products/:id
```

The product API reads from:

```text
data/products.json
```

## Run Locally

Install dependencies:

```bash
npm install
```

Build the frontend:

```bash
npm run build
```

Start the Express server:

```bash
npm start
```

Open:

```text
http://127.0.0.1:4174
```

## Development

Run Vite during frontend development:

```bash
npm run dev
```

Run the Express API/static server:

```bash
npm run api
```

## Demo Pincodes

The location system supports demo city lookup for pincodes such as:

```text
560001 Bengaluru
110001 New Delhi
400001 Mumbai
700001 Kolkata
600001 Chennai
500001 Hyderabad
411001 Pune
380001 Ahmedabad
302001 Jaipur
226001 Lucknow
431001 Chhatrapati Sambhajinagar
```

## Note

Amazone is a learning project and local demo. It uses mock product data and demo checkout/order flows. No real payments, orders, or Amazon services are connected.
