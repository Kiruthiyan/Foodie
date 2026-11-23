import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strTags?: string | null;
}

export interface RawMealDetails extends MealSummary {
  strInstructions?: string;
  strYoutube?: string | null;
  strSource?: string | null;
  [key: `strIngredient${number}`]: string | null | undefined;
  [key: `strMeasure${number}`]: string | null | undefined;
}

export interface IngredientItem {
  name: string;
  measure: string;
}

export interface FormattedMealDetails {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  area: string;
  tags: string[];
  instructions: string;
  ingredients: IngredientItem[];
  youtubeUrl?: string | null;
  sourceUrl?: string | null;
}

export interface CategoryItem {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export function formatMealDetails(raw: RawMealDetails): FormattedMealDetails {
  const ingredients: IngredientItem[] = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = raw[`strIngredient${i}`];
    const measure = raw[`strMeasure${i}`];

    if (ingredient && typeof ingredient === 'string' && ingredient.trim().length > 0) {
      ingredients.push({
        name: ingredient.trim(),
        measure: measure && typeof measure === 'string' ? measure.trim() : '',
      });
    }
  }

  const tags = raw.strTags
    ? raw.strTags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
    : [];

  return {
    id: raw.idMeal,
    title: raw.strMeal,
    thumbnail: raw.strMealThumb,
    category: raw.strCategory || 'General',
    area: raw.strArea || 'International',
    tags: tags.length > 0 ? tags : [raw.strCategory || 'Recipe'],
    instructions: raw.strInstructions || 'No instructions provided.',
    ingredients,
    youtubeUrl: raw.strYoutube,
    sourceUrl: raw.strSource,
  };
}

export const mealDbApi = createApi({
  reducerPath: 'mealDbApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://www.themealdb.com/api/json/v1/1/',
  }),
  tagTypes: ['Recipe', 'Category'],
  endpoints: (builder) => ({
    // Get all categories
    getCategories: builder.query<CategoryItem[], void>({
      query: () => 'categories.php',
      transformResponse: (response: { categories?: CategoryItem[] }) => {
        return response.categories || [];
      },
      providesTags: ['Category'],
    }),

    // Search recipes by query string
    searchRecipesByName: builder.query<MealSummary[], string>({
      query: (query: string) => `search.php?s=${encodeURIComponent(query.trim())}`,
      transformResponse: (response: { meals?: MealSummary[] | null }) => {
        return response.meals || [];
      },
      providesTags: ['Recipe'],
    }),

    // Filter recipes by category
    filterByCategory: builder.query<MealSummary[], string>({
      query: (category: string) => `filter.php?c=${encodeURIComponent(category.trim())}`,
      transformResponse: (response: { meals?: MealSummary[] | null }) => {
        return response.meals || [];
      },
      providesTags: ['Recipe'],
    }),

    // Get recipe details independently by ID
    getRecipeById: builder.query<FormattedMealDetails | null, string>({
      query: (id: string) => `lookup.php?i=${encodeURIComponent(id.trim())}`,
      transformResponse: (response: { meals?: RawMealDetails[] | null }) => {
        if (!response.meals || response.meals.length === 0) {
          return null;
        }
        return formatMealDetails(response.meals[0]);
      },
      providesTags: (_result, _error, id) => [{ type: 'Recipe', id }],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useSearchRecipesByNameQuery,
  useFilterByCategoryQuery,
  useGetRecipeByIdQuery,
} = mealDbApi;
