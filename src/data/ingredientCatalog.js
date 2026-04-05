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

export const ingredientCatalog = [
  {
    id: 'vegetables',
    name: 'Vegetables',
    accent: 'from-emerald-500/25 via-lime-400/15 to-transparent',
    items: createItems(
      'vegetables',
      ['Potato', 'Onion', 'Tomato', 'Carrot', 'Beans', 'Capsicum', 'Green Peas', 'Cauliflower', 'Cabbage', 'Brinjal', 'Mushroom', 'Baby Corn', 'Sweet Corn', 'Cucumber'],
      'Kg',
      ['Potato', 'Onion', 'Tomato', 'Carrot', 'Beans', 'Capsicum'],
    ),
  },
  {
    id: 'fruits',
    name: 'Fruits',
    accent: 'from-amber-400/25 via-orange-400/10 to-transparent',
    items: createItems(
      'fruits',
      ['Apple', 'Banana', 'Orange', 'Mosambi', 'Pineapple', 'Watermelon', 'Grapes', 'Papaya', 'Mango'],
      'Nos',
      ['Apple', 'Banana', 'Orange', 'Pineapple'],
    ).map((item) => ({
      ...item,
      defaultUnit: item.name === 'Grapes' ? 'Kg' : item.defaultUnit,
    })),
  },
  {
    id: 'dairy',
    name: 'Dairy & Essentials',
    accent: 'from-sky-400/25 via-cyan-300/10 to-transparent',
    items: createItems(
      'dairy',
      ['Milk', 'Curd', 'Paneer', 'Butter', 'Ghee', 'Fresh Cream', 'Cheese', 'Khova'],
      'Kg',
      ['Milk', 'Curd', 'Paneer', 'Butter', 'Ghee'],
    ).map((item) => ({
      ...item,
      defaultUnit: item.name === 'Milk' ? 'Liters' : item.defaultUnit,
    })),
  },
  {
    id: 'masalas',
    name: 'Masalas / Powders',
    accent: 'from-rose-500/20 via-orange-400/15 to-transparent',
    items: createItems(
      'masalas',
      ['Salt', 'Turmeric Powder', 'Red Chilli Powder', 'Coriander Powder', 'Garam Masala', 'Cumin Seeds', 'Mustard Seeds', 'Black Pepper', 'Cardamom', 'Cloves', 'Cinnamon', 'Tea Powder', 'Coffee Powder'],
      'Grams',
      ['Salt', 'Turmeric Powder', 'Red Chilli Powder', 'Coriander Powder', 'Garam Masala'],
    ).map((item) => ({
      ...item,
      defaultUnit: item.name === 'Salt' ? 'Kg' : item.defaultUnit,
    })),
  },
  {
    id: 'non-veg',
    name: 'Non-Veg',
    accent: 'from-red-500/20 via-rose-400/15 to-transparent',
    items: createItems(
      'non-veg',
      ['Chicken', 'Chicken Boneless', 'Chicken Drumsticks', 'Mutton', 'Fish', 'Prawns', 'Eggs'],
      'Kg',
      ['Chicken', 'Chicken Boneless', 'Fish', 'Eggs'],
    ).map((item) => ({
      ...item,
      defaultUnit: item.name === 'Eggs' ? 'Nos' : item.defaultUnit,
    })),
  },
  {
    id: 'grains-oils',
    name: 'Grains, Oils & Dry Items',
    accent: 'from-yellow-400/20 via-amber-300/10 to-transparent',
    items: createItems(
      'grains-oils',
      ['Sona Masuri Rice', 'Basmati Rice', 'Atta', 'Maida', 'Suji', 'Bombay Rava', 'Toor Dal', 'Moong Dal', 'Chana Dal', 'Cashew Nuts', 'Raisins', 'Refined Oil', 'Sunflower Oil', 'Sugar', 'Jaggery'],
      'Kg',
      ['Sona Masuri Rice', 'Basmati Rice', 'Atta', 'Maida', 'Refined Oil', 'Sugar'],
    ).map((item) => ({
      ...item,
      defaultUnit: ['Refined Oil', 'Sunflower Oil'].includes(item.name) ? 'Liters' : item.defaultUnit,
    })),
  },
  {
    id: 'home-items',
    name: 'Home / Service Items',
    accent: 'from-violet-400/15 via-stone-300/10 to-transparent',
    items: createItems(
      'home-items',
      ['Mineral Water', 'Cool Drinks', 'Tea', 'Coffee', 'Coal Bag', 'Gas Cylinder Full', 'Table Cloth', 'Tissue Paper', 'Paper Napkins', 'Butter Paper', 'Foil Roll', 'Banana Leaves'],
      'Nos',
      ['Mineral Water', 'Gas Cylinder Full', 'Tissue Paper', 'Paper Napkins'],
    ),
  },
  {
    id: 'utensils',
    name: 'Utensils',
    accent: 'from-slate-400/20 via-stone-300/10 to-transparent',
    items: createItems(
      'utensils',
      [
        { name: 'Lagan', allowMultipleEntries: true, sizeOptions: ['10 L', '15 L', '20 L', '30 L', '40 L', '50 L'], allowCustomOption: true, optionLabel: 'Lagan Size', customOptionPlaceholder: 'Example: 25 L' },
        { name: 'Bagona', allowMultipleEntries: true, sizeOptions: ['10 L', '12 L', '16 L', '20 L', '25 L', '35 L'], allowCustomOption: true, optionLabel: 'Bagona Size', customOptionPlaceholder: 'Example: 18 L' },
        { name: 'Diggi', allowMultipleEntries: true, sizeOptions: ['26 L', '40 L', '50 L'], allowCustomOption: true, optionLabel: 'Diggi Size', customOptionPlaceholder: 'Example: 32 L' },
        { name: 'Steel Jugs', allowMultipleEntries: true, sizeOptions: ['Small', 'Medium', 'Large'], allowCustomOption: true, optionLabel: 'Jug Size', customOptionPlaceholder: 'Example: 5 L' },
        '80 ml Cups', '90 ml Cups', '50 ml Cups', '250 ml Bowls', 'Silver Plates', 'White Plates', 'Tea Spoons', 'Table Spoons', 'Serving Spoons', 'Ladles', 'Gas Stove', 'Cutting Boards'
      ],
      'Nos',
      ['Lagan', 'Bagona', 'Serving Spoons', 'Ladles', '80 ml Cups'],
    ).map((item) => ({ ...item, allowMultipleEntries: true })),
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
