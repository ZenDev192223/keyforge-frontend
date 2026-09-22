# Keyforge Storefront — Structured React Frontend

This frontend is mapped to the supplied Keyforge backend API.

## Important architecture

- **Customer storefront:** no customer login/register because the backend does not provide customer authentication.
- **Admin portal:** completely separate under `/admin` and protected by the backend JWT.
- The storefront navbar contains only customer shopping actions; there is no Admin link in the customer navigation.
- Cart is stored locally in the browser.
- Checkout is public and creates orders through `POST /api/orders`.
- Order tracking is public through `GET /api/orders/:id`.

## Run

```bash
npm install
npm run dev
```

Set `VITE_API_URL` if the backend is not running on `http://localhost:5000/api`.

Admin login is the admin account seeded by the backend. The frontend does not create or manage customer accounts.
