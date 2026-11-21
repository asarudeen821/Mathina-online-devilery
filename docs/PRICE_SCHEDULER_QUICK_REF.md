# 📅 Price Scheduler - Quick Reference

**Feature:** Set different prices for different dates  
**Access:** Admin only → `/admin/price-scheduler`

---

## ⚡ Quick Start (30 seconds)

1. **Login as admin**
   - Email: `mathinachicken@gmail.com`
   - Password: `mathina`

2. **Click "Schedule Prices"** in navbar

3. **Create schedule:**
   - Select product
   - Pick date (today or future)
   - Enter price
   - Click "Create Schedule"

4. **Apply prices:**
   - Click "Apply Today's Schedules" button

---

## 🎯 Use Cases

| Scenario | Example |
|----------|---------|
| **Tomorrow's price** | Today: ₹200, Tomorrow: ₹300 |
| **Festival pricing** | Pongal: ₹320 for 3 days |
| **Weekend discount** | Saturday: ₹250 (from ₹280) |
| **Seasonal change** | Summer: ₹260, Winter: ₹280 |

---

## 🔌 API Endpoints

All require admin auth:

```bash
# Create schedule
POST /api/price-schedules

# Get all schedules
GET /api/price-schedules

# Apply today's schedules
POST /api/price-schedules/apply

# Get today's prices
GET /api/price-schedules/today

# Get product schedules
GET /api/price-schedules/product/:productId

# Delete schedule
DELETE /api/price-schedules/:id
```

---

## 📊 Database

**Collection:** `priceschedules`

**Key Fields:**
- `product` - Product ID
- `effectiveDate` - When to apply
- `pricePerKg` - New price
- `status` - scheduled/active/expired
- `reason` - Why price changed

---

## 🎨 UI Features

**Left Panel:**
- Product dropdown
- Date picker
- Price input
- Reason selector
- Notes field

**Right Panel:**
- Today's prices (green)
- Upcoming schedules (blue)
- Delete button
- Apply button

---

## ✅ Validation Rules

- ❌ Cannot schedule past dates
- ❌ Price must be > 0
- ❌ Cannot delete active schedules
- ❌ Cannot have duplicate dates
- ✅ Can schedule today onwards
- ✅ Can update scheduled prices
- ✅ Can delete scheduled prices

---

## 🔄 Status Flow

```
scheduled → active → expired
```

- **scheduled** - Future date, not applied yet
- **active** - Currently in effect
- **expired** - Past date, replaced by new price

---

## 🧪 Test Commands

```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev

# Access
http://localhost:5173/admin/price-scheduler
```

---

## 📝 Files Created

**Backend:**
- `models/PriceSchedule.js`
- `controllers/priceScheduleController.js`
- `routes/priceScheduleRoutes.js`

**Frontend:**
- `pages/admin/AdminPriceScheduler.jsx`

**Modified:**
- `server.js` (2 lines)
- `App.jsx` (8 lines)
- `Navbar.jsx` (4 lines)

---

## 🎓 Training (2 minutes)

**Step 1:** Login as admin  
**Step 2:** Click "Schedule Prices"  
**Step 3:** Select product + date + price  
**Step 4:** Click "Create Schedule"  
**Step 5:** Tomorrow, click "Apply Today's Schedules"  
**Done!** Prices updated automatically

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't access | Login as admin |
| Can't create | Check if date already scheduled |
| Can't delete | Only scheduled prices can be deleted |
| Price not updating | Click "Apply Today's Schedules" |

---

## 📈 Benefits

✅ Plan prices in advance  
✅ Save time on daily updates  
✅ Track price history  
✅ Manage festival pricing  
✅ Run promotions easily

---

## 🔒 Security

✅ Admin-only access  
✅ JWT authentication  
✅ Input validation  
✅ Role-based authorization

---

## 📚 Documentation

- `PRICE_SCHEDULING_GUIDE.md` - Complete guide (500+ lines)
- `PRICE_SCHEDULING_IMPLEMENTATION.md` - Implementation summary

---

## 🎯 Key Points

1. **Two price systems:**
   - Price Manager: Immediate updates
   - Price Scheduler: Future planning

2. **Manual apply:**
   - Schedules don't auto-apply
   - Click button to apply

3. **Zero impact:**
   - Existing features unchanged
   - Completely separate system

4. **Future enhancement:**
   - Add cron job for auto-apply
   - Currently manual trigger

---

## 📞 Support

**Email:** MathinaFreshHub@gmail.com  
**Phone:** +91 7708032726

---

**Status:** ✅ READY TO USE  
**Impact:** Zero on existing code  
**Testing:** Required before production

---

*Quick Reference by Amazon Q Developer*
