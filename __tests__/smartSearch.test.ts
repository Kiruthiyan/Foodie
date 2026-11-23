import { MealSummary } from '../src/api/mealDbApi';

// Helper function implementing the Smart Search filter logic for verification
export function applySmartSearchFilter(
  meals: MealSummary[],
  query: string,
  category: string
): MealSummary[] {
  let result = [...meals];

  // Apply category filter if not "All"
  if (category && category !== 'All') {
    result = result.filter(
      (m) => (m.strCategory || '').toLowerCase() === category.toLowerCase()
    );
  }

  // Apply search query filter if provided
  if (query && query.trim().length > 0) {
    const q = query.toLowerCase().trim();
    result = result.filter((m) => m.strMeal.toLowerCase().includes(q));
  }

  return result;
}

describe('Smart Search Filter Edge Cases', () => {
  const sampleMeals: MealSummary[] = [
    {
      idMeal: '1',
      strMeal: 'Chicken Alfredo',
      strMealThumb: 'thumb1.jpg',
      strCategory: 'Chicken',
      strArea: 'Italian',
    },
    {
      idMeal: '2',
      strMeal: 'Chicken Tikka',
      strMealThumb: 'thumb2.jpg',
      strCategory: 'Chicken',
      strArea: 'Indian',
    },
    {
      idMeal: '3',
      strMeal: 'Beef Stroganoff',
      strMealThumb: 'thumb3.jpg',
      strCategory: 'Beef',
      strArea: 'Russian',
    },
    {
      idMeal: '4',
      strMeal: 'Beef Burger',
      strMealThumb: 'thumb4.jpg',
      strCategory: 'Beef',
      strArea: 'American',
    },
    {
      idMeal: '5',
      strMeal: 'Chocolate Souffle',
      strMealThumb: 'thumb5.jpg',
      strCategory: 'Dessert',
      strArea: 'French',
    },
  ];

  it('returns all items when category is "All" and query is empty', () => {
    const filtered = applySmartSearchFilter(sampleMeals, '', 'All');
    expect(filtered).toHaveLength(5);
  });

  it('filters by category only when query is empty', () => {
    const chickenMeals = applySmartSearchFilter(sampleMeals, '', 'Chicken');
    expect(chickenMeals).toHaveLength(2);
    expect(chickenMeals.map((m) => m.strMeal)).toEqual(['Chicken Alfredo', 'Chicken Tikka']);
  });

  it('filters by name query only when category is "All"', () => {
    const burgerMeals = applySmartSearchFilter(sampleMeals, 'burger', 'All');
    expect(burgerMeals).toHaveLength(1);
    expect(burgerMeals[0].strMeal).toBe('Beef Burger');
  });

  it('combines query and category correctly (matching case)', () => {
    const result = applySmartSearchFilter(sampleMeals, 'tikka', 'Chicken');
    expect(result).toHaveLength(1);
    expect(result[0].strMeal).toBe('Chicken Tikka');
  });

  it('returns empty list when query does not match inside the selected category (edge case)', () => {
    // "burger" exists, but under Beef, NOT Chicken
    const result = applySmartSearchFilter(sampleMeals, 'burger', 'Chicken');
    expect(result).toHaveLength(0);
  });

  it('handles case-insensitivity and extra whitespace gracefully', () => {
    const result = applySmartSearchFilter(sampleMeals, '   CHICKEN  ', 'CHICKEN');
    expect(result).toHaveLength(2);
  });

  it('clearing filters returns full dataset', () => {
    // simulate user clearing filters
    const cleared = applySmartSearchFilter(sampleMeals, '', 'All');
    expect(cleared).toHaveLength(sampleMeals.length);
  });
});
