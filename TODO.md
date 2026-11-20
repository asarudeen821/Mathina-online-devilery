# TODO - Order Button + Shop Owner Flow

## Step 1: Analyze existing implementation
- [x] Reviewed backend order routes/controllers and admin order status update pipeline
- [x] Reviewed existing customer/admin login restrictions and seed data

## Step 2: Implement/verify user "Order" button for Chicken Cuts
- [x] Verified `frontend/src/components/ChickenCutsShowcase.jsx` already has an "Order Now" button
- [x] Verified button navigates customer into products listing to place order via cart/checkout

## Step 3: Verify admin updates send customer notification
- [x] Reviewed `frontend/src/pages/admin/AdminOrders.jsx` which updates order status and calls `notificationAPI.send()` for customer
- [ ] (If needed) Align notification payload/types with backend implementation

## Step 4: Verify full end-to-end flow
- [ ] Customer places order → order appears in admin orders list
- [ ] Admin moves status step → customer receives notification

## Step 5: Testing checklist
- [ ] Login as customer (customer@example.com / Customer@123 from seed)
- [ ] Place a chicken cut order from UI
- [ ] Login as shop owner (mathinachicken@gmail.com / mathina)
- [ ] Move order through steps and verify notifications

