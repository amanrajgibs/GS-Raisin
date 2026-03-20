# 🌸 KEEPSY — Complete Website Guide
**Founders:** Aman Raj & Suyash Pratap | **Based in:** Delhi, India

---

## 📁 FOLDER STRUCTURE

```
keepsy/
│
├── index.html          ← Main website (all pages in one file)
├── README.md           ← This guide
│
├── css/
│   └── style.css       ← All styles (edit colors via :root variables)
│
├── js/
│   └── main.js         ← All interactivity & logic
│
└── images/
    ├── bracelet.jpeg   ← YOUR bracelet product image
    └── Earring.jpeg    ← YOUR earring product image
```

---

## 🌐 HOSTING ON GITHUB PAGES (Free)

### Step 1 — Create a GitHub Account
1. Go to **https://github.com**
2. Click **Sign Up**
3. Use email: **amanraj.srccgbo@gmail.com**
4. Choose a username (e.g. `keepsy-official`)
5. Verify your email and complete setup

### Step 2 — Create a Repository
1. Click the **+** icon (top right) → **New repository**
2. Repository name: `keepsy` (or `keepsy-website`)
3. Set to **Public**
4. ✅ Check "Add a README file"
5. Click **Create repository**

### Step 3 — Upload Your Files
**Option A — GitHub Web Interface (Easiest):**
1. Open your repository on GitHub
2. Click **Add file** → **Upload files**
3. Drag and drop your ENTIRE `keepsy/` folder contents:
   - `index.html`
   - `css/style.css`
   - `js/main.js`
   - `images/bracelet.jpeg`
   - `images/Earring.jpeg`
4. Scroll down → Write commit message: "Initial upload"
5. Click **Commit changes**

**Option B — GitHub Desktop (Recommended for ongoing updates):**
1. Download GitHub Desktop: **https://desktop.github.com**
2. Sign in with amanraj.srccgbo@gmail.com
3. Clone your repository to your computer
4. Copy all Keepsy files into the cloned folder
5. In GitHub Desktop → write summary → click **Commit to main** → **Push origin**

### Step 4 — Enable GitHub Pages
1. In your repository → click **Settings** tab
2. Scroll down to **Pages** (left sidebar)
3. Under "Branch" → select **main** → select **/ (root)**
4. Click **Save**
5. Wait 1–2 minutes
6. Your site will be live at: **https://[your-username].github.io/keepsy**

---

## 🖼️ HOW TO UPLOAD/UPDATE PRODUCT IMAGES

1. Go to your GitHub repository
2. Click on the `images/` folder
3. Click **Add file** → **Upload files**
4. Upload your image files (keep exact names: `bracelet.jpeg`, `Earring.jpeg`)
5. Commit changes — site updates automatically in ~1 minute

**⚠️ Important:** Image filenames are case-sensitive on GitHub. Use exact names as in the HTML:
- `bracelet.jpeg` (all lowercase)
- `Earring.jpeg` (capital E)

---

## 🔄 HOW TO UPDATE PRODUCTS LATER

### Change a Product Price
In `index.html`, search for the price (e.g. `₹899`) and update it.

### Add a New Product
In `index.html`, find the `<!-- Coming Soon Card -->` comment and replace it with:
```html
<div class="product-card" data-product="pendant" data-category="pendant">
  <div class="product-card-img">
    <img src="images/pendant.jpeg" alt="Custom Pendant" loading="lazy" />
    <span class="product-card-badge">New</span>
    <div class="product-card-overlay">
      <button class="product-quick-btn">Quick View →</button>
    </div>
  </div>
  <div class="product-card-info">
    <div class="product-card-name">Custom Pendant</div>
    <div class="product-card-sub">Resin · Personalised</div>
    <div class="product-card-footer">
      <div class="product-price">₹999 <span>onwards</span></div>
      <div class="product-rating"><span class="stars">★★★★★</span> 5.0</div>
    </div>
  </div>
</div>
```

Then add the product data in `js/main.js` inside the `products` object:
```javascript
pendant: {
  id: 'pendant',
  name: 'Custom Pendant',
  subtitle: 'Resin · Personalised',
  desc: 'Description here.',
  price: 999,
  original: 1299,
  image: 'images/pendant.jpeg',
  badge: 'New',
  category: 'pendant',
},
```

### Change Brand Colors
In `css/style.css`, find `:root {` at the top and update:
```css
--gold: #c9a96e;      /* Gold accent — change this */
--blush-dark: #c99a8a; /* Pink accent */
--charcoal: #2c2418;  /* Dark background */
```

---

## 🌍 CONNECT A CUSTOM DOMAIN (Optional)

If you want **www.keepsy.in** or **keepsy.co.in**:

1. Buy domain from **GoDaddy**, **Namecheap**, or **Google Domains**
2. In GitHub repo → **Settings** → **Pages** → type your domain in "Custom domain"
3. In your domain registrar, add these DNS records:
   ```
   Type: A    Name: @    Value: 185.199.108.153
   Type: A    Name: @    Value: 185.199.109.153
   Type: A    Name: @    Value: 185.199.110.153
   Type: A    Name: @    Value: 185.199.111.153
   Type: CNAME  Name: www  Value: [username].github.io
   ```
4. Wait 24–48 hours for DNS to propagate
5. ✅ Enable **Enforce HTTPS** in GitHub Pages settings

---

## 💳 PAYMENT SETUP (To Go Live)

### UPI (Ready Now)
UPI ID `8083675985@upi` is already in the checkout page.
To add a real QR code:
1. Open your UPI app (PhonePe / GPay)
2. Go to your QR code → save as image → upload as `images/upi-qr.png`
3. In `index.html`, replace the `.qr-placeholder` div with:
```html
<img src="images/upi-qr.png" alt="UPI QR" style="width:140px;margin:1rem auto;border-radius:12px" />
```

### Razorpay (Activate for Real Payments)
1. Sign up at **https://razorpay.com**
2. Complete KYC (business documents)
3. Get your **API Key ID** from Dashboard → Settings → API Keys
4. Add this script to `index.html` before `</body>`:
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```
5. Update the Razorpay buttons in `js/main.js` with real integration code (see Razorpay docs)

---

## ✏️ QUICK EDIT GUIDE

| What to change       | Where to find it                          |
|----------------------|-------------------------------------------|
| Brand name           | `index.html` → search "Keepsy"            |
| Phone number         | `index.html` → search "8083675985"        |
| Email                | `index.html` → search "amanraj.srcc"      |
| UPI ID               | `index.html` + `js/main.js` → "8083675985@upi" |
| Product prices       | `index.html` + `js/main.js`               |
| Hero text            | `index.html` → `.hero-content` section    |
| Colors               | `css/style.css` → `:root` variables       |
| About story          | `index.html` → `#about` page             |
| Testimonials         | `index.html` → `.testimonials-grid`       |
| WhatsApp link        | Replace `#` in social links with `https://wa.me/918083675985` |

---

## 📱 SOCIAL MEDIA LINKS

To add real social links, in `index.html` find `.footer-social` and update:
```html
<a href="https://www.instagram.com/keepsy_official" class="social-link" title="Instagram">📸</a>
<a href="https://wa.me/918083675985" class="social-link" title="WhatsApp">💬</a>
<a href="https://www.pinterest.com/keepsy" class="social-link" title="Pinterest">📌</a>
```

---

## 🔧 TECH STACK

- **HTML5** — Semantic, accessible markup
- **CSS3** — Custom properties, Grid, Flexbox, animations
- **Vanilla JavaScript** — No frameworks, no dependencies
- **Google Fonts** — Cormorant Garamond (serif) + Jost (sans-serif)
- **Hosting** — GitHub Pages (free)

---

## 📞 SUPPORT

For help with the website, WhatsApp: **+91 8083675985**

---

*Built with ❤️ for Keepsy — Turn Your Memories into Keepsakes*
