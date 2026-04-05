import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { ingredientCatalog } from '../data/ingredientCatalog'

const STORAGE_KEY = 'chef-prep-sheet-storage'

const createEntryId = (itemId) =>
  `${itemId}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

const createMultiEntryLine = (item) => ({
  id: createEntryId(item.id),
  quantity: '',
  unit: item.defaultUnit,
  option: '',
  customOption: '',
})

const createManualItemLine = (categoryId) => ({
  id: createEntryId(`${categoryId}-manual`),
  name: '',
  quantity: '',
  unit: 'Nos',
})

const createIngredientValue = (item) =>
  item.allowMultipleEntries
    ? { entries: [createMultiEntryLine(item)] }
    : { quantity: '', unit: item.defaultUnit, option: '', customOption: '' }

const createIngredientsState = () =>
  ingredientCatalog.reduce((accumulator, category) => {
    category.items.forEach((item) => {
      accumulator[item.id] = createIngredientValue(item)
    })

    return accumulator
  }, {})

const createManualItemsState = () =>
  ingredientCatalog.reduce((accumulator, category) => {
    accumulator[category.id] = []
    return accumulator
  }, {})

const createCategoryState = () =>
  ingredientCatalog.reduce((accumulator, category) => {
    accumulator[category.id] = category.id !== 'utensils'
    return accumulator
  }, {})

const defaultChefDetails = {
  chefName: '',
  contactNumber: '',
  cateringServiceName: '',
  eventName: '',
  date: '',
}

const createDefaultState = () => ({
  ingredients: createIngredientsState(),
  manualItems: createManualItemsState(),
  chefDetails: defaultChefDetails,
  categoryOpenState: createCategoryState(),
})

const ingredientMap = Object.fromEntries(
  ingredientCatalog.flatMap((category) => category.items.map((item) => [item.id, item])),
)

const mergeIngredientsState = (savedIngredients = {}) => {
  const defaults = createIngredientsState()

  return Object.fromEntries(
    Object.entries(defaults).map(([itemId, defaultEntry]) => {
      const item = ingredientMap[itemId]
      const savedEntry = savedIngredients[itemId]

      if (item.allowMultipleEntries) {
        const savedLines = Array.isArray(savedEntry?.entries) ? savedEntry.entries : []

        return [
          itemId,
          {
            entries: savedLines.length
              ? savedLines.map((line) => ({
                  ...createMultiEntryLine(item),
                  ...line,
                  id: line.id || createEntryId(item.id),
                }))
              : defaultEntry.entries,
          },
        ]
      }

      return [itemId, { ...defaultEntry, ...(savedEntry || {}) }]
    }),
  )
}

const mergeManualItemsState = (savedManualItems = {}) => {
  const defaults = createManualItemsState()

  return Object.fromEntries(
    Object.keys(defaults).map((categoryId) => {
      const savedItems = Array.isArray(savedManualItems?.[categoryId]) ? savedManualItems[categoryId] : []

      return [
        categoryId,
        savedItems.map((item) => ({
          ...createManualItemLine(categoryId),
          ...item,
          id: item.id || createEntryId(`${categoryId}-manual`),
        })),
      ]
    }),
  )
}

export const usePrepSheetStore = create()(
  persist(
    (set) => ({
      ...createDefaultState(),
      updateIngredient: (itemId, key, value) =>
        set((state) => ({
          ingredients: {
            ...state.ingredients,
            [itemId]: {
              ...state.ingredients[itemId],
              [key]: value,
            },
          },
        })),
      updateIngredientEntry: (itemId, entryId, key, value) =>
        set((state) => ({
          ingredients: {
            ...state.ingredients,
            [itemId]: {
              ...state.ingredients[itemId],
              entries: state.ingredients[itemId].entries.map((entry) =>
                entry.id === entryId ? { ...entry, [key]: value } : entry,
              ),
            },
          },
        })),
      addIngredientEntry: (itemId) =>
        set((state) => {
          const item = ingredientMap[itemId]

          return {
            ingredients: {
              ...state.ingredients,
              [itemId]: {
                ...state.ingredients[itemId],
                entries: [...state.ingredients[itemId].entries, createMultiEntryLine(item)],
              },
            },
          }
        }),
      removeIngredientEntry: (itemId, entryId) =>
        set((state) => {
          const item = ingredientMap[itemId]
          const entries = state.ingredients[itemId].entries.filter((entry) => entry.id !== entryId)

          return {
            ingredients: {
              ...state.ingredients,
              [itemId]: {
                ...state.ingredients[itemId],
                entries: entries.length ? entries : [createMultiEntryLine(item)],
              },
            },
          }
        }),
      addManualItem: (categoryId) =>
        set((state) => ({
          manualItems: {
            ...state.manualItems,
            [categoryId]: [...(state.manualItems[categoryId] || []), createManualItemLine(categoryId)],
          },
        })),
      updateManualItem: (categoryId, manualItemId, key, value) =>
        set((state) => ({
          manualItems: {
            ...state.manualItems,
            [categoryId]: (state.manualItems[categoryId] || []).map((item) =>
              item.id === manualItemId ? { ...item, [key]: value } : item,
            ),
          },
        })),
      removeManualItem: (categoryId, manualItemId) =>
        set((state) => ({
          manualItems: {
            ...state.manualItems,
            [categoryId]: (state.manualItems[categoryId] || []).filter((item) => item.id !== manualItemId),
          },
        })),
      updateChefDetails: (key, value) =>
        set((state) => ({
          chefDetails: {
            ...state.chefDetails,
            [key]: value,
          },
        })),
      toggleCategory: (categoryId) =>
        set((state) => ({
          categoryOpenState: {
            ...state.categoryOpenState,
            [categoryId]: !state.categoryOpenState[categoryId],
          },
        })),
      clearAll: () => set(createDefaultState()),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 2,
      merge: (persistedState, currentState) => {
        const savedState = persistedState && typeof persistedState === 'object' ? persistedState : {}

        return {
          ...currentState,
          ...savedState,
          ingredients: mergeIngredientsState(savedState.ingredients),
          manualItems: mergeManualItemsState(savedState.manualItems),
          chefDetails: { ...defaultChefDetails, ...savedState.chefDetails },
          categoryOpenState: { ...createCategoryState(), ...savedState.categoryOpenState },
        }
      },
    },
  ),
)