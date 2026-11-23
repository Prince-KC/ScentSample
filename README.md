# 🌸 ScentSampleNepal — Luxury Perfume Decants Store

**ScentSampleNepal** is an aesthetic fragrance sample & decant web application offering authentic 2ml, 5ml, and 10ml samples from the world's most coveted **Middle Eastern**, **Designer**, and **Niche** fragrance houses.

The user interface is inspired by **Gymshark's** sleek, ultra-clean aesthetic (clean monochrome palette, bold uppercase tracking, Montserrat typography, pill search bar, dynamic category hero cards, and sticky navigation) combined with full **MERN Stack** architecture (MongoDB, Express, React, Node.js) modeled directly after the course assignments (`Assignment/MERN` and `Assignment/sunwayl1l2front`).

---

## 🌟 Key Features

### 1. Fragrance Catalog (Middle Eastern, Designer & Niche)
* **Middle Eastern Beast-Mode:** Lattafa Khamrah Qahwa, Afnan 9 PM, Rasasi Hawas for Him, Armaf Club de Nuit Intense Man.
* **Designer Icons:** Dior Sauvage Elixir, Tom Ford Noir Extreme, Bleu de Chanel Parfum, Yves Saint Laurent La Nuit de L'Homme.
* **Niche Masterpieces:** Maison Francis Kurkdjian Baccarat Rouge 540 Extrait, Parfums de Marly Layton, Creed Aventus, Xerjoff 1861 Naxos.

### 2. Gymshark-Inspired Minimalist Aesthetic
* **Top Announcement Bar:** Free delivery across Kathmandu Valley on orders > Rs. 2,500.
* **Sticky Header:** Bold uppercase logo (`SCENTSAMPLE.NP`), live autocomplete search input, wishlist badge, cart bag counter.
* **Decant Size Selector:** Interactive `2ml (~30 sprays)`, `5ml (~75 sprays)`, and `10ml (~150 sprays)` pill toggles on each card that dynamically update prices in Nepalese Rupees (Rs.).
* **Fragrance Pyramid Modal:** Visualizes Top Notes, Heart/Middle Notes, and Base Notes drydown, with spray guide and customer longevity reports.
* **Slide-In Cart Drawer:** Smooth slide-out cart with quantity stepper, Kathmandu free shipping meter, and instant subtotal in Rs.
* **Nepal Checkout Flow:** Delivery form for Kathmandu, Lalitpur, Bhaktapur, Pokhara, Chitwan, etc., supporting **Cash on Delivery (COD)**, **eSewa**, and **Khalti**.
* **Interactive Scent Quiz:** 3-step quiz to find signature fragrance matches based on season, occasion, and preferred sillage.

### 3. Full MERN Stack Backend Integration
Modeled after your existing assignment routes (`productRoute.js`, `userRoute.js`, `reviewRoute.js`, `connectToDb.js`):
* **`GET /product`**: Fetches all perfumes with category filtering, search, and sorting.
* **`POST /product`**: Creates a new perfume decant in MongoDB.
* **`PATCH /product/:id`**: Updates perfume specifications, prices, or notes.
* **`DELETE /product/:id`**: Removes perfume from database.
* **`POST /user/register` & `POST /user/login`**: Full authentication with `bcrypt` password hashing and `jsonwebtoken` (JWT).
* **`POST /review` & `GET /review/product/:id`**: Community ratings and fragrance longevity reports.
* **`POST /order`**: Order submission with Nepal delivery addresses.
* **Control Center (Admin CRUD):** Live UI dashboard inside the app allowing you to Create, Read, Update, and Delete products, plus inspect registered users.

---

## 🚀 How to Run

### Step 1: Start MongoDB
Ensure MongoDB service is running (default port `27017`):
```bash
# Verify MongoDB service (it is already running on your Windows PC):
Get-Service -Name MongoDB
```

### Step 2: Seed the Database
Populate 12 authentic Middle Eastern, Designer, and Niche perfumes with prices in NPR, images, and reviews:
```bash
cd D:\coding\College\Summer_break\Mern_stack\ScentSampleNepal\backend
node src/seedData.js
```

### Step 3: Start the Backend Server (Port 8000)
```bash
cd D:\coding\College\Summer_break\Mern_stack\ScentSampleNepal\backend
node index.js
```
The backend API will run on `http://localhost:8000`.

### Step 4: Start the Frontend App (Port 5173)
In another terminal:
```bash
cd D:\coding\College\Summer_break\Mern_stack\ScentSampleNepal\frontend
npm run dev
```
Open `http://localhost:5173` in your browser!

---

## 🔑 Default Accounts
* **Admin Login:** `admin@scentsample.np` / `admin123`
* **Customer Login:** `aayush@gmail.com` / `user123`
