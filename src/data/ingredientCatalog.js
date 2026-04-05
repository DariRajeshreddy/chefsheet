export const UNIT_OPTIONS = ['Kg', 'Grams', 'Liters', 'Nos']

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const createItems = (categoryId, names, defaultUnit, frequentNames = []) =>
  names.map((entry) => {
    const item = typeof entry === 'string' ? { name: entry } : entry

    return {
      id: item.id || `${categoryId}-${slugify(item.name)}`,
      name: item.name,
      defaultUnit: item.defaultUnit || defaultUnit,
      frequent: frequentNames.includes(item.name),
      allowMultipleEntries: item.allowMultipleEntries || false,
      sizeOptions: item.sizeOptions || [],
      optionLabel: item.optionLabel || 'Size / Variant',
      allowCustomOption: item.allowCustomOption || false,
      customOptionPlaceholder: item.customOptionPlaceholder || 'Enter custom size',
    }
  })

const byNameDefaultUnit = (unitMap) => (item) => ({
  ...item,
  defaultUnit: unitMap[item.name] || item.defaultUnit,
})

export const ingredientCatalog = [
  {
    id: 'grocery',
    name: 'Grocery',
    accent: 'from-yellow-400/20 via-amber-300/10 to-transparent',
    items: createItems(
      'grocery',
      [
        // Rice & Basics
        'Sona Masoori Rice',
        'Basmati Rice',
        'Sugar',
        'Jaggery (Bellam)',
        'Refined Oil',
        'Dalda',
        'Pure Ghee (Clarified Butter)',

        // Flours
        'Wheat Atta (Wheat Flour)',
        'Bombay Atta',
        'Maida (Refined Flour)',
        'Chana Atta (Besan)',
        'Bombay Besan',
        'Bombay Rava (Sooji)',
        'Idli Rava',

        // Dals
        'Toor Dal',
        'Chana Dal',
        'Urad Dal',
        'Moong Dal',
        'Red Dal',
        'Putana Dal (Roasted Chana Dal)',

        // Salt & Powders
        'Rock Salt',
        'Table Salt',
        'Red Chilli Powder',
        'Turmeric Powder',
        'Coriander Powder',
        'Tamarind',
        'Black Pepper',
        'White Pepper',
        'Pepper Powder',
        'Coriander Seeds',
        'Amchur Powder',
        'Chaat Masala',
        'Mutton Masala',
        'Chicken Masala',
        'Sambar Powder',
        'Rasam Powder',
        'Corn Flour',
        'Milk Powder',
        'Milkmaid',

        // Dry Items
        'Dry Coconut',
        'Poppy Seeds (Khus Khus)',
        'Sesame Seeds (Til)',
        'Peanuts',
        'Coconut Powder',

        // Spices
        'Jeera (Cumin Seeds)',
        'Jeera Powder',
        'Dry Ginger Powder',
        'Mustard Powder',
        'Mustard Seeds',
        'Methi (Fenugreek)',
        'Garam Masala',
        'Chole Masala',
        'Biryani Masala Powder',
        'Bread Crumbs',
        'Dry Red Chilli',
        'Fenugreek Seeds',
        'Lemon Salt',
        'Black Salt Powder',
        'Patika (Sugar Candy)',
        'Hing (Asafoetida)',
        'Misri (Rock Sugar)',
        'Tasting Salt',
        'Custard Powder',

        // Pulses & Beans
        'Kabuli Chana',
        'Dry Green Peas',
        'White Peas',
        'Rajma (Kidney Beans)',
        'Lobiya (Black Eyed Beans)',
        'Moong Whole',
        'Kulthi (Horse Gram)',
        'Small Chana',

        // Dry Fruits
        'Cashew (Kaju)',
        'Pistachio (Pista)',
        'Almond (Badam)',
        'Kismis (Raisins)',
        'Dry Dates (Khajur)',
        'Anjeer (Dry Fig)',

        // Fruits
        'Watermelon (Tarbuj)',
        'Muskmelon (Kharbuja)',

        // Misc Food
        'Coconut',
        'Cornflakes',
        'Green Cardamom',
        'Cinnamon',
        'Shah Jeera',
        'Kabsa Chini',
        'Cloves',
        'Bay Leaf',
        'Oma (Ajwain)',

        // Baking & Chemicals
        'Cooking Soda',
        'Washing Soda',
        'Saffron',

        // Colors
        'Red Food Colour',
        'Kesari Colour',
        'Lemon Yellow Colour',
        'Rajbhog Colour',
        'Pista Colour',

        // Essences
        'Pista Essence',
        'Kewra Essence',
        'Pineapple Essence',
        'Vanilla Essence',
        'Badam Essence',

        // Decoration
        'Silver Foil (Varak)',

        // Snacks
        'Papad',
        'Fryums',

        // Sauces
        'Tomato Sauce',
        'Green Chilli Sauce',
        'Red Chilli Sauce',
        'Soy Sauce',
        'Vinegar',

        // Oils
        'Mustard Oil',

        // Packed Items
        'Pineapple Tins',
        'Mixed Fruit Tins',
        'Bambino',
        'Noodles',
        'Soup Mix',

        // Dairy & Drinks
        'Coffee Powder',
        'Tea Powder',
        'Boost',

        // Cleaning & Others
        'Surf Powder',

        // Food Items
        'Meal Maker (Soya Chunks)',
        'Nutrela',
        'Onions',
        'Ginger (Adrak)',
        'Garlic Paste',

        // Bakery
        'Tutti Frutti',
        'Sponge Cake',
        'Bread',

        // Packing
        'Butter Paper',
        'Silver Foil',
        'Plastic Paper',
        'Idli Cloth',
      ],
      'Kg',
      ['Sona Masuri Rice', 'Basmati Rice', 'Sugar', 'Refined Oil', 'Atta', 'Toor Dal', 'Table Salt'],
    ).map(
      byNameDefaultUnit({
        'Refined Oil': 'Liters',
        'Pure Ghee': 'Liters',
        'Tomato Sauce': 'Liters',
        'Green Chilli Sauce': 'Liters',
        'Red Chilli Sauce': 'Liters',
        'Soya Sauce': 'Liters',
        Vinegar: 'Liters',
        'Pine Apple Tins': 'Nos',
        'Mixed Fruit Tins': 'Nos',
        Bambino: 'Nos',
        Noodles: 'Nos',
        Soup: 'Nos',
        Papad: 'Nos',
        Frymes: 'Nos',
        Kurkure: 'Nos',
        Boost: 'Nos',
        'Meal Maker': 'Nos',
      }),
    ),
  },
  {
    id: 'freezer-items',
    name: 'Freezer Items',
    accent: 'from-sky-400/25 via-cyan-300/10 to-transparent',
    items: createItems(
      'freezer-items',
      ['Kova', 'Milk', 'Curd', 'Paneer', 'Malai', 'Baby Corn', 'Mushrooms', 'Sweet Corn', 'Safal Mutter', 'Penilu', 'Barik Sev(sanna sev)', 'White Kalakan', 'Ajmeer Kalakan', 'Corn Soup Tins', 'Ice'],
      'Kg',
      ['Milk', 'Curd', 'Paneer', 'Baby Corn', 'Mushrooms'],
    ).map(
      byNameDefaultUnit({
        Milk: 'Liters',
      }),
    ),
  },
  {
    id: 'fruits',
    name: 'Fruits',
    accent: 'from-amber-400/25 via-orange-400/10 to-transparent',
    items: createItems(
      'fruits',
      ['Banana', 'Mosambi', 'Santra', 'Apples', 'Sapota', 'Kiwis', 'Mangoes', 'Dragon Fruit', 'White Turbuz', 'Cherries', 'Water Melon'],
      'Nos',
      ['Banana', 'Mosambi', 'Santra', 'Apples', 'Mangoes'],
    ),
  },
  {
    id: 'vegetables',
    name: 'Vegetables',
    accent: 'from-emerald-500/25 via-lime-400/15 to-transparent',
    items: createItems(
      'vegetables',
      ['Aalu Big', 'Baigan', 'Tomato Desi', 'Tomato Bng', 'Capsicum', 'Cabbage', 'Cauliflower', 'Beetroot', 'Lemons', 'Green Chilli', 'Bajji-Mirchi', 'Beans', 'Tamrind-(Chintakayalu)', 'BoppayaKaya', 'Arvi-(ChamaGadda)', 'Mint', 'Ladies Finger', 'Drumsticks', 'Kaddu-Big', 'BudamaKaya', 'Dondakaya', 'Bottle Gourd', 'Gavatai Palli-(Gokarakaya)', 'Kakara', 'Gajar Big', 'Kheera', 'Carrot Big', 'Kachha Batana', 'Matar', 'Mullangi'],
      'Kg',
      ['Aalu Big', 'Baigan', 'Capsicum', 'Cabbage', 'Cauliflower', 'Beans', 'Green Chilli'],
    ),
  },
  {
    id: 'green-leafs',
    name: 'Green Leafs',
    accent: 'from-green-400/20 via-emerald-200/10 to-transparent',
    items: createItems(
      'green-leafs',
      ['Spring Onion', 'Palak', 'Ambadeki Baji-(Gongura)', 'Gangavaiki Baji-(Gangavayala)', 'Methi', 'Noorkol-(SoyiKura)', 'Kothimir', 'Pudina', 'Curry Leafs', 'Double Beans-(TamalaPaku)', 'Pasav Tokri-(Pasav Gampalu)', 'Pedda Gampalu', 'Chenigari Gampalu'],
      'Kg',
      ['Spring Onion', 'Palak', 'Methi', 'Kothimir', 'Pudina', 'Curry Leaves'],
    ),
  },
  {
    id: 'home-items',
    name: 'Home Items',
    accent: 'from-violet-400/15 via-stone-300/10 to-transparent',
    items: createItems(
      'home-items',
      ['MixerGrinder', 'Bindey', 'Taraz', 'Gas Cylinder Full', 'Match Box', 'Kerosene/Diesel', 'Old Cloth', 'News Papers', 'Cooker Big', 'Fire Wood Small', 'Gas Big', 'Coal Big', 'Cleaners'],
      'Nos',
      ['Gas Cylinder Full', 'Cooker Big'],
    ),
  },
  {
    id: 'non-veg',
    name: 'Non-Veg',
    accent: 'from-red-500/20 via-rose-400/15 to-transparent',
    items: createItems(
      'non-veg',
      ['Biryani Mutton-(50gm 1 Piece)', 'Kurma Mutton (25 gms)', 'Mutton Boneless', 'Mutton Keema', 'Seena Mutton', 'Biryani Chicken-(50gm 1 piece-skinless)', 'Chicken Skinless', 'Chicken Dressed', 'Chicken Kheema', 'Tandoori Chicken', 'Fish Boneless', 'Fish Marral', 'Fish Ravulu', 'Fish With Bone', 'Prawns', 'Tiger Prawns', 'Eggs', 'Boti', 'Liver', 'Paya', 'Mundi'],
      'Kg',
      ['Mutton Boneless', 'Chicken Skinless', 'Chicken Dressed', 'Fish Boneless'],
    ).map(
      byNameDefaultUnit({
        Boti: 'Nos',
        Liver: 'Nos',
        Paya: 'Nos',
        Mundi: 'Nos',
      }),
    ),
  },
  {
    id: 'use-throw',
    name: 'Use & Throw',
    accent: 'from-amber-300/25 via-yellow-200/15 to-transparent',
    items: createItems(
      'use-throw',
      [
        'Water Glass',
        'Juice Glass',
        'Tooth pics',
        'Tooth pics-Big',
        'Tea Cups',
        'Ice-cream Cups',
        'Ice Cream Spoons',
        'Sweet Cups',
        'Sweet Spoons',
        'Paya/Soup Cups',
        'Soup Spoons',
        'Garbage/Dustbin bags',
        '50 ml Cups',
        '80 ml Cups',
        '90 ml Cups',
        '250 ml Bowls',
        'Paper Bowls',
        'Curry Bowls',
        'Paper Plates',
        'Silver Plates',
        'White Plates',
        'Tissues',
        'Marker',
        'Name Boards',
        'Silver Foil',
        'Food Rap roll',
        'Idli Cloth',
        'Paper Napkins',
        'Double Tape',
        'Table Covers'
      ],
      'Nos',
      ['Water Glass', 'Tea Cups', 'Ice Cream Spoons', '80 ml Cups', 'Silver Plates', 'White Plates'],
    ),
  },
  {
    id: 'utensils',
    name: 'Utensils',
    accent: 'from-slate-400/20 via-stone-300/10 to-transparent',
    items: createItems(
      'utensils',
      [
        'Degsha + Covers 80-(Kg)',
        'Degsha + Covers 60-(Kg)',
        'Degsha + Covers 50-(Kg)',
        'Degsha + Covers 40-(Kg)',
        'Degsha + Covers 30-(Kg)',
        'Degsha + Covers 20-(Kg)',
        'Bagona + Covers 30-(Kg)',
        'Bagona + Covers 25-(Kg)',
        'Bagona + Covers 20-(Kg)',
        'Bagona + Covers 15-(Kg)',
        'Bagona + Covers 10-(Kg)',
        'Bagona + Covers 5-(Kg)',
        'Lagan + Covers 60-(Kg)',
        'Lagan + Covers 50-(Kg)',
        'Lagan + Covers 40-(Kg)',
        'Lagan + Covers 30-(Kg)',
        'Lagan + Covers 20-(Kg)',
        'Lagan + Covers 15-(Kg)',
        'Lagan + Covers 10-(Kg)',
        'Sweet-Kisti',
        'Oil Kadai',
        'White Kadai',
        'Jilebi Kadai',
        'Table Spoons',
        'Kabgirs',
        'Jaras',
        'Doras',
        'Steel Besans with Spoons',
        'Steel Bucket with Spoons',
        'Steel Jugs',
        'Drums',
        'Gas Chulha Big',
        'DoubleConnection Gas Stove',
        'Steel Tubs',
        'Table with Stand',
        'Carpets',
        'Table Cloth',
        'Curry Bowls',
        'Hot Dishes',
        'Lakdika Chulleka Stand',
        'Irani Katti',
        'Dosa-Tawa',
      ],
      'Nos',
      ['Table Spoons', 'Steel Jug', 'Table Cloth', 'Hot Dishes'],
    ),
  },
]

export const allIngredients = ingredientCatalog.flatMap((category) =>
  category.items.map((item) => ({
    ...item,
    categoryId: category.id,
    categoryName: category.name,
  })),
)

export const frequentIngredients = allIngredients.filter((item) => item.frequent)