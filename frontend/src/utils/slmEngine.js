// ─────────────────────────────────────────────────────────────
// Mathina Chicken Center — Enhanced SLM Chatbot Engine
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
💡 Tip: Shawarma Slices from Mathina Chicken Center are pre-cut thin — saves prep time!`,
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
    patterns: [
      'biryani',
      'briyani',
      'biriyani',
      'chicken biryani',
      'chicken briyani',
      'how to make biryani',
      'how to cook biryani',
      'how to cock briyani',
      'how to cook briyani',
      'how to make briyani',
      'biryani recipe',
      'briyani recipe',
      'dum biryani',
      'biryani cut',
      'biriyani recipe',
    ],
    response: `🍛 *Master Chef Chicken Biryani Recipe*

**Recommended Cut:** 🍲 **Mathina Big Curry Cut / Biryani Cut** (Bone-in cuts lock in rich marrow juices during dum cooking!)

**Ingredients (serves 4-5):**
• 1 kg Mathina Big Curry Cut / Biryani Cut chicken
• 2 cups aged Basmati Rice (soaked 30 mins)
• 2 large onions (thinly sliced & fried golden - birista)
• 1 cup fresh yogurt (curd)
• 2 tbsp ginger-garlic paste
• 1.5 tbsp biryani masala powder
• 1 tsp red chilli powder & 1/2 tsp turmeric
• Whole spices: bay leaf, 3 green cardamoms, 4 cloves, 1 inch cinnamon, 1 star anise
• 1/2 cup fresh mint & chopped coriander leaves
• Warm saffron milk (a pinch of saffron in 3 tbsp warm milk)
• 3 tbsp Pure Desi Ghee + 2 tbsp oil
• Juice of 1/2 lemon + Salt to taste

**Master Chef Step-by-Step Instructions:**
1. **The Marination:** Marinate Mathina Biryani Cut chicken with yogurt, ginger-garlic paste, biryani masala, chilli powder, turmeric, half of the fried onions, mint, coriander, lemon juice, and salt. Rest for at least 45-60 minutes.
2. **Sear Chicken:** Heat 2 tbsp ghee/oil in a heavy handi. Sauté marinated chicken on high heat for 6-8 minutes until 70% cooked. Turn off flame.
3. **Parboil Basmati Rice:** In a large pot of rolling boiling water with whole spices and salt, boil soaked basmati rice until exactly 70% cooked (grain breaks into 3 pieces when pressed). Drain water immediately.
4. **Dum Layering:** Spread the semi-cooked rice evenly over the chicken layer in the handi. Top with remaining golden fried onions, fresh mint leaves, saffron milk, and 1 tbsp ghee.
5. **Slow Dum Cooking:** Seal handi tightly with foil or heavy lid. Place on a preheated tawa on low flame for 25-30 minutes for slow dum cooking.
6. **Rest & Fluff:** Rest for 10 minutes before opening. Gently fluff with a flat spatula from bottom to top so rice grains remain intact!
7. **Serve:** Serve hot with chilled onion raita and chicken salna! 🍛

⏱️ **Total Time:** 1.5 hours | **Difficulty:** Master Chef
💡 **Chef Tip:** Bone-in Big Curry Cut from Mathina Chicken Center is specifically butchered into generous portions that don't dry out or shred under prolonged dum heat!`,
  },

  // ── BUTTER CHICKEN (MURGH MAKHANI) ───────────────────────────
  {
    patterns: [
      'butter chicken',
      'murgh makhani',
      'makhani chicken',
      'how to cook butter chicken',
      'butter chicken recipe',
      'how to make butter chicken',
      'butter chicken gravy',
    ],
    response: `🥘 *Restaurant-Style Butter Chicken (Murgh Makhani) Recipe*

**Recommended Cut:** 🧊 **Mathina Boneless Cube Cut** (100% tender breast cubes)

**Ingredients (serves 4):**
• 500g Mathina Boneless Cube Cut Chicken
• 3 tbsp butter + 1 tbsp oil
• 4 ripe red tomatoes (pureed) & 1 medium onion (finely chopped)
• 12 whole cashews (soaked in warm water & ground to smooth paste)
• 1.5 tbsp ginger-garlic paste
• 1 tbsp Kashmiri red chilli powder (for rich color without burning heat)
• 1 tsp garam masala & 1/2 tsp turmeric
• 2 tbsp fresh dairy cream
• 1 tsp kasuri methi (dried fenugreek leaves, crushed)
• 2 tbsp yogurt + salt to taste

**Master Chef Step-by-Step Instructions:**
1. **Marinate:** Mix chicken cubes with 2 tbsp yogurt, 1 tbsp ginger-garlic paste, 1 tsp chilli powder, and salt. Marinate for 20 minutes.
2. **Sear Chicken:** Heat 1 tbsp butter in a pan. Sear chicken cubes on high heat for 6-8 minutes until lightly charred and 80% cooked. Set aside.
3. **Build the Gravy:** In the same pan, melt 2 tbsp butter. Sauté onions and remaining ginger-garlic paste until golden. Add tomato puree, Kashmiri chilli powder, turmeric, and salt. Cook until butter separates from the sides (8-10 mins).
4. **Velvety Makhani Sauce:** Stir in the smooth cashew paste and 1/2 cup water. Simmer on low heat for 5 minutes until the gravy turns silky smooth.
5. **Simmer Chicken:** Add the seared chicken cubes, garam masala, and crushed kasuri methi into the gravy. Simmer for 6-8 minutes so the chicken absorbs the rich buttery sauce.
6. **Finish with Cream:** Drizzle 2 tbsp fresh cream and top with a small cube of butter. Serve steaming hot with garlic butter naan or jeera rice! 🥘

⏱️ **Cook Time:** 25 mins | **Difficulty:** Medium
💡 **Chef Tip:** Mathina Boneless Cube Cut is pre-trimmed of fat and sinew, soaking up the makhani sauce like a sponge!`,
  },

  // ── CHETTINAD PEPPER CHICKEN / PEPPER FRY ─────────────────────
  {
    patterns: [
      'pepper chicken',
      'chicken pepper fry',
      'chettinad chicken',
      'how to cook pepper chicken',
      'pepper chicken recipe',
      'milagu chicken',
      'chettinad pepper chicken',
      'pepper fry recipe',
    ],
    response: `🌶️ *Authentic Chettinad Pepper Chicken Fry (Milagu Kozhi Varuval)*

**Recommended Cut:** 🍲 **Mathina Small Curry Cut (Bone-in)** (Traditional bone-in chunks release rich gelatin & marrow)

**Ingredients (serves 4):**
• 500g Mathina Small Curry Cut Chicken
• 2 tbsp whole black peppercorns (freshly roasted & coarsely pounded)
• 1 tbsp fennel seeds (saunf) + 1 tsp cumin seeds
• 12 shallots (small onions / chinna vengayam, sliced)
• 2 sprigs fresh curry leaves
• 1.5 tbsp ginger-garlic paste
• 1/2 tsp turmeric powder & 1 tsp coriander powder
• 3 tbsp gingelly (sesame) oil
• Salt to taste

**Master Chef Step-by-Step Instructions:**
1. **Fresh Pepper Roast:** Dry roast black peppercorns, fennel seeds, and cumin seeds in a pan for 2 mins until fragrant. Coarsely crush in a mortar or spice grinder (key for authentic peppery punch!).
2. **Sauté Aromatics:** Heat gingelly oil in a heavy iron kadai. Add fresh curry leaves and sliced shallots. Sauté until translucent and golden.
3. **Sear the Meat:** Add ginger-garlic paste and sauté for 1 minute. Add Mathina Small Curry Cut chicken, turmeric powder, and salt. Sauté on high flame for 5 minutes to sear in the juices.
4. **Simmer:** Cover with a lid and cook on medium-low flame for 12-15 minutes. The chicken will release its natural flavorful broth.
5. **Pepper Masala Roast:** Uncover the pan. Add the freshly ground pepper spice mix and coriander powder.
6. **Dark Dry Roast:** Toss continuously on medium-high flame for 5-7 minutes until the gravy completely clings to the chicken pieces and turns dark, aromatic, and glossy.
7. **Serve:** Garnish with crispy fried curry leaves. Serve piping hot with steamed white rice, rasam, or parotta! 🍗

⏱️ **Cook Time:** 25 mins | **Spice Level:** Bold & Peppery 🔥
💡 **Chef Tip:** Bone-in Small Curry Cut from Mathina Chicken Center infuses the marrow juices straight into the dry pepper roast!`,
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
💡 Tip: Mathina Chicken Center's Chicken 65 Pieces are pre-cut to the perfect bite size!`,
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
💡 Butterfly Cut from Mathina Chicken Center is perfect for grilling — cooks evenly!`,
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

  // ── NATTU KOZHI SOUP (COUNTRY CHICKEN SOUP) ───────────────────
  {
    patterns: [
      'nattu kozhi soup',
      'country chicken soup',
      'chicken soup',
      'how to cook chicken soup',
      'soup recipe',
      'nattu kozhi rasam',
      'village soup',
      'cold fever soup',
      'healthy soup',
      'bone broth',
    ],
    response: `🥣 **Authentic Nattu Kozhi Chicken Soup Recipe (Immunity Booster)**

**Recommended Cut:** 🐓 **Mathina Country Chicken (Nattu Kozhi) or Soup Bones**

**Ingredients (serves 4):**
• 400g Mathina Country Chicken (bone-in pieces with joints)
• 1 large onion or 10 shallots (chinna vengayam), crushed
• 1 ripe tomato, chopped
• 1.5 tbsp freshly crushed black pepper & cumin seeds
• 1 tbsp ginger-garlic paste
• 1/2 tsp turmeric powder & fresh curry leaves
• 1 tbsp sesame oil (nallennai)
• 4 cups water & salt to taste
• Fresh coriander leaves for garnish

**Master Chef Step-by-Step Instructions:**
1. **Temper Aromatics:** Heat 1 tbsp sesame oil in a pressure cooker. Add crushed shallots, ginger-garlic paste, and curry leaves. Sauté for 1 minute until fragrant.
2. **Add Spices & Tomato:** Add chopped tomato, turmeric powder, and half of the crushed black pepper-cumin powder. Sauté until tomato softens.
3. **Sear the Meat:** Add Mathina Country Chicken pieces and sear on high heat for 2 minutes to seal in flavor.
4. **Pressure Cook:** Pour in 4 cups of water and salt. Cover and pressure cook on medium flame for **5–6 whistles** (country chicken has firmer meat and needs extra time to extract deep bone marrow nutrients).
5. **Simmer & Pepper Finish:** Allow steam to release naturally. Open, stir in the remaining crushed black pepper for that fiery throat-soothing punch, and simmer for 2 minutes.
6. **Serve:** Garnish with fresh coriander leaves. Drink hot as a healing broth for cold, cough, and body aches! 🥣

⏱️ **Cook Time:** 25 mins | 💡 **Chef Tip:** Never discard the bone marrow; it provides pure natural collagen and immune-strengthening minerals!`,
  },

  // ── GYM DIET / HIGH-PROTEIN GRILLED CHICKEN BREAST ───────────
  {
    patterns: [
      'gym chicken',
      'diet chicken',
      'fitness chicken',
      'high protein recipe',
      'grilled chicken breast',
      'how to cook chicken breast',
      'healthy chicken recipe',
      'chicken for weight loss',
      'chicken for muscle building',
      'protein diet',
      'lemon herb chicken',
      'gym',
      'fitness',
      'workout',
      'bodybuilding',
      'high protein',
      'lean protein',
      'macros',
    ],
    response: `💪 **Master Chef High-Protein Grilled Chicken Breast (Gym & Fitness Meal Prep)**

**Recommended Cut:** 🦋 **Mathina Butterfly Cut or Boneless Breast** (Lean, zero-fat prime protein!)

**Nutritional Macros (approx. per 200g serving):**
• 🏋️ **Protein:** ~46g – 50g
• 🥑 **Fat:** < 3.5g
• ⚡ **Carbs:** 0g | **Calories:** ~220 kcal

**Ingredients (serves 1–2):**
• 250g Mathina Butterfly Cut Boneless Breast
• 1 tbsp olive oil or light spray
• 1 tbsp fresh lemon juice
• 1 tsp garlic paste or garlic powder
• 1 tsp mixed herbs (oregano, thyme, rosemary)
• 1/2 tsp crushed black pepper & pinch of pink salt
• 1/2 tsp smoked paprika (optional, for golden color)

**Master Chef Step-by-Step Instructions:**
1. **Marinate (15 mins):** Rub chicken breast with olive oil, lemon juice, garlic, mixed herbs, black pepper, and salt.
2. **Pan-Sear on High Heat:** Heat a cast-iron grill pan or non-stick skillet on medium-high until smoking hot.
3. **Grill Evenly:** Place the butterflied chicken flat on the pan. Sear undisturbed for **3.5 to 4 minutes** on side one until golden grill lines appear.
4. **Flip & Finish:** Flip over and cook for **3 minutes** on side two. Do NOT overcook — lean breast dries out if cooked past 74°C internal temperature!
5. **The Golden Rest (Vital):** Transfer to a cutting board and **rest for 4 minutes** before slicing. This redistributes internal juices so the chicken remains super juicy and succulent!
6. **Serve:** Slice diagonally and serve with steamed broccoli, brown rice, or a garden salad. 🥗

⏱️ **Cook Time:** 8 mins | 💡 **Chef Tip:** The Butterfly Cut ensures uniform thickness from end to end, preventing dry overcooked edges!`,
  },

  // ── CHICKEN SHAWARMA & WRAPS ──────────────────────────────────
  {
    patterns: [
      'shawarma',
      'chicken shawarma',
      'how to make shawarma',
      'shawarma recipe',
      'chicken roll',
      'chicken wrap',
      'kathi roll',
    ],
    response: `🌯 **Master Chef Chicken Shawarma & Roll Recipe**

**Recommended Cut:** 🧊 **Mathina Boneless Breast Cubes or Julienne Cut**

**Ingredients (serves 3-4):**
• 350g Mathina Boneless Chicken
• 3 tbsp thick yogurt
• 1 tbsp lemon juice
• 1 tbsp garlic paste
• 1 tsp cumin, coriander & paprika powder
• 1/2 tsp cinnamon & black pepper
• 4 pita breads or rumali rotis
• Toum (garlic sauce) or mayonnaise & pickled cucumbers / onions

**Master Chef Step-by-Step Instructions:**
1. **Middle-Eastern Marinade:** Mix chicken with yogurt, lemon juice, garlic paste, spices, and 1 tbsp olive oil. Marinate 1 hour.
2. **Pan-Roast Char:** Heat a heavy tawa on high. Cook marinated chicken for 6–7 minutes until charred and cooked through. Shred coarsely with a chef knife.
3. **Assemble Wrap:** Warm the pita or rumali roti on a hot pan. Spread a generous layer of garlic toum.
4. **Fill & Roll:** Add shredded shawarma chicken, sliced pickled cucumbers, tomatoes, and French fries (optional!). Roll tightly and toast for 1 minute on tawa.
5. **Serve:** Cut diagonally and serve with extra garlic dip! 🌯

⏱️ **Cook Time:** 15 mins | 💡 **Chef Tip:** A pinch of ground cinnamon in the marinade provides that unmistakable authentic Arabian street shawarma flavor!`,
  },

  // ── CHICKEN NOODLES (HAKKA & STREET STYLE) ───────────────────
  {
    patterns: [
      'chicken noodles',
      'chicken noodle',
      'how to cook chicken noodle',
      'how to cook chicken noodles',
      'how to make chicken noodle',
      'how to make chicken noodles',
      'chicken chowmein',
      'hakka noodles',
      'chicken noodle recipe',
      'chicken noodles recipe',
      'noodles recipe',
      'how to cook noodles',
      'how to make noodles',
      'street style noodles',
      'noodles chicken',
      'noodle chicken',
    ],
    response: `🍜 **Master Chef Chicken Noodles Recipe (Hakka & Street Style)**

**Recommended Cut:** 🥢 **Mathina Julienne Cut** (Ultra-thin uniform breast strips that flash-cook in 3 minutes!)

**Ingredients (serves 3-4):**
• 250g Mathina Julienne Cut Chicken (thin tender strips)
• 200g Hakka noodles or egg noodles (boiled al dente)
• 1 cup shredded vegetables (cabbage, carrots, capsicum)
• 2 tbsp finely chopped garlic & spring onions
• 1.5 tbsp dark soy sauce
• 1 tbsp green chilli sauce or red chilli paste
• 1 tsp vinegar
• 1 tsp freshly crushed black pepper
• 1 tsp cornflour (for velvety chicken)
• 2 tbsp sesame oil or vegetable oil
• Salt to taste

**Master Chef Step-by-Step Instructions:**
1. **Prep the Noodles:** Boil noodles in salted water until 80% done (firm to bite). Drain immediately and rinse under cold water. Toss with 1 tsp oil so strands don't stick.
2. **Velvet the Chicken:** Toss Mathina Julienne chicken strips with 1 tsp soy sauce, 1/2 tsp pepper, pinch of salt, and 1 tsp cornflour. Rest for 10 minutes.
3. **Sear the Chicken:** Heat 1 tbsp oil in a smoking-hot wok. Flash-sear chicken strips on high heat for 3-4 minutes until golden and tender. Remove and set aside.
4. **Flash Stir-Fry Veggies:** In the same hot wok, add 1 tbsp oil and sauté minced garlic for 30 seconds. Add cabbage, carrots, and capsicum; toss on maximum heat for 2 minutes (keep them crunchy!).
5. **Combine & Sauce:** Add boiled noodles and cooked chicken julienne into the wok.
6. **The Flavor Drizzle:** Pour soy sauce, chilli sauce, vinegar, crushed black pepper, and salt around the edges of the hot wok.
7. **The Wok Hei Toss:** Toss and stir-fry vigorously on high heat for 2 minutes until every noodle strand is glossy, smoky, and infused with sauce!
8. **Garnish & Serve:** Sprinkle freshly chopped green spring onions and serve piping hot! 🍜

⏱️ **Cook Time:** 15 mins | **Prep Time:** 15 mins
💡 **Chef Tip:** Mathina Julienne Cut is pre-sliced by our butchers into uniform thin strips so the chicken remains super juicy and never turns chewy!`,
  },

  // ── CHICKEN FRIED RICE ───────────────────────────────────────
  {
    patterns: [
      'chicken fried rice',
      'fried rice',
      'how to cook chicken fried rice',
      'fried rice recipe',
      'chicken rice recipe',
      'how to make chicken fried rice',
    ],
    response: `🍚 **Restaurant-Style Chicken Fried Rice Recipe**

**Recommended Cut:** 🧊 **Mathina Boneless Cube Cut or Julienne Cut**

**Ingredients (serves 3-4):**
• 200g Mathina Boneless Cube Cut or Julienne Cut Chicken
• 3 cups cold cooked Basmati or Jasmine rice
• 2 eggs (whisked with pinch of salt)
• 1 cup finely diced carrots, beans, and capsicum
• 2 tbsp minced garlic & chopped spring onions
• 1.5 tbsp soy sauce & 1 tsp crushed black pepper
• 2 tbsp oil & salt to taste

**Master Chef Step-by-Step Instructions:**
1. **Scramble Eggs:** Heat 1 tbsp oil in a hot wok. Lightly scramble eggs for 1 minute; remove and set aside.
2. **Sear Chicken:** Add 1 tbsp oil, stir-fry chicken cubes for 3-4 minutes until tender and cooked through; set aside.
3. **Sauté Veggies:** In the same smoking-hot wok, sauté minced garlic and diced veggies on high flame for 2 minutes (keep crisp).
4. **Toss Rice & Chicken:** Add cold cooked rice, cooked chicken, and scrambled eggs into the wok.
5. **Season:** Drizzle soy sauce, crushed black pepper, and salt. Toss vigorously on maximum heat for 2-3 minutes so grains separate and absorb smoky wok aroma.
6. **Serve:** Garnish with green spring onions and serve hot with chilli chicken! 🍚

⏱️ **Cook Time:** 15 mins | **Tip:** Use refrigerated leftover rice for the best non-sticky grains!`,
  },

  // ── JULIENNE CUT ────────────────────────────────────────────
  {
    patterns: ['julienne cut', 'julienne chicken', 'thin chicken strips', 'how to cook julienne'],
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
    response: `💰 *Today's Chicken Prices at Mathina Chicken Center*

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
    response: `### 🏢 Corporate Profile: Mathina Chicken Center

| Attribute | Specification |
| :--- | :--- |
| **Lead Partner** | Shajan A.J. |
| **Operations** | Cuddalore OT, Tamil Nadu - 607003 |
| **Direct Voice** | +91 77080 32726 |
| **Enterprise Support** | mathinachickencenter@gmail.com |
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

  // ── PERSONAL ASSISTANT: PORTION & GUEST MEAT CALCULATOR ─────────
  {
    patterns: [
      'how much chicken for',
      'how many kg for',
      'how much to order for',
      'portion size',
      'serving size',
      'how much chicken do i need',
      'chicken for 2 people',
      'chicken for 4 people',
      'chicken for 5 people',
      'chicken for 6 people',
      'chicken for 10 people',
      'chicken for guests',
      'how much biryani cut for 1kg rice',
      'rice to chicken ratio',
      'how much chicken for party',
      'portion calculator',
    ],
    response: `⚖️ **Personal Assistant: Chicken Portion & Weight Calculator**

As your personal culinary assistant, here is our precise butcher & chef formula for planning your order:

### 1. General Rule of Thumb per Person:
| Dish Type | Meat Cut | Recommended Weight / Person |
| :--- | :--- | :--- |
| **Biryani (Dum / Handi)** | Big Curry / Biryani Cut | **250g – 300g** (Bone-in) |
| **Curry / Gravy / Salna** | Small / Classic Curry Cut | **200g – 250g** (Bone-in) |
| **Boneless Stir-Fry / Tikka** | Boneless Breast Cubes | **150g – 180g** (Boneless) |
| **Starters (65 / Lollipops)** | 65 Cut / Lollipops | **3–4 pieces** per guest |

---

### 2. Fast Party & Family Quick Calculations:
• 👨‍👩‍👧 **For 2 People (Lunch/Dinner):**
  - Curry/Gravy: **500g** Curry Cut
  - Boneless / Stir-fry: **350g** Cubes or Julienne Cut
• 👨‍👩‍👧‍👦 **For 4–5 People (Family Feast):**
  - Biryani: **1 kg – 1.25 kg** Biryani Cut
  - Curry: **1 kg** Curry Cut
• 👥 **For 6–8 People (Small Gathering):**
  - Order **1.5 kg – 2 kg** Big Curry Cut
• 🥳 **For 10–12 Guests (Party / Event):**
  - Order **2.5 kg – 3 kg** Biryani Cut + **1 kg** Chicken 65 / Lollipops for appetizers!

---

### 3. Golden Dum Biryani Rice-to-Meat Ratio:
• **The 1:1.25 Golden Ratio:** For **1 kg basmati or seeraga samba rice**, use **1.25 kg Mathina Biryani Cut chicken**.
• This ensures every single serving gets generous, tender, juicy meat portions without running out!

👉 Ready to order? Head to our **[Products Page](/products)** to select your exact weight! 📦`,
  },

  // ── PERSONAL ASSISTANT: RUBBERY / DRY CHICKEN TROUBLESHOOTING ───
  {
    patterns: [
      'rubbery chicken',
      'dry chicken',
      'hard chicken',
      'chewy chicken',
      'why is chicken hard',
      'how to make chicken soft',
      'tender chicken',
      'soft chicken',
      'chicken not soft',
      'chicken too dry',
      'why is my chicken rubbery',
      'chicken tough',
      'rubbery',
      'tough',
      'chewy',
      'chicken rubbery',
      'chicken dry',
      'chicken hard',
      'hard meat',
      'make chicken soft',
      'tenderize',
      'stringy chicken',
      'why is my cooked chicken rubbery',
    ],
    response: `🩺 **Personal Kitchen Doctor: Why Is My Chicken Rubbery & How to Fix It!**

Don't worry — this is the most common kitchen problem, and as your personal chef, I'll explain exactly what happened and how to guarantee melt-in-your-mouth tenderness every time:

### 1. The 4 Big Reasons Chicken Turns Rubbery or Tough:
1. 🔥 **Overcooking Past 74°C (165°F):** Lean chicken breast dries out in seconds once moisture evaporates.
2. 🧊 **Cooking Directly from the Fridge:** Putting ice-cold raw chicken into a hot pan shocks the muscle fibers, causing them to seize and turn rubbery.
3. 🔪 **Skipping the Resting Phase:** Cutting chicken immediately after cooking lets all the internal flavorful juices spill onto the board instead of staying in the meat!
4. 🧂 **Over-Marinating in Pure Lemon Juice or Vinegar:** High-acid marinades for more than 2 hours "chemically cook" the surface, turning meat stringy and chalky.

---

### 2. Master Chef Rules for Super Soft Chicken:
• ✅ **The 20-Minute Room Temp Rule:** Take chicken out of the fridge 20 minutes before cooking so it heats evenly.
• 🥛 **Use Yogurt (Curd) for Marination:** Lactic acid in yogurt tenderizes muscle fibers gently without breaking them down.
• 🥢 **Wok-Hei Velveting for Boneless (Chinese Secret):** Toss 250g breast strips with **1 tsp cornflour + 1 tsp soy sauce + 1 egg white** for 10 mins before searing. The cornflour forms a microscopic shield that locks in 100% of moisture!
• ⏱️ **Rest for 4–5 Minutes:** Always rest cooked whole breasts or chicken cuts under loose foil before slicing.

---

### 3. Emergency Rescue: How to Save Already Overcooked Dry Chicken:
• Shred the dry chicken finely and simmer it in a rich gravy (like Butter Chicken makhani or coconut chicken salna) for 5 minutes. The shredded fibers will soak up the sauce like a sponge!`,
  },

  // ── PERSONAL ASSISTANT: CURRY TOO SALTY OR TOO SPICY RESCUE ────
  {
    patterns: [
      'too salty',
      'curry too salty',
      'fix salty',
      'food too salty',
      'too spicy',
      'curry too spicy',
      'reduce spice',
      'curry too hot',
      'less spicy',
      'how to reduce salt',
      'how to reduce spice in curry',
      'chicken curry too spicy',
      'salty',
      'salty curry',
      'fix salt',
      'curry salty',
      'how to fix salty',
      'too hot',
      'excess salt',
    ],
    response: `🚨 **Kitchen Emergency Assistant: How to Fix Too Salty or Too Spicy Curry!**

Don't throw away your curry! As your personal kitchen assistant, here are 5 tried-and-tested master chef fixes to neutralize excess salt or fiery heat in minutes:

### 1. If Your Chicken Curry is TOO SALTY:
• 🥔 **The Raw Potato Hack (Best):** Peel and cut 1 large raw potato into thick halves. Drop into the simmering curry for **10–12 minutes**. Potatoes act like a natural salt magnet, absorbing excess sodium! Remove potato before serving.
• 🥛 **Dairy / Cream Buffer:** Add 2–3 tbsp of fresh cream, thick curd (whisked), or unsalted butter. The dairy fats coat the tongue and cut sodium perception.
• 🥥 **Coconut Milk (South Indian Style):** Stir in 1/2 cup of fresh thick coconut milk. It mellows salt and enhances traditional Chettinad flavor.
• 🍞 **Dough Balls (Atta Hack):** Roll 2 small balls of kneaded chapati dough and drop into simmering curry for 5 mins. Discard before serving.

---

### 2. If Your Chicken Curry is TOO SPICY (Fiery Heat):
• 🍯 **Sweet Balance:** Add 1 tsp of honey, jaggery, or brown sugar. Sweetness counteracts capsaicin (chilli heat).
• 🍋 **Acid Balance:** Squeeze 1 tbsp of fresh lemon juice or add 1 pureed ripe tomato. Acid neutralizes fiery pepper.
• 🥜 **Nut Paste:** Whisk in 2 tbsp of cashew or almond paste for a royal, velvety, mild gravy.
• 🍚 **Serve with Cooling Sides:** Pair with chilled cucumber onion raita and hot ghee rice!`,
  },

  // ── PERSONAL ASSISTANT: FOOD SAFETY, STORAGE & DEFROST PROTOCOL ─
  {
    patterns: [
      'how to store chicken',
      'how long in fridge',
      'can i refreeze',
      'thaw chicken',
      'defrost chicken',
      'frozen chicken',
      'how to keep fresh',
      'shelf life',
      'raw chicken storage',
      'store chicken in freezer',
      'chicken food safety',
    ],
    response: `🛡️ **Personal Assistant: Chicken Storage, Thawing & Food Safety Protocol**

Keeping poultry hygienic and bacteria-free is vital for your family's health:

### 1. Refrigerator & Freezer Shelf Life:
| Storage Method | Ideal Temperature | Safe Duration |
| :--- | :--- | :--- |
| **Fresh Chilled Compartment** | 0°C to 4°C | **1 – 2 Days** (Best cooked fresh!) |
| **Deep Freezer** | -18°C or below | **Up to 3 Months** (Airtight pack) |
| **Marinated Chicken** | 0°C to 4°C | **24 – 36 Hours** in fridge |

---

### 2. The 3 Safe Ways to Defrost / Thaw Chicken:
1. ❄️ **The Refrigerator Method (Safest & Best):** Transfer chicken from freezer to the lowest fridge shelf 12 hours before cooking. Keeps meat at a safe temperature while thawing uniformly.
2. 💧 **The Cold Water Submersion (Quick — 30 mins):** Seal chicken in a leakproof ziplock bag and submerge in a bowl of cold tap water. Change the water every 20 minutes until thawed. Cook immediately.
3. ⚡ **Microwave Defrost (Emergency Only):** Use defrost setting at 30% power. Cook immediately after thawing as parts may begin warming.

> ⚠️ **FOOD SAFETY WARNING:** NEVER thaw chicken on the kitchen counter at room temperature or in hot water! Bacteria multiply exponentially in the 4°C – 60°C "Danger Zone".

---

### 3. Can I Refreeze Thawed Raw Chicken?
• ❌ **Never refreeze thawed raw chicken.** Refreezing breaks down cellular walls, ruining texture, and increases bacterial contamination risks.
• ✅ **Exception:** If you cook the thawed chicken into a curry or dish, the **cooked dish can safely be frozen** for up to 2 months!`,
  },

  // ── PERSONAL ASSISTANT: COOKING INGREDIENT SUBSTITUTES ───────────
  {
    patterns: [
      'substitute for curd',
      'substitute for yogurt',
      'no curd',
      'no yogurt',
      'substitute for cornflour',
      'no cornflour',
      'substitute for egg',
      'no egg in chicken 65',
      'chicken without egg',
      'ingredient substitute',
      'replacement for',
      'substitute for buttermilk',
      'substitute',
      'substitution',
      'buttermilk substitute',
      'replacement',
      'alternative',
      'substitutes',
    ],
    response: `🔄 **Personal Kitchen Assistant: Ingredient Substitutes & Smart Swaps**

Missing an ingredient in your pantry? Here are chef-approved 1:1 direct substitutes for chicken recipes:

### 1. Substitute for Curd / Yogurt in Chicken Marinade:
• 🥛 **Buttermilk (Chaach):** Use equal quantity for tenderizing.
• 🍋 **Lemon Juice + 2 tbsp Oil:** 1.5 tbsp lemon juice provides the acid needed to break down fibers.
• 🥥 **Coconut Milk / Coconut Cream:** Excellent dairy-free tenderizer for South Indian curries.
• 🍈 **Raw Papaya Paste:** 1 tsp per 500g chicken — the most potent natural enzyme tenderizer (papain).

---

### 2. Substitute for Cornflour (for Crispy Chicken 65 / Noodles):
• 🌾 **Rice Flour (Arisi Maavu):** 1:1 replacement. Gives an even crispier, crunchier bite for Chicken 65!
• 🥔 **Potato Starch / Arrowroot Powder:** 1:1 replacement for silky sauces and Chinese velveting.
• 🌾 **Maida (All-Purpose Flour):** Works for frying batter, though slightly heavier than cornflour.

---

### 3. Substitute for Egg in Chicken 65 & Starters:
• 💧 **Cornflour + Rice Flour Slurry:** Mix with thick curd and 1 tsp oil. It binds spices to the meat with zero egg required!`,
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
    response: `👋 *Welcome to Mathina Chicken Center!*
I'm your AI Executive Chef. How can I help you in the kitchen today? 👨‍🍳

I can help you with:
• 🍳 **Recipes** — Dragon Chicken, Biryani, Shawarma, Tikka & more
• 💰 **Prices** — Today's kg rates for all cuts
• 📞 **Contact** — Call or WhatsApp for orders
• 📧 **Support** — Reach us at mathinachickencenter@gmail.com
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
• How to order or track orders 📦
• 11+ Cuts guide & recipe advice 🍳
• Daily prices & live shop updates 💰
• Delivery status & payment options 🚚

📞 To order by phone: +91 77080 32726
📱 WhatsApp: +91 80566 94908`,
  },

  // ── HOW TO ORDER ON THE PLATFORM ──────────────────────────────
  {
    patterns: [
      'how to order',
      'hoe to order',
      'how do i order',
      'how to buy',
      'order chicken',
      'place an order',
      'ordering process',
      'how to use website',
      'steps to order',
      'buy chicken online',
      'how to checkout',
      'how to purchase',
      'how to order online',
      'order online',
      'buy chicken',
    ],
    response: `📦 **How to Order on Mathina Chicken Center (Step-by-Step Guide)**

Ordering fresh, 100% Halal-certified chicken online is quick and effortless:

1. **Browse Cuts & Categories:**
   • Visit our **[Products Page](/products)** or tap **Quick Help & Order** at the bottom-right.
   • Choose from 11+ chef-crafted cuts (Curry Cut, Biryani Cut, Boneless Breast/Cubes, Dragon Cut, Lollipop, Chicken 65, etc.) or Live Chicken.

2. **Select Weight & Quantity:**
   • Choose your desired pack size: **250g, 500g, or 1kg** (or custom kg).
   • Transparent per-kg pricing is updated live daily.

3. **Choose Checkout Method:**
   • ⚡ **Buy Now:** Instant 1-click express checkout for single items.
   • 🛒 **Add to Cart:** Add multiple cuts, eggs, or marinades and checkout together.

4. **Review Cart & Apply Discount:**
   • Open **[Cart](/cart)** to review your items.
   • Apply coupon code \`MATHINA2024\` for 15% off Biryani & Big Curry Cut!
   • Enter your delivery address and mobile number.

5. **Select Payment:**
   • 📲 **Smart UPI Instant Pay:** Scan our Indian Bank QR code (\`CF05100492@indianbk\`) using Google Pay, PhonePe, Paytm, or BHIM.
   • 💵 **Cash on Delivery (COD):** Pay cash at your doorstep upon delivery with zero extra fees.

6. **Order Placed & Live Tracking:**
   • You receive an instant Order Confirmation with live tracking from fresh butchery to delivery on **[My Orders](/orders)**!

⚡ **Prefer Ordering via WhatsApp or Phone?**
• Tap the **Quick Help & Order** button on the bottom-right corner:
  - Choose **Quick Order** to generate a pre-formatted WhatsApp order in 10 seconds.
  - Choose **Call Directly** to order with store owner Shajan at **+91 77080 32726**!`,
  },

  // ── PRODUCTS AVAILABLE FOR SALE (COMPLETE CATALOGUE) ─────────────
  {
    patterns: [
      'product for sale',
      'products for sale',
      'what are those product for sale',
      'what are the products for sale',
      'what products are for sale',
      'what products do you sell',
      'what do you sell',
      'what products',
      'products list',
      'list of products',
      'items for sale',
      'what is available',
      'available products',
      'available items',
      'what can i buy',
      'all products',
      'store products',
      'chicken products',
      'shop items',
      'products available',
      'menu',
      'price list products',
    ],
    response: `🍗 **Mathina Chicken Center — Products Available for Sale**

We take pride in offering 100% farm-fresh, Halal-certified poultry products with daily counter pricing:

1. **🔪 11+ Chef-Crafted Fresh Chicken Cuts:**
   • **Classic Curry Cut (Bone-in):** Medium chunks with bone marrow richness for gravies & salna.
   • **Small Curry Cut:** Bite-sized bone-in pieces for quick-cooking curries & pepper fry.
   • **Big Curry Cut / Biryani Cut:** Large bone-in cuts that lock in juicy flavor for Dum Biryani.
   • **Boneless Cube Cut:** Clean 1-inch boneless breast cubes for Butter Chicken & Tikka.
   • **Dragon Cut:** Pre-marinated long tender strips for crispy Indo-Chinese Dragon Chicken.
   • **Butterfly Cut:** Symmetrical boneless breast fillets for grills, pan-searing & schnitzel.
   • **Chicken 65 Pieces:** Specifically proportioned to absorb hot red marinades for deep frying.
   • **Chicken Lollipop:** Frenched wing drumettes with meat wrapped to the crown.
   • **Finger Cut:** Crispy slender tenders for homemade chicken fingers & snacks.
   • **Julienne Cut:** Ultra-thin uniform strips that cook in 3 mins for Hakka noodles & stir-fries.
   • **Chicken Wings & Drumsticks:** Juicy bone-in wings and plump drumsticks for BBQ & tandoor.
   • **Boneless Breast & Thighs:** Lean, tender protein cuts for fitness meal prep.
   • **Whole Fresh Chicken:** Cleaned and gutted whole birds (1.2kg – 1.8kg).

2. **🐓 Live Counter Chicken:**
   • Selected healthy live birds weighed and counter-dressed to your exact cutting preference.

3. **🥚 Farm Fresh Eggs:**
   • **Classic White Farm Eggs:** High protein, daily morning harvest.
   • **Country Eggs (Nattu Kozhi Muttai):** Organic, nutrient-dense free-range eggs.

4. **🌶️ Ready-to-Cook & House Marinades:**
   • Tandoori Marinade, Peri Peri Glaze, and Classic Chicken 65 Masala mix.

5. **📦 Fresh Organ Cuts & Specialty:**
   • Fresh Chicken Liver (Eral) & Gizzard (Mani) — fresh, cleaned, and hygienic.

🛒 **Shop Online Now:**
• Browse all cuts with live prices on our **[Products Page](/products)**!
• Use coupon code \`MATHINA2024\` for 15% off Biryani & Big Curry Cut.
• Instant 1-click Express Buy Now with Indian Bank UPI or Cash on Delivery!`,
  },

  // ── ORDER TRACKING & LIVE UPDATES ─────────────────────────────
  {
    patterns: [
      'track order',
      'track my order',
      'where is my order',
      'check update',
      'order status',
      'order updates',
      'how to track',
      'cancel order',
      'how to cancel',
      'reorder',
    ],
    response: `🚚 **How to Track Your Order & Live Status Updates**

Stay updated every step of the way from butchery block to your kitchen:

📍 **Where to Track:**
• Navigate to **[My Orders](/orders)** from the top menu or profile.
• Click on any active order to see its live visual progress tracker.

🔄 **Order Status Pipeline:**
1. 🟡 **Pending:** Order received and logged at Mathina Chicken Center counter.
2. 🔵 **Confirmed:** Butchery manager verified stock and accepted your order.
3. 🟣 **Processing:** Your bird is being freshly slaughtered, custom-cut to precision, hygienically washed, and vacuum-sealed.
4. 🟠 **Out for Delivery:** Dispatched in a temperature-controlled insulated cold box with our delivery partner.
5. 🟢 **Delivered:** Handed over safely at your doorstep!

🔔 **Live Notifications:**
• The **Notification Bell** on the top navigation bar rings with real-time updates as your order progresses.

❌ **Cancellation & Changes:**
• You can cancel an order directly from the order page while the status is **Pending** or **Confirmed** (before butchery cutting starts).
• For immediate modifications, call our counter directly: **+91 77080 32726**.`,
  },

  // ── FARM-TO-TABLE QR TRACEABILITY ─────────────────────────────
  {
    patterns: [
      'qr scan',
      'qr code',
      'traceability',
      'farm to table',
      'scan qr',
      'trace my chicken',
      'where is chicken from',
      'batch code',
      'slaughter date',
      'halal verification',
    ],
    response: `🔍 **Farm-to-Table QR Traceability System**

At Mathina Chicken Center, we believe in 100% radical transparency for the food you and your family eat:

📲 **How to Scan:**
1. Head to our **[QR Scanner Page](/qr-scan)**.
2. Allow camera access, or upload a photo of the QR code printed on your meat packet.
3. You can also scan the QR standee at our shop counter!

📋 **What Information Does It Reveal?**
• 🌾 **Farm of Origin:** Certified biosafety poultry farm in Tamil Nadu where the bird was raised.
• 🩺 **Veterinary Clearance:** Zero antibiotics, zero growth hormones, 100% natural grain feed.
• 🔪 **Slaughter Timestamp:** Exact date and time the chicken was processed today.
• 🕌 **Halal Certification:** Verified hand-slaughtered Halal compliance record.
• ❄️ **Cold-Chain Log:** Verification that your chicken was kept at 0°C–4°C uninterrupted.

🛡️ *Mathina Guarantee:* Freshness isn't just a claim — it is verifiable proof with every bite!`,
  },

  // ── PAYMENTS & SMART UPI ──────────────────────────────────────
  {
    patterns: [
      'payment',
      'how to pay',
      'upi',
      'google pay',
      'phonepe',
      'paytm',
      'cash on delivery',
      'cod',
      'qr pay',
      'bank details',
      'payment methods',
    ],
    response: `💳 **Payment Methods at Mathina Chicken Center**

We offer fast, zero-fee, secure payment options for all customers:

1. **Smart UPI QR Code (Recommended):**
   • **Bank:** Indian Bank
   • **Official VPA:** \`CF05100492@indianbk\`
   • **Beneficiary Name:** Mathina Chicken Center
   • Scan our dynamic counter standee or in-app modal using:
     - Google Pay (GPay)
     - PhonePe
     - Paytm
     - BHIM UPI / CRED / Amazon Pay
   • Features 1-click amount presets (₹150, ₹250, ₹500, ₹1000) and instant UPI ID copy!

2. **Mobile Direct UPI Deep-Link:**
   • On mobile devices, simply tap **"Pay via UPI App"** in the payment modal to open your favorite UPI app directly with amount prefilled.

3. **Cash on Delivery (COD):**
   • Prefer to pay at your doorstep? Choose Cash on Delivery at checkout with zero extra fees!`,
  },

  // ── SUBSCRIPTIONS & WEEKLY PLANS ──────────────────────────────
  {
    patterns: [
      'subscription',
      'subscriptions',
      'weekly plan',
      'monthly plan',
      'recurring order',
      'subscribe',
      'meal plan',
      'protein plan',
    ],
    response: `📅 **Mathina Chicken Center Subscription Plans**

Never worry about running out of fresh chicken again! Automate your weekly protein delivery:

✨ **Available Plans on [Subscriptions](/subscriptions):**
• 🍗 **Weekly Essentials Plan:** 1kg or 2kg fresh Curry Cut delivered every Sunday morning before 8 AM.
• 💪 **High-Protein Fitness Plan:** Boneless Breast or Butterfly Cut delivered 3x weekly (Mon / Wed / Fri) for gym enthusiasts and athletes.
• 👑 **Family Feast Plan:** Custom mix of Biryani Cut, Chicken Lollipop, and Soup Bones delivered on your preferred days.

🎁 **Subscriber Benefits:**
• **10% - 15% Flat Discount** locked in against spot market price spikes.
• **Free Priority Morning Delivery** on every scheduled drop.
• **Total Flexibility:** Pause, skip a week, change cuts, or cancel anytime from your profile with zero cancellation fees!`,
  },

  // ── FESTIVAL OFFERS & COUPONS ─────────────────────────────────
  {
    patterns: [
      'coupon',
      'coupons',
      'offer',
      'offers',
      'discount',
      'promo code',
      'voucher',
      'mathina2024',
      'festival offer',
      'deal',
    ],
    response: `🎉 **Current Offers & Festival Coupon Codes**

Save extra on your fresh poultry orders today:

🏷️ **Promo Code:** \`MATHINA2024\`
• **Benefit:** 15% Instant Discount on Biryani Cut & Big Curry Cut.
• **How to Use:** Enter code \`MATHINA2024\` on the [Cart](/cart) or [Checkout](/checkout) page and click Apply!

🚚 **Free Shipping Offer:**
• Enjoy **Free Delivery** on all orders above ₹500 across Cuddalore!

🍗 **Bulk / Event Orders:**
• Catering for weddings, functions, or biryani feasts? Contact us at **+91 77080 32726** for special wholesale counter rates.`,
  },

  // ── 11+ CHICKEN CUTS GUIDE ────────────────────────────────────
  {
    patterns: [
      'chicken cuts',
      'cuts guide',
      'all cuts',
      'which cut',
      'cuts available',
      'butterfly cut',
      'cube cut',
      'dragon cut',
      'julienne cut',
      'types of cuts',
      'cuts info',
    ],
    response: `🔪 **Complete Guide to Mathina's 11+ Chef-Crafted Cuts**

Every chicken dish demands a specific butcher cut for optimal tenderness and flavor absorption:

1. 🍲 **Curry Cut (Bone-in):** Classic medium chunks with marrow bones. Perfect for traditional South Indian gravies, Chettinad chicken, and salna.
2. 🧊 **Cube Cut (Boneless):** Neatly diced 1-inch boneless breast cubes. Ideal for Butter Chicken, Tikka Masala, and quick stir-fry.
3. 🐉 **Dragon Cut:** Long drumstick-style marinated strips. Best for Indo-Chinese crispy Dragon Chicken, chilli chicken, and starters.
4. 🦋 **Butterfly Cut:** Boneless breast split evenly like wings. Best for pan-searing, grilling, schnitzel, and tawa roast.
5. 🥢 **Julienne Cut:** Ultra-thin uniform strips. Cooks in just 3–4 minutes! Best for Hakka noodles, fried rice, wraps, and Asian stir-fries.
6. 🍭 **Chicken Lollipop:** Frenched wing drumettes with meat pushed to the top and bone wrapped. The ultimate party appetizer!
7. 🌶️ **Chicken 65 Pieces:** Bite-sized tender pieces pre-cut to absorb spicy marinades. Crunchiest deep fry results.
8. 🍟 **Finger Cut:** Slender tender strips for homemade chicken nuggets, crispy tenders, and kids' snacks.
9. 🍗 **Wings & Drumsticks:** Juicy, succulent bone-in portions for BBQ grills, tandoor, and spicy hot wings.
10. 🐔 **Whole Fresh Chicken:** Cleaned, gutted, and dressed whole bird (1.2kg – 1.8kg). Ideal for rotisserie oven roast or special Sunday family meals.
11. 🐓 **Live Chicken & Custom Cuts:** Selected live birds weighed and butchered fresh to order right at our shop counter!

👉 Browse and order any cut now on our **[Products Page](/products)**!`,
  },

  // ── SHOP OWNER & ADMIN PORTAL ─────────────────────────────────
  {
    patterns: [
      'shop owner',
      'admin',
      'admin portal',
      'how to add product',
      'update product',
      'china chicken',
      'live chicken',
      'price manager',
      'price scheduler',
      'store management',
    ],
    response: `⚙️ **Shop Owner & Admin Management Portal**

Mathina Chicken Center includes a full enterprise management dashboard for store owners and butcher staff:

🔐 **Staff & Admin Access:**
• Sign in via **[Admin Login](/login)** or register butchery managers at **[Admin Registration](/admin/register)**.

📦 **Dynamic Product Management ([/admin/products](/admin/products)):**
• **Add New Product:** Create items with custom cut names, descriptions (e.g. "china chicken", special counter cuts), categories (\`chicken-cuts\`, \`live-chicken\`, \`eggs\`, \`marinades\`), prices, and stock.
• **Instant Live Sync:** The moment a shop owner adds or updates a product, it **instantly reflects on the customer Home page and Products page** in real-time without requiring a page reload!

💰 **Live Price Manager & Price Scheduler:**
• Adjust daily market price per kg across cuts at **[/admin/prices](/admin/prices)**.
• Schedule automatic morning price updates at **[/admin/price-scheduler](/admin/price-scheduler)**.

📋 **Order Fulfillment & Customer Feedback:**
• Track active orders and dispatch riders in **[/admin/orders](/admin/orders)**.
• Read real customer ratings and reviews in **[/admin/feedback](/admin/feedback)**.`,
  },

  // ── CUSTOMER REVIEWS & FEEDBACK ───────────────────────────────
  {
    patterns: [
      'feedback',
      'reviews',
      'ratings',
      'review order',
      'customer rating',
    ],
    response: `⭐ **Customer Reviews & Feedback System**

We take immense pride in delivering top-quality poultry to your kitchen:

• **Rate Your Order:** After your delivery arrives, head to **[My Orders](/orders)** and tap **"Leave Feedback"**.
• **Rating Scale:** Rate from 1 to 5 stars on Meat Freshness, Cleanliness of Cut, and Delivery Speed.
• **Management Review:** Our shop owner reads every review directly in the Admin portal to ensure our butchery standards never drop!`,
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

  // If user is asking an informational question, DO NOT hijack with auto-navigation
  const questionWords = ['how', 'what', 'why', 'where', 'when', 'who', 'tell', 'explain', 'guide', 'steps', 'help', 'can you', 'does', 'is', 'info', 'check'];
  const isQuestion = questionWords.some(w => msg.startsWith(w) || msg.includes(' ' + w + ' '));
  if (isQuestion) return null;

  for (const [key, route] of Object.entries(NAVIGATION_ROUTES)) {
    // Only match explicit navigation requests like "open cart", "go to cart", or exact route names
    const isExplicitNav = route.patterns.some(pattern => 
      msg === pattern || 
      msg === `open ${pattern}` || 
      msg === `go to ${pattern}` || 
      msg === `show ${pattern}` ||
      msg.startsWith(`open ${pattern}`) ||
      msg.startsWith(`navigate to ${pattern}`)
    );

    if (isExplicitNav) {
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
export const slmRespond = (userMessage, lang = 'en') => {
  if (!userMessage || !userMessage.trim()) return '';

  // 1. Clean and normalize input (fixing common typos like cock->cook, hoe->how, briyani->biryani, etc.)
  let msg = userMessage.toLowerCase().trim();
  msg = msg
    .replace(/\b(cock|coock|coo|cookk)\b/g, 'cook')
    .replace(/\b(hoe|howw|hw)\b/g, 'how')
    .replace(/\b(briyani|biriyani|biriyaani|biryany)\b/g, 'biryani')
    .replace(/\b(nodle|nodles|noddle|noddles|nudles|nudle)\b/g, 'noodles')
    .replace(/\b(chiken|chikcen|chikken|chikin|chickn)\b/g, 'chicken')
    .replace(/\b(prodcut|prodcuts|prouct|proucts|produc|producs)\b/g, 'product')
    .replace(/\b(ordr|oder|odering|ordring)\b/g, 'order')
    .replace(/\b(recpie|recepie|recepe|recipy)\b/g, 'recipe')
    .replace(/\b(dishs|dished)\b/g, 'dishes');

  // ── HIGH-PRIORITY PERSONAL ASSISTANT & EMERGENCY INTENTS ──────
  // Explicitly handles emergency, troubleshooting, guest portions, diet and replacements before general matching.

  // A. Kitchen Emergency (Too salty / Too spicy)
  if (
    msg.includes('too salty') ||
    msg.includes('curry salty') ||
    msg.includes('fix salty') ||
    msg.includes('too spicy') ||
    msg.includes('curry too spicy') ||
    msg.includes('reduce spice') ||
    msg.includes('curry too hot') ||
    msg.includes('less spicy') ||
    msg.includes('reduce salt') ||
    msg.includes('fix salt') ||
    ((msg.includes('salty') || msg.includes('spicy') || msg.includes('too hot')) &&
      (msg.includes('curry') || msg.includes('fix') || msg.includes('how') || msg.includes('what') || msg.includes('reduce') || msg.includes('save')))
  ) {
    const entry = KNOWLEDGE_BASE.find((e) => e.patterns.includes('too salty'));
    if (entry) return entry.response;
  }

  // B. Kitchen Doctor (Rubbery, Dry, Tough, Chewy, Hard Chicken)
  if (
    msg.includes('rubbery') ||
    msg.includes('tough') ||
    msg.includes('chewy') ||
    msg.includes('dry chicken') ||
    msg.includes('chicken dry') ||
    msg.includes('hard chicken') ||
    msg.includes('chicken hard') ||
    msg.includes('tenderize') ||
    msg.includes('stringy') ||
    msg.includes('make chicken soft') ||
    msg.includes('chicken soft') ||
    msg.includes('soft chicken') ||
    msg.includes('why is chicken') ||
    msg.includes('why is my chicken')
  ) {
    const entry = KNOWLEDGE_BASE.find((e) => e.patterns.includes('rubbery chicken'));
    if (entry) return entry.response;
  }

  // C. Portion & Guest Calculator
  if (
    msg.includes('how much chicken') ||
    msg.includes('how many kg') ||
    msg.includes('how many guests') ||
    msg.includes('portion') ||
    msg.includes('calculator') ||
    msg.includes('for guests') ||
    msg.includes('guests coming') ||
    msg.includes('dinner for') ||
    msg.includes('lunch for') ||
    ((msg.includes('guest') || msg.includes('guests') || msg.includes('people') || msg.includes('person') || msg.includes('servings') || msg.includes('serves')) &&
      (msg.includes('how much') || msg.includes('order') || msg.includes('kg') || msg.includes('need') || msg.includes('buy') || msg.includes('quantity')))
  ) {
    const entry = KNOWLEDGE_BASE.find((e) => e.patterns.includes('how much chicken do i need') || e.patterns.includes('portion calculator'));
    if (entry) return entry.response;
  }

  // D. Ingredient Substitutes & Replacements
  if (
    msg.includes('substitute') ||
    msg.includes('substitution') ||
    msg.includes('replacement') ||
    msg.includes('alternative') ||
    msg.includes('replace') ||
    msg.includes("don't have") ||
    msg.includes("dont have") ||
    msg.includes('no curd') ||
    msg.includes('no yogurt') ||
    msg.includes('no buttermilk') ||
    msg.includes('no cornflour') ||
    msg.includes('no egg')
  ) {
    const entry = KNOWLEDGE_BASE.find((e) => e.patterns.includes('ingredient substitute') || e.patterns.includes('substitute for curd'));
    if (entry) return entry.response;
  }

  // E. Gym Diet, Fitness & High Protein
  if (
    msg.includes('gym') ||
    msg.includes('fitness') ||
    msg.includes('workout') ||
    msg.includes('bodybuilding') ||
    msg.includes('high protein') ||
    msg.includes('protein diet') ||
    msg.includes('diet chicken') ||
    msg.includes('weight loss') ||
    msg.includes('macros') ||
    ((msg.includes('protein') || msg.includes('calories') || msg.includes('lean')) && (msg.includes('cut') || msg.includes('eat') || msg.includes('chicken') || msg.includes('best')))
  ) {
    const entry = KNOWLEDGE_BASE.find((e) => e.patterns.includes('gym chicken'));
    if (entry) return entry.response;
  }

  // F. Food Safety, Storage & Defrost Protocol
  if (
    msg.includes('how to store chicken') ||
    msg.includes('store chicken') ||
    msg.includes('defrost') ||
    msg.includes('thaw') ||
    msg.includes('shelf life') ||
    msg.includes('how long in fridge') ||
    msg.includes('can i refreeze') ||
    msg.includes('refreeze') ||
    msg.includes('frozen chicken') ||
    msg.includes('food safety') ||
    msg.includes('spoil') ||
    msg.includes('smell')
  ) {
    const entry = KNOWLEDGE_BASE.find((e) => e.patterns.includes('how to store chicken'));
    if (entry) return entry.response;
  }

  // 2. PRIORITY 1: Check curated KNOWLEDGE_BASE first (longest exact/substring match wins)
  let bestEntry = null;
  let longestMatchLength = 0;

  for (const entry of KNOWLEDGE_BASE) {
    for (const p of entry.patterns) {
      if (msg.includes(p) && p.length > longestMatchLength) {
        longestMatchLength = p.length;
        bestEntry = entry;
      }
    }
  }

  if (bestEntry) {
    return bestEntry.response;
  }

  // 3. PRIORITY 2: Check for "how to cook/make" patterns for ANY arbitrary food or custom dish
  const howToPatterns = [
    'how to cook',
    'how to make',
    'how to prepare',
    'recipe for',
    'how to fry',
    'how to grill',
    'how to roast',
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
        .filter((w) => w.length > 2 && !['chicken', 'the', 'some', 'dish', 'recipe'].includes(w));

      if (foodWords.length > 0) {
        const foodItem = foodWords.join(' ').split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        
        // Detect cooking method from query
        let method = 'curry';
        if (msg.includes('fry') || msg.includes('dry') || msg.includes('crispy')) method = 'fry';
        else if (msg.includes('grill') || msg.includes('roast') || msg.includes('bbq')) method = 'grill';
        else if (msg.includes('bake') || msg.includes('oven')) method = 'bake';
        else if (msg.includes('biryani') || msg.includes('pulao') || msg.includes('rice')) method = 'curry';
        else if (msg.includes('curry') || msg.includes('gravy') || msg.includes('salna')) method = 'curry';
        else if (msg.includes('stir fry') || msg.includes('noodles') || msg.includes('chow')) method = 'stirFry';
        else if (msg.includes('steam')) method = 'steam';

        return generateRecipe(foodItem, method);
      }
    }
  }

  // 4. PRIORITY 3: Fuzzy fallback — check partial word matches against curated knowledge
  const words = msg.split(' ').filter((w) => w.length > 3 && !['what', 'when', 'where', 'which', 'about', 'your', 'with', 'have', 'from'].includes(w));
  for (const word of words) {
    for (const entry of KNOWLEDGE_BASE) {
      if (entry.patterns.some((p) => p.includes(word) || word.includes(p.split(' ')[0]))) {
        return entry.response;
      }
    }
  }

  // 5. Default fallback from Mathina AI Chef
  return `👋 **Mathina AI Chef at your service!** 👨‍🍳🍗

I'm your personal Master Chef and butchery guide for **Mathina Chicken Center**. Here are the most popular topics I can assist you with right now:

📦 **Store & Ordering Guidance:**
• *"How to order?"* — Step-by-step cut selection, weights, and express checkout
• *"What products are for sale?"* — Complete catalogue of 11+ fresh cuts, eggs, live birds & marinades
• *"Track my order"* — Live butchery cutting, packaging, and rider updates on [/orders](/orders)
• *"How does QR code work?"* — Farm-to-table Halal & freshness verification
• *"Payment methods"* — Indian Bank UPI QR, mobile deep link, and Cash on Delivery
• *"Subscription plans"* — Automated weekly protein deliveries & savings

🍗 **Cuts & Master Recipes:**
• *"How to cook Biryani?"* — Authentic Dum Biryani with Big Curry / Biryani Cut
• *"How to cook Chicken Noodles?"* — Restaurant-style Hakka Noodles with Julienne Cut
• *"Chicken 65 Recipe"* — Crispy spicy chicken bites
• *"Dragon Chicken Recipe"* — Indo-Chinese spicy glazed strips
• *"Butter Chicken Recipe"* — Velvety makhani gravy with Boneless Cubes
• *"Chettinad Pepper Chicken"* — Peppery dry roast with Small Curry Cut
• *"11+ Cuts Guide"* — Discover which cut is best for your dish
• *"Today's prices"* — Live price per kg for all cuts

🏪 **Butchery Details & Fast Contact:**
• **Location:** Cuddalore OT, Tamil Nadu (Open daily 6:00 AM – 10:00 PM)
• **Call / WhatsApp:** **+91 77080 32726** (Owner: Shajan)

*Ask me any question or tap a suggestion chip below to begin!* 👨‍🍳`;
};

// Quick suggestion chips
export const QUICK_SUGGESTIONS = [
  { label: '📦 How to Order', query: 'How to order chicken online?' },
  { label: '🍗 Products for Sale', query: 'What are those products for sale?' },
  { label: '🍛 Biryani Recipe', query: 'How to cook biryani?' },
  { label: '🍜 Chicken Noodles', query: 'How to cook chicken noodles?' },
  { label: '🥘 Butter Chicken', query: 'How to cook butter chicken?' },
  { label: '🐉 Dragon Chicken', query: 'How to cook dragon chicken?' },
  { label: '🌶️ Chicken 65', query: 'How to make chicken 65?' },
  { label: '🥣 Chicken Soup', query: 'How to make country chicken soup?' },
  { label: '💪 Gym Diet Chicken', query: 'How to cook grilled chicken breast for fitness?' },
  { label: '🔪 11+ Cuts Guide', query: 'Tell me about all chicken cuts' },
  { label: '🚚 Track Order', query: 'How to track my order?' },
  { label: '🔍 QR Traceability', query: 'How does QR code traceability work?' },
  { label: '💳 Payment & UPI', query: 'What payment methods are available?' },
  { label: '💰 Today Prices', query: 'What are today chicken prices?' },
  { label: '🏪 Shop & Owner', query: 'Where is Mathina Chicken Center located?' },
];
