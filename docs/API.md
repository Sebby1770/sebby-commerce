# NexaCart Commerce Cloud API

All API routes return JSON. In local demo mode, pass `x-demo-role` with one of:
`customer`, `support`, `inventory_manager`, `operations_manager`, or `admin`.
In production, send a Supabase Auth bearer token.

## Routes

| Method | Route | Permission | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Public | Runtime and Supabase configuration status |
| `GET` | `/api/products` | Public | Published product catalog |
| `GET` | `/api/products?admin=true` | Inventory, operations, admin | Full product catalog |
| `POST` | `/api/products` | Inventory, operations, admin | Create a product |
| `POST` | `/api/checkout` | Public or signed in | Create an order from cart items |
| `GET` | `/api/orders` | Signed in | Own orders for customers, all orders for staff |
| `PATCH` | `/api/orders` | Support, operations, admin | Advance order status |
| `GET` | `/api/admin/team` | Admin | List staff profiles |
| `POST` | `/api/admin/team` | Admin | Invite a user through Supabase Auth |
| `PATCH` | `/api/admin/team` | Admin | Change a user role |

## Example

```bash
curl http://localhost:3000/api/products
```

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-demo-role: admin" \
  -d '{
    "name": "Desk Kit",
    "category": "Workspace",
    "description": "Curated workspace accessories.",
    "price": 88,
    "stock": 20,
    "low_stock_threshold": 5,
    "image_url": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    "is_published": true
  }'
```
