import { formatMealDetails, RawMealDetails } from '../src/api/mealDbApi';

describe('formatMealDetails Unit Tests', () => {
  it('correctly extracts non-empty ingredients and measurements up to 20', () => {
    const rawMeal: RawMealDetails = {
      idMeal: '52772',
      strMeal: 'Teriyaki Chicken Casserole',
      strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg',
      strCategory: 'Chicken',
      strArea: 'Japanese',
      strInstructions: 'Preheat oven to 350 degrees F. Bake for 30 minutes.',
      strTags: 'Meat,Casserole',
      strYoutube: 'https://www.youtube.com/watch?v=4aZr5hZXP_s',
      strSource: null,
      strIngredient1: 'soy sauce',
      strMeasure1: '3/4 cup',
      strIngredient2: 'water',
      strMeasure2: '1/2 cup',
      strIngredient3: 'brown sugar',
      strMeasure3: '1/4 cup',
      strIngredient4: '', // empty
      strMeasure4: '',
      strIngredient5: 'chicken breasts',
      strMeasure5: '2 pounds',
      // remaining undefined
    };

    const formatted = formatMealDetails(rawMeal);

    expect(formatted.id).toBe('52772');
    expect(formatted.title).toBe('Teriyaki Chicken Casserole');
    expect(formatted.category).toBe('Chicken');
    expect(formatted.area).toBe('Japanese');
    expect(formatted.tags).toEqual(['Meat', 'Casserole']);
    expect(formatted.ingredients).toHaveLength(4);
    expect(formatted.ingredients[0]).toEqual({ name: 'soy sauce', measure: '3/4 cup' });
    expect(formatted.ingredients[3]).toEqual({ name: 'chicken breasts', measure: '2 pounds' });
    expect(formatted.youtubeUrl).toBe('https://www.youtube.com/watch?v=4aZr5hZXP_s');
  });

  it('provides safe fallbacks for missing optional fields', () => {
    const minimalMeal: RawMealDetails = {
      idMeal: '99999',
      strMeal: 'Minimal Recipe',
      strMealThumb: 'thumb.jpg',
    };

    const formatted = formatMealDetails(minimalMeal);

    expect(formatted.category).toBe('General');
    expect(formatted.area).toBe('International');
    expect(formatted.tags).toEqual(['Recipe']);
    expect(formatted.instructions).toBe('No instructions provided.');
    expect(formatted.ingredients).toEqual([]);
    expect(formatted.youtubeUrl).toBeUndefined();
  });
});
