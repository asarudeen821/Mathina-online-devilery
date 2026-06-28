// ─────────────────────────────────────────────────────────────
// Mathina FreshHub — Enhanced SLM Chatbot Engine
// Works 100% on the frontend — no backend required
// Features: Step-by-step cooking instructions for ANY food
// ─────────────────────────────────────────────────────────────

// ── COOKING METHOD TEMPLATES ─────────────────────────────────
const COOKING_METHODS = {
  fry: {
    name: 'Pan Fry',
    time: '15-20 mins',
    temp: 'Medium-High heat',
    steps: [
      'Heat oil in a pan over medium-high heat',
      'Season the food with salt and pepper',
      'Place in hot pan, cook until golden (4-5 mins per side)',
      'Flip and cook other side until done',
      'Rest for 2-3 mins before serving',
    ],
  },
  deepFry: {
    name: 'Deep Fry',
    time: '10-15 mins',
    temp: '180°C (350°F)',
    steps: [
      'Heat oil in deep fryer or heavy pot to 180°C',
      'Coat food in batter or breadcrumbs',
      'Carefully lower into hot oil',
      'Fry until golden brown and crispy',
      'Drain on paper towels',
      'Serve immediately while hot',
    ],
  },
  grill: {
    name: 'Grill',
    time: '15-25 mins',
    temp: 'High heat (200-230°C)',
    steps: [
      'Preheat grill to high heat',
      'Oil the grates to prevent sticking',
      'Season food with marinade or spices',
      'Place on grill, cook with lid closed',
      'Flip halfway through cooking',
      'Check internal temperature for doneness',
      'Rest before serving',
    ],
  },
  bake: {
    name: 'Bake/Roast',
    time: '25-60 mins',
    temp: '180-200°C (350-400°F)',
    steps: [
      'Preheat oven to temperature',
      'Season and prepare the food',
      'Place on baking tray or in dish',
      'Cook in center rack of oven',
      'Turn/flip halfway for even cooking',
      'Check doneness with thermometer',
      'Rest before carving',
    ],
  },
  curry: {
    name: 'Curry/Gravy',
    time: '30-45 mins',
    temp: 'Simmer on low-medium',
    steps: [
      'Heat oil, sauté onions until golden',
      'Add ginger-garlic paste, cook 2 mins',
      'Add spices, cook until fragrant',
      'Add tomatoes, cook until oil separates',
      'Add main ingredient, mix well',
      'Add water, cover and simmer',
      'Cook until tender and flavors meld',
      'Garnish with fresh herbs',
    ],
  },
  stirFry: {
    name: 'Stir Fry',
    time: '10-15 mins',
    temp: 'Very high heat',
    steps: [
      'Heat wok or large pan on high',
      'Add oil, swirl to coat',
      'Add protein, stir fry 3-4 mins',
      'Remove, set aside',
      'Add vegetables, stir fry 2-3 mins',
      'Return protein to pan',
      'Add sauce, toss to coat',
      'Serve immediately',
    ],
  },
  steam: {
    name: 'Steam',
    time: '15-30 mins',
    temp: 'Boiling water steam',
    steps: [
      'Fill pot with 2 inches of water',
      'Bring to boil',
      'Place food in steamer basket',
      'Set basket over boiling water',
      'Cover tightly with lid',
      'Steam until cooked through',
      'Check water level, add more if needed',
      'Serve with dipping sauce',
    ],
  },
};

// ── INGREDIENT PAIRINGS ──────────────────────────────────────
const INGREDIENT_PAIRINGS = {
  chicken: {
    spices: ['turmeric', 'red chilli powder', 'garam masala', 'cumin', 'coriander', 'paprika'],
    sauces: ['soy sauce', 'chilli sauce', 'tomato sauce', 'oyster sauce', 'teriyaki'],
    herbs: ['coriander', 'mint', 'curry leaves', 'thyme', 'rosemary', 'oregano'],
    sides: ['rice', 'roti', 'naan', 'salad', 'raita', 'fries'],
  },
  mutton: {
    spices: ['garam masala', 'cardamom', 'cinnamon', 'cloves', 'bay leaf', 'fennel'],
    sauces: ['yogurt', 'tomato puree', 'coconut milk'],
    herbs: ['mint', 'coriander', 'curry leaves'],
    sides: ['biryani rice', 'roti', 'naan', 'paratha'],
  },
  fish: {
    spices: ['turmeric', 'red chilli', 'pepper', 'lemon pepper', 'paprika'],
    sauces: ['lemon juice', 'soy sauce', 'mustard sauce'],
    herbs: ['dill', 'parsley', 'coriander', 'curry leaves'],
    sides: ['rice', 'mashed potatoes', 'grilled vegetables'],
  },
  egg: {
    spices: ['pepper', 'salt', 'paprika', 'cumin', 'turmeric'],
    sauces: ['ketchup', 'hot sauce', 'mayonnaise'],
    herbs: ['parsley', 'chives', 'coriander'],
    sides: ['toast', 'rice', 'roti', 'salad'],
  },
  vegetables: {
    spices: ['cumin', 'mustard seeds', 'turmeric', 'garam masala'],
    sauces: ['tomato', 'coconut milk', 'soy sauce'],
    herbs: ['coriander', 'curry leaves', 'mint'],
    sides: ['rice', 'roti', 'dal', 'raita'],
  },
};

// ── KNOWLEDGE BASE ───────────────────────────────────────────
const KNOWLEDGE_BASE = [
  // ── DRAGON CHICKEN ──────────────────────────────────────────
  {
    patterns: ['dragon chicken', 'dragon cut', 'dragon recipe', 'how to cook dragon'],
    response: `🐉 *Dragon Chicken Recipe*

**Ingredients (serves 3-4):**
• 500g Dragon Cut chicken
• 2 tbsp soy sauce
• 1 tbsp chilli sauce
• 1 tsp ginger-garlic paste
• 1 egg white
• 2 tbsp cornflour
• 2 green chillies (slit)
• 1 onion (sliced)
• Bell peppers (optional)
• Oil for frying

**Steps:**
1. Marinate chicken with soy sauce, chilli sauce, ginger-garlic paste, egg white & cornflour for 30 mins
2. Deep fry marinated pieces until golden & crispy (8-10 mins)
3. In a wok, heat 2 tbsp oil — sauté onions & green chillies
4. Add fried chicken, toss with extra soy sauce & chilli sauce
5. Garnish with spring onions & serve hot 🔥

⏱️ Total time: 45 mins
💡 Tip: Use Dragon Cut for best presentation — the long pieces look stunning!`,
  },

  // ── SHAWARMA ────────────────────────────────────────────────
  {
    patterns: ['shawarma', 'awarema', 'chicken shawarma', 'shawarma recipe', 'how to make shawarma'],
    response: `🌯 *Chicken Shawarma Recipe*

**Ingredients (serves 4):**
• 500g Shawarma Slices / Boneless chicken
• 3 tbsp yogurt
• 1 tsp cumin powder
• 1 tsp coriander powder
• 1 tsp paprika / red chilli powder
• ½ tsp turmeric
• 1 tbsp lemon juice
• 2 tbsp olive oil / regular oil
• Salt to taste

**For serving:**
• Pita bread / flatbread
• Garlic sauce (mayo + garlic)
• Sliced onions, tomatoes, cucumber
• Pickles

**Steps:**
1. Mix all marinade ingredients with chicken — marinate 2 hours (overnight = best)
2. Cook on a hot pan/grill for 10-12 mins, turning once
3. Slice into thin strips
4. Warm pita bread, spread garlic sauce
5. Layer chicken, veggies & roll tightly 🌯

⏱️ Total time: 30 mins (+ marination)
💡 Tip: Shawarma Slices from Mathina FreshHub are pre-cut thin — saves prep time!`,
  },

  // ── CHICKEN TIKKA ───────────────────────────────────────────
  {
    patterns: ['chicken tikka', 'tikka recipe', 'how to cook tikka', 'tikka masala', 'malai tikka'],
    response: `🍢 *Chicken Tikka Recipe*

**Ingredients (serves 3-4):**
• 500g Chicken Tikka pieces / Cube Cut
• 4 tbsp thick yogurt
• 1 tbsp ginger-garlic paste
• 1 tsp red chilli powder
• 1 tsp garam masala
• 1 tsp cumin powder
• 1 tbsp lemon juice
• 2 tbsp oil
• Salt & food colour (optional)

**Steps:**
1. Mix all marinade ingredients — coat chicken well
2. Marinate for minimum 2 hours (4 hours = best)
3. Thread onto skewers or place on baking tray
4. Grill/bake at 220°C for 15-18 mins, turning halfway
5. Brush with butter in last 2 mins for shine
6. Serve with mint chutney & onion rings 🧅

⏱️ Total time: 25 mins (+ marination)
💡 For *Malai Tikka*: Replace chilli with cream + cashew paste for a mild, creamy version!`,
  },

  // ── BIRYANI ─────────────────────────────────────────────────
  {
    patterns: ['biryani', 'chicken biryani', 'how to make biryani', 'biryani recipe', 'biryani cut'],
    response: `🍛 *Chicken Biryani Recipe*

**Ingredients (serves 4-5):**
• 1 kg Big Curry Cut / Biryani Cut chicken
• 2 cups basmati rice (soaked 30 mins)
• 2 large onions (thinly sliced, fried golden)
• 1 cup yogurt
• 2 tbsp ginger-garlic paste
• 1 tsp biryani masala
• ½ tsp turmeric
• Whole spices: bay leaf, cardamom, cloves, cinnamon
• Fresh mint & coriander
• Saffron in warm milk (optional)
• Ghee 2 tbsp

**Steps:**
1. Marinate chicken with yogurt, ginger-garlic, spices — 1 hour
2. Cook marinated chicken in a pot until 70% done
3. Parboil rice with whole spices until 70% cooked
4. Layer: chicken → rice → fried onions → mint → saffron milk
5. Seal pot with foil/dough, cook on low flame 25-30 mins (dum)
6. Gently mix before serving 🍛

⏱️ Total time: 1.5 hours
💡 Tip: Big Curry Cut from Mathina FreshHub gives the best biryani flavor — bone-in pieces add richness!`,
  },

  // ── CHICKEN CURRY ───────────────────────────────────────────
  {
    patterns: ['chicken curry', 'curry recipe', 'how to make curry', 'curry cut recipe', 'gravy chicken'],
    response: `🍲 *Chicken Curry Recipe*

**Ingredients (serves 4):**
• 1 kg Small/Big Curry Cut chicken
• 3 onions (finely chopped)
• 2 tomatoes (pureed)
• 2 tbsp ginger-garlic paste
• 1 tsp turmeric
• 2 tsp red chilli powder
• 2 tsp coriander powder
• 1 tsp garam masala
• Oil 3 tbsp
• Fresh coriander for garnish

**Steps:**
1. Heat oil — fry onions until golden brown (10 mins)
2. Add ginger-garlic paste, cook 2 mins
3. Add tomato puree + all spice powders — cook until oil separates
4. Add chicken pieces, mix well to coat with masala
5. Add 1 cup water, cover & cook 20-25 mins on medium flame
6. Finish with garam masala & fresh coriander 🌿

⏱️ Total time: 45 mins
💡 Tip: Small Curry Cut cooks faster; Big Curry Cut gives richer gravy!`,
  },

  // ── CHICKEN 65 ──────────────────────────────────────────────
  {
    patterns: ['chicken 65', '65 recipe', 'how to make chicken 65', 'crispy chicken'],
    response: `🌶️ *Chicken 65 Recipe*

**Ingredients (serves 3-4):**
• 500g Chicken 65 Pieces (boneless)
• 2 tbsp yogurt
• 1 tbsp ginger-garlic paste
• 1 tsp red chilli powder
• ½ tsp turmeric
• 2 tbsp cornflour
• 1 tbsp rice flour (for extra crunch)
• Curry leaves & green chillies
• Oil for deep frying

**Steps:**
1. Marinate chicken with all ingredients except curry leaves — 30 mins
2. Deep fry in hot oil until golden & crispy (6-8 mins)
3. In a separate pan: heat 1 tbsp oil, add curry leaves & green chillies
4. Toss fried chicken in this tempering
5. Squeeze lemon juice & serve immediately 🍋

⏱️ Total time: 40 mins
💡 Tip: Mathina FreshHub's Chicken 65 Pieces are pre-cut to the perfect bite size!`,
  },

  // ── LOLLIPOP ────────────────────────────────────────────────
  {
    patterns: ['lollipop', 'chicken lollipop', 'lollipop recipe', 'how to make lollipop'],
    response: `🍭 *Chicken Lollipop Recipe*

!Chicken Lollipop

**Ingredients (serves 3-4):**
• 500g Chicken Lollipop pieces
• 2 tbsp soy sauce
• 1 tbsp red chilli sauce
• 1 tbsp ginger-garlic paste
• 1 egg
• 3 tbsp cornflour
• 1 tsp pepper powder
• Oil for frying

**For sauce:**
• 2 tbsp butter
• 1 tbsp soy sauce
• 1 tbsp chilli sauce
• 1 tsp honey

**Steps:**
1. Marinate lollipops with all ingredients — 1 hour
2. Deep fry until golden & cooked through (10-12 mins)
3. Make sauce: melt butter, add soy + chilli sauce + honey
4. Toss fried lollipops in sauce
5. Serve with toothpicks for easy eating 🍭

⏱️ Total time: 30 mins (+ marination)
💡 Perfect party starter — kids & adults love them!`,
  },

  // ── GRILLED CHICKEN ─────────────────────────────────────────
  {
    patterns: ['grilled chicken', 'grill chicken', 'how to grill', 'butterfly grill', 'grilling recipe'],
    response: `🔥 *Grilled Chicken Recipe*

**Ingredients (serves 3-4):**
• 500g Butterfly Cut / Breast Fillet
• 3 tbsp olive oil
• 2 tbsp lemon juice
• 1 tbsp ginger-garlic paste
• 1 tsp mixed herbs (oregano, thyme)
• 1 tsp paprika / red chilli powder
• Salt & pepper

**Steps:**
1. Score the chicken with a knife for better marinade penetration
2. Mix all marinade ingredients — coat chicken thoroughly
3. Marinate minimum 2 hours (overnight = best)
4. Preheat grill/pan to high heat
5. Grill 6-7 mins per side until char marks appear
6. Rest 5 mins before cutting — keeps juices in!
7. Serve with lemon wedges & salad 🥗

⏱️ Total time: 20 mins (+ marination)
💡 Butterfly Cut from Mathina FreshHub is perfect for grilling — cooks evenly!`,
  },

  // ── WINGS ───────────────────────────────────────────────────
  {
    patterns: ['chicken wings', 'wings recipe', 'how to cook wings', 'bbq wings', 'buffalo wings'],
    response: `🍗 *Crispy Chicken Wings Recipe*

**Ingredients (serves 3-4):**
• 500g Chicken Wings
• 2 tbsp soy sauce
• 1 tbsp hot sauce / red chilli sauce
• 1 tbsp honey
• 1 tsp garlic powder
• 1 tsp paprika
• Salt & pepper
• 2 tbsp cornflour (for crispiness)

**Steps:**
1. Pat wings dry with paper towel (key for crispiness!)
2. Toss with cornflour, salt & pepper
3. Bake at 220°C for 25 mins, flip halfway
4. Mix soy sauce + hot sauce + honey + garlic powder
5. Toss baked wings in sauce
6. Bake 5 more mins until caramelized 🍯

⏱️ Total time: 40 mins
💡 Tip: Drying the wings before cooking = extra crispy skin!`,
  },

  // ── DRUMSTICKS ──────────────────────────────────────────────
  {
    patterns: ['drumstick', 'drumsticks', 'chicken legs', 'how to cook drumsticks', 'leg piece'],
    response: `🍗 *Spicy Chicken Drumsticks Recipe*

**Ingredients (serves 4):**
• 8 Chicken Drumsticks
• 3 tbsp yogurt
• 1 tbsp ginger-garlic paste
• 1 tsp turmeric
• 2 tsp red chilli powder
• 1 tsp garam masala
• 1 tbsp lemon juice
• Oil 2 tbsp

**Steps:**
1. Make deep cuts in drumsticks for marinade to penetrate
2. Mix all marinade — coat drumsticks well
3. Marinate 2-4 hours
4. Pan fry on medium heat 8 mins per side until cooked
5. OR bake at 200°C for 30-35 mins
6. Serve with mint chutney 🌿

⏱️ Total time: 40 mins (+ marination)
💡 Deep cuts = more flavor absorption!`,
  },

  // ── CUBE CUT / STIR FRY ─────────────────────────────────────
  {
    patterns: ['cube cut', 'stir fry', 'fried rice chicken', 'noodles chicken', 'how to cook cube cut'],
    response: `🥘 *Chicken Stir Fry (Cube Cut)*

**Ingredients (serves 3):**
• 500g Cube Cut chicken
• 2 tbsp soy sauce
• 1 tbsp oyster sauce
• 1 tsp sesame oil
• 1 tbsp ginger-garlic paste
• Mixed vegetables (capsicum, carrot, beans)
• Spring onions
• Oil 2 tbsp

**Steps:**
1. Marinate cube cut with soy sauce, ginger-garlic — 15 mins
2. Heat wok on high flame — add oil
3. Stir fry chicken on high heat 5-6 mins until cooked
4. Add vegetables — stir fry 3 mins (keep crunchy)
5. Add oyster sauce + sesame oil — toss well
6. Garnish with spring onions & serve with rice/noodles 🍜

⏱️ Total time: 25 mins
💡 High heat = restaurant-style stir fry!`,
  },

  // ── FINGER CUT ──────────────────────────────────────────────
  {
    patterns: ['finger cut', 'chicken fingers', 'chicken strips', 'how to cook finger cut'],
    response: `🍟 *Crispy Chicken Fingers Recipe*

**Ingredients (serves 3-4):**
• 500g Finger Cut chicken strips
• 1 cup breadcrumbs
• ½ cup flour
• 2 eggs (beaten)
• 1 tsp garlic powder
• 1 tsp paprika
• Salt & pepper
• Oil for frying

**Steps:**
1. Season flour with garlic powder, paprika, salt & pepper
2. Dip chicken strips: flour → egg → breadcrumbs
3. Press breadcrumbs firmly onto chicken
4. Deep fry at 180°C for 8-10 mins until golden
5. Drain on paper towel
6. Serve with ketchup or honey mustard dip 🍯

⏱️ Total time: 30 mins
💡 Double coat (flour→egg→breadcrumbs→egg→breadcrumbs) for extra crunch!`,
  },

  // ── JULIENNE CUT ────────────────────────────────────────────
  {
    patterns: ['julienne cut', 'julienne chicken', 'thin chicken strips', 'how to cook julienne', 'chicken noodles', 'chicken fried rice'],
    response: `🥢 *Julienne Chicken Stir Fry Recipe*

**Ingredients (serves 3-4):**
• 500g Julienne Cut chicken
• 2 tbsp soy sauce
• 1 tbsp oyster sauce
• 1 tbsp chili sauce
• 1 tsp sesame oil
• 1 tbsp ginger-garlic paste
• 200g noodles or cooked rice
• Mixed vegetables (capsicum, carrot, cabbage)
• Spring onions
• Oil 2 tbsp

**Steps:**
1. Marinate julienne chicken with soy sauce & ginger-garlic — 10 mins
2. Heat wok on HIGH flame — add oil
3. Stir fry julienne chicken for 3-4 mins (cooks very fast!)
4. Remove chicken, set aside
5. Add vegetables to wok — stir fry 2 mins
6. Add noodles/rice back + chicken
7. Add oyster sauce, chili sauce, sesame oil
8. Toss everything together — 1 min
9. Garnish with spring onions & serve hot 🍜

⏱️ Total time: 15 mins (fastest cut!)
💡 Julienne cut cooks in 3-4 mins — don't overcook or it becomes dry!

**Best For:**
✅ Noodles (Hakka, Singapore, Chow Mein)
✅ Fried Rice (Chicken Fried Rice, Schezwan)
✅ Wraps & Rolls
✅ Quick stir fry with vegetables
✅ Asian dishes (Thai, Chinese, Korean)

🔥 Why Julienne? Ultra-thin strips = fastest cooking + maximum flavor absorption!`,
  },

  // ── WHOLE CHICKEN ───────────────────────────────────────────
  {
    patterns: ['whole chicken', 'roast chicken', 'how to roast', 'full chicken recipe'],
    response: `🐔 *Roast Whole Chicken Recipe*

**Ingredients (serves 5-6):**
• 1 Whole Chicken (1.5-2 kg)
• 3 tbsp butter (softened)
• 1 tbsp ginger-garlic paste
• 1 tsp mixed herbs
• 1 tsp paprika
• 1 lemon (halved)
• Salt & pepper
• Vegetables for roasting (optional)

**Steps:**
1. Pat chicken dry inside and out
2. Mix butter + ginger-garlic + herbs + paprika + salt
3. Rub butter mixture all over chicken, including under skin
4. Stuff cavity with lemon halves
5. Tie legs together with string
6. Roast at 200°C for 60-75 mins (baste every 20 mins)
7. Rest 10 mins before carving 🔪

⏱️ Total time: 1.5 hours
💡 Internal temp should reach 74°C for safe eating!`,
  },

  // ── PRICES ──────────────────────────────────────────────────
  {
    patterns: ['price', 'cost', 'how much', 'rate', 'kg price', 'today price', 'current price'],
    response: `💰 *Today's Chicken Prices at Mathina FreshHub*

| Cut | Price |
|-----|-------|
| 🔪 Cube Cut | ₹270/kg |
| 🐉 Dragon Cut | ₹290/kg |
| 🦋 Butterfly Cut | ₹320/kg |
| 🌶️ Chicken 65 Pieces | ₹300/kg |
| 🍟 Finger Cut | ₹280/kg |
| 🥢 Julienne Cut | ₹290/kg |
| 🍭 Lollipop | ₹310/kg |
| 🍲 Small Curry Cut | ₹240/kg |
| 🍛 Big Curry Cut | ₹240/kg |
| 🍗 Chicken Wings | ₹220/kg |
| 🐔 Whole Chicken | ₹200/kg |

📞 Call for bulk orders: +91 77080 32726
🕐 Fresh cuts daily: 6 AM – 10 PM`,
  },

  // ── DELIVERY ────────────────────────────────────────────────
  {
    patterns: ['delivery', 'how long', 'when deliver', 'delivery time', 'same day'],
    response: `🚚 *Delivery Information*

✅ **Same Day Delivery** — Order before 2 PM
⏰ **Delivery Hours:** 6 AM – 10 PM (Mon–Sun)
📍 **Location:** Cuddalore & nearby areas
💰 **Free Delivery** on orders above ₹500

**Delivery Slots:**
• 🌅 Morning: 6 AM – 12 PM
• ☀️ Afternoon: 12 PM – 5 PM
• 🌆 Evening: 5 PM – 10 PM

📞 For urgent orders: +91 77080 32726
📱 WhatsApp: +91 80566 94908`,
  },

  // ── SHOP INFO ───────────────────────────────────────────────
  {
    patterns: ['shop', 'address', 'location', 'where', 'contact', 'phone', 'owner', 'shajan'],
    response: `### 🏢 Corporate Profile: Mathina FreshHub

| Attribute | Specification |
| :--- | :--- |
| **Lead Partner** | Shajan A.J. |
| **Operations** | Cuddalore OT, Tamil Nadu - 607003 |
| **Direct Voice** | +91 77080 32726 |
| **Enterprise Support** | MathinaFreshHub@gmail.com |
| **Operating Cycle** | 06:00 - 22:00 IST |

**Compliance:** 
- ✅ Halal Certified 
- ✅ Daily Cold-Chain Processing`,
  },

  // ── MARINATION TIPS ─────────────────────────────────────────
  {
    patterns: ['marinate', 'marination', 'how to marinate', 'marinade tips', 'marinating time'],
    response: `🧂 *Chicken Marination Guide*

**Basic Marinade (works for any cut):**
• Yogurt 3 tbsp
• Ginger-garlic paste 1 tbsp
• Red chilli powder 1 tsp
• Turmeric ½ tsp
• Lemon juice 1 tbsp
• Salt to taste
• Oil 1 tbsp

**Marination Times:**
• ⚡ Quick: 30 mins (minimum)
• ✅ Good: 2 hours
• 🌟 Best: Overnight in fridge

**Tips:**
1. Score/cut deep into meat for better absorption
2. Always marinate in fridge (not room temp)
3. Bring to room temp 30 mins before cooking
4. Pat dry before frying for crispiness
5. Add cornflour for crispy coating`,
  },

  // ── COOKING TIPS ────────────────────────────────────────────
  {
    patterns: ['cooking tips', 'tips', 'how to cook chicken', 'chicken cooking', 'best way to cook'],
    response: `👨‍🍳 *Chicken Cooking Tips*

**Temperature Guide:**
• Internal temp must reach **74°C (165°F)** for safe eating
• Use a meat thermometer for accuracy

**Cut-wise Cooking Methods:**
| Cut | Best Method |
|-----|-------------|
| Cube Cut | Stir fry, high heat |
| Butterfly | Grill, pan fry |
| Dragon Cut | Deep fry, then toss |
| Julienne Cut | Quick stir fry (3-4 mins) |
| Curry Cut | Slow cook in gravy |
| Wings | Bake then sauce |
| Drumsticks | Pan fry or bake |
| Whole Chicken | Roast in oven |

**Golden Rules:**
1. 🌡️ Never cook cold chicken — bring to room temp first
2. 🔥 Don't overcrowd the pan — cook in batches
3. ⏸️ Rest meat 5 mins after cooking
4. 🧂 Season generously — chicken needs salt!`,
  },

  // ── HALAL ───────────────────────────────────────────────────
  {
    patterns: ['halal', 'certified', 'organic', 'fresh', 'quality'],
    response: `✅ *Our Quality Promise*

🕌 **Halal Certified** — All chicken is halal certified
🌿 **Fresh Daily** — Processed every morning, never frozen
🏥 **Antibiotic-Free** — Selected organic cuts available
🔪 **Hygienic Processing** — Clean facility, strict quality control
🚫 **No Preservatives** — 100% natural chicken

📞 For quality queries: +91 77080 32726`,
  },

  // ── GREETING ────────────────────────────────────────────────
  {
    patterns: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'vanakkam', 'namaste'],
    response: `👋 *Welcome to Mathina FreshHub!*
I'm your AI Executive Chef. How can I help you in the kitchen today? 👨‍🍳

I can help you with:
• 🍳 **Recipes** — Dragon Chicken, Biryani, Shawarma, Tikka & more
• 💰 **Prices** — Today's kg rates for all cuts
• 📞 **Contact** — Call or WhatsApp for orders
• 📧 **Support** — Reach us at MathinaFreshHub@gmail.com
• 🔪 **Cuts Guide** — Which cut for which dish
• 🚚 **Delivery** — Timing & areas
• 📞 **Contact** — Shop info & ordering

*Try asking:*
"How to cook dragon chicken?"
"What is the price of biryani cut?"
"How to make chicken shawarma?"`,
  },

  // ── THANKS ──────────────────────────────────────────────────
  {
    patterns: ['thank', 'thanks', 'thank you', 'ok', 'okay', 'great', 'good', 'nice'],
    response: `😊 You're welcome! Happy cooking! 🍗

Feel free to ask anytime:
• More recipes 🍳
• Prices & availability 💰
• Delivery info 🚚

📞 To order: +91 77080 32726
📱 WhatsApp: +91 80566 94908`,
  },
];

// ── DYNAMIC RECIPE GENERATOR ─────────────────────────────────
// Generates step-by-step recipes for ANY food item
const generateRecipe = (foodItem, cookingMethod = 'curry') => {
  const food = foodItem.toLowerCase();
  const method = COOKING_METHODS[cookingMethod] || COOKING_METHODS.curry;
  
  // Detect protein type
  let protein = 'chicken';
  if (food.includes('mutton') || food.includes('lamb') || food.includes('goat')) protein = 'mutton';
  else if (food.includes('fish') || food.includes('prawn') || food.includes('shrimp')) protein = 'fish';
  else if (food.includes('egg')) protein = 'egg';
  else if (food.includes('paneer') || food.includes('vegetable') || food.includes('veg')) protein = 'vegetables';

  const pairings = INGREDIENT_PAIRINGS[protein];

  return `🍳 *Step-by-Step ${foodItem} Recipe*

**Cooking Method:** ${method.name}
⏱️ **Prep Time:** 15 mins
⏱️ **Cook Time:** ${method.time}
🍽️ **Serves:** 3-4 people

**Ingredients You'll Need:**
• 500g ${foodItem} (cut into pieces)
• 2 onions (finely chopped)
• 2 tomatoes (pureed)
• 1 tbsp ginger-garlic paste
• 2 green chillies (slit)
• ${pairings.spices.slice(0, 3).join(', ')}
• Fresh ${pairings.herbs[0]} for garnish
• Oil 3 tbsp
• Salt to taste
• Water as needed

**Step-by-Step Instructions:**

${method.steps.map((step, i) => `${i + 1}. ${step}`).join('\n\n')}

**Serving Suggestion:**
Serve hot with ${pairings.sides.slice(0, 2).join(' or ')}!

💡 **Pro Tips:**
• Marinate ${foodItem} for 30 mins for better flavor
• Don't overcrowd the pan - cook in batches if needed
• Taste and adjust salt/spices at the end
• Fresh herbs at the end add amazing aroma!

⚠️ **Food Safety:**
• Ensure ${protein} is cooked to 74°C internal temperature
• Wash hands after handling raw ${protein}
• Use separate cutting boards for meat and vegetables

*Want a different style? Ask me for:*
• "${foodItem} fry" - for dry version
• "${foodItem} curry" - for gravy version
• "${foodItem} biryani" - for biryani style
• "grilled ${foodItem}" - for grilled version`;
};

// ── NAVIGATION ROUTES MAP ─────────────────────────────────────
export const NAVIGATION_ROUTES = {
  'products': {
    path: '/products',
    patterns: ['products', 'product list', 'browse', 'shop', 'view all', 'see products', 'show products', 'open products'],
    label: 'Products Page',
    response: '🛒 Opening Products page for you...',
  },
  'home': {
    path: '/',
    patterns: ['home', 'homepage', 'main page', 'go home'],
    label: 'Home Page',
    response: '🏠 Taking you to Home page...',
  },
  'qr-scanner': {
    path: '/qr-scan',
    patterns: ['qr', 'scanner', 'qr scanner', 'qr code', 'scan qr', 'scan code', 'open scanner'],
    label: 'QR Scanner',
    response: '📱 Opening QR Scanner...',
  },
  'cart': {
    path: '/cart',
    patterns: ['cart', 'my cart', 'view cart', 'open cart', 'shopping cart'],
    label: 'Cart',
    response: '🛒 Opening your Cart...',
  },
  'orders': {
    path: '/orders',
    patterns: ['my orders', 'orders', 'order history', 'view orders', 'see orders', 'track order'],
    label: 'My Orders',
    response: '📦 Opening your Orders page...',
  },
  'profile': {
    path: '/profile',
    patterns: ['profile', 'my profile', 'account', 'my account', 'open profile'],
    label: 'Profile',
    response: '👤 Opening your Profile...',
  },
  'subscriptions': {
    path: '/subscriptions',
    patterns: ['subscription', 'subscriptions', 'my subscription', 'view subscription'],
    label: 'Subscriptions',
    response: '📅 Opening Subscriptions page...',
  },
  'ai-recipes': {
    path: '/ai-recipes',
    patterns: ['ai recipe', 'recipe generator', 'ai recipes', 'generate recipe', 'open recipes'],
    label: 'AI Recipes',
    response: '👨‍🍳 Opening AI Recipe Generator...',
  },
  'admin': {
    path: '/admin',
    patterns: ['admin', 'dashboard', 'admin dashboard', 'open admin'],
    label: 'Admin Dashboard',
    response: '📊 Opening Admin Dashboard...',
  },
  'admin-products': {
    path: '/admin/products',
    patterns: ['admin products', 'manage products', 'product management'],
    label: 'Manage Products',
    response: '📦 Opening Product Management...',
  },
  'admin-orders': {
    path: '/admin/orders',
    patterns: ['admin orders', 'manage orders', 'order management'],
    label: 'Manage Orders',
    response: '📋 Opening Order Management...',
  },
};

// ── NAVIGATION DETECTION ──────────────────────────────────────
export const detectNavigation = (message) => {
  const msg = message.toLowerCase().trim();
  
  for (const [key, route] of Object.entries(NAVIGATION_ROUTES)) {
    if (route.patterns.some(pattern => msg.includes(pattern) || msg.includes(pattern.replace(' ', '')))) {
      return {
        type: 'navigation',
        route: route.path,
        label: route.label,
        message: route.response,
      };
    }
  }
  
  return null; // No navigation detected
};

// ── SLM Engine ───────────────────────────────────────────────
export const slmRespond = (userMessage) => {
  const msg = userMessage.toLowerCase().trim();

  // Check for "how to cook/make" patterns for ANY food
  const howToPatterns = [
    'how to cook',
    'how to make',
    'how to prepare',
    'recipe for',
    'cook',
    'make',
    'prepare',
  ];

  for (const pattern of howToPatterns) {
    if (msg.includes(pattern)) {
      // Extract food item from query
      const foodWords = msg
        .replace(pattern, '')
        .replace('?', '')
        .trim()
        .split(' ')
        .filter((w) => w.length > 2);

      if (foodWords.length > 0) {
        const foodItem = foodWords.join(' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        
        // Detect cooking method from query
        let method = 'curry';
        if (msg.includes('fry') || msg.includes('dry')) method = 'fry';
        else if (msg.includes('grill') || msg.includes('roast')) method = 'grill';
        else if (msg.includes('bake') || msg.includes('oven')) method = 'bake';
        else if (msg.includes('biryani') || msg.includes('pulao')) method = 'curry';
        else if (msg.includes('curry') || msg.includes('gravy')) method = 'curry';
        else if (msg.includes('stir fry') || msg.includes('noodles') || msg.includes('rice')) method = 'stirFry';

        return generateRecipe(foodItem, method);
      }
    }
  }

  // Find best matching knowledge entry
  for (const entry of KNOWLEDGE_BASE) {
    if (entry.patterns.some((p) => msg.includes(p))) {
      return entry.response;
    }
  }

  // Fuzzy fallback — check partial word matches
  const words = msg.split(' ').filter((w) => w.length > 3);
  for (const word of words) {
    for (const entry of KNOWLEDGE_BASE) {
      if (entry.patterns.some((p) => p.includes(word) || word.includes(p.split(' ')[0]))) {
        return entry.response;
      }
    }
  }

  // Default fallback with enhanced suggestions
  return `🤔 I didn't quite understand that. But I can help you cook ANYTHING! 🍳

**Just ask me:**
• "How to cook [any dish]?" - I'll give step-by-step recipe
• "How to make [any food]?" - Full cooking instructions
• "[dish] recipe" - Complete ingredients & method
• "Grill/Fry/Bake [food]" - Specific cooking method

**Popular Requests:**
🍗 "How to cook chicken biryani?"
🌯 "How to make shawarma?"
🍢 "Chicken tikka recipe"
🥘 "How to cook mutton curry?"
🐟 "Fish fry recipe"
🥗 "How to make vegetable stir fry?"

**Or ask about:**
💰 Today's prices at Mathina FreshHub
🚚 Delivery information
📞 Shop contact details

*Type your cooking question and I'll guide you step-by-step!* 👨‍🍳`;
};

// Quick suggestion chips
export const QUICK_SUGGESTIONS = [
  { label: '🍳 Any Recipe', query: 'How to cook?' },
  { label: '🐉 Dragon Chicken', query: 'How to cook dragon chicken?' },
  { label: '🌯 Shawarma', query: 'How to make chicken shawarma?' },
  { label: '🍢 Chicken Tikka', query: 'How to cook chicken tikka?' },
  { label: '🍛 Biryani', query: 'How to make chicken biryani?' },
  { label: '🌶️ Chicken 65', query: 'How to make chicken 65?' },
  { label: '🍭 Lollipop', query: 'How to make chicken lollipop?' },
  { label: '🔥 Grilled', query: 'How to grill chicken?' },
  { label: '🥘 Mutton Curry', query: 'How to cook mutton curry?' },
  { label: '🐟 Fish Fry', query: 'How to make fish fry?' },
  { label: '🥗 Veg Stir Fry', query: 'How to cook vegetable stir fry?' },
  { label: '🍳 Egg Curry', query: 'How to make egg curry?' },
  { label: '💰 Today Prices', query: 'What are today chicken prices?' },
  { label: '🚚 Delivery', query: 'Delivery information' },
];
