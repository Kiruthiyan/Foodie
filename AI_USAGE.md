# AI Usage Statement · Foodie

> **Course**: IN3210 Mobile Applications Development  
> **Assignment**: Assignment 2: Build Your Own Discovery App  
> **Student Index**: `234110`  
> **Project Name**: Foodie  

In compliance with the assignment regulations for IN3210, this document outlines the generative AI tools utilized during the design and development of the **Foodie** mobile application, the specific areas where they provided assistance, and documented cases of critical corrections made to AI-generated output.

---

## 1. AI Tools Utilized

- **Google Gemini / Antigravity AI Assistant**: Utilized for scaffolding initial component structure, generating boilerplate for Redux Toolkit / RTK Query endpoints, structuring Jest unit test suites, and refining TypeScript interfaces.

---

## 2. Areas Where AI Assisted

1. **Boilerplate and Interface Definitions**:
   - Defining typed models for TheMealDB API responses (`MealSummary`, `RawMealDetails`, `CategoryItem`).
   - Scaffolding the React Navigation stack and bottom tab type definitions (`RootStackParamList`, `MainTabParamList`).

2. **Test Suite Generation**:
   - Creating initial unit test assertions for validation rules (`validateUsername`, `validatePassword`, `validateEmail`).
   - Setting up test scenarios for the Smart Search filter algorithm edge cases.

3. **Theme & Token Architecture**:
   - Structuring design token objects for colors (warm cream `#FFFDF9`, tomato red `#E53935`, basil green `#2E7D32`), spacing, and typography into a cohesive theme module.

---

## 3. Genuine Corrections Made to AI-Generated Output

> **[FOR USER REVIEW - CONFIRM THIS EXAMPLE IN YOUR OWN WORDS DURING TECHNICAL CODE WALKTHROUGH]**

### Critical Correction 1: Jest ESM SyntaxError Resolution with `immer` and RTK Query
- **Initial AI Output**:  
  When running `npm test`, the Jest test runner failed with:
  ```
  SyntaxError: Unexpected token 'export'
  at E:\Foodie\node_modules\immer\dist\immer.legacy-esm.js:1727
  ```
  The AI had initially assumed that `jest-expo` would automatically transpile all node modules imported by `@reduxjs/toolkit`.
- **Root Cause & Correction**:  
  In modern Redux Toolkit releases, `immer` provides multiple bundle targets. Under Node.js in the Jest testing environment without full ESM flags, Jest attempted to parse the ES module export statements inside `immer.legacy-esm.js`.  
  I corrected this by configuring a `moduleNameMapper` inside `jest.config.js` to explicitly route `^immer$` directly to its CommonJS build:
  ```javascript
  moduleNameMapper: {
    '^immer$': require.resolve('immer'),
    '^@/(.*)$': '<rootDir>/src/$1',
  }
  ```
  This immediately resolved the syntax error and enabled all 27 automated tests across 4 test suites to execute cleanly.

### Critical Correction 2: Per-User Favourites Isolation to Prevent Cross-Account Leaks
- **Initial AI Output**:  
  The AI initially generated an AsyncStorage helper that used a static key (`'foodie_favourites'`) to persist saved recipe IDs.
- **Root Cause & Correction**:  
  Under a static storage key, if User A (e.g. `emilys`) saved several recipes, logged out, and User B (e.g. `michaelw`) logged in on the same phone, User B would inherit User A's favourites.  
  I updated the persistence architecture to generate dynamic user-scoped keys:
  ```typescript
  const getStorageKey = (userId: number | string): string => `foodie_favourites_${userId}`;
  ```
  Additionally, I introduced a `clearFavouritesState` action dispatched on logout so that the Redux store in-memory state is cleared immediately, guaranteeing total data isolation between accounts.

### Critical Correction 3: Combining TheMealDB Name Search and Category Filtering
- **Initial AI Output**:  
  The initial AI code attempted to call TheMealDB using a non-existent multi-parameter URL query (`search.php?s=chicken&c=Chicken`).
- **Root Cause & Correction**:  
  The public free tier of TheMealDB API does not support combined category and query parameters in a single HTTP request. Calling both parameters causes TheMealDB to ignore the category or return unintended results.  
  I re-architected the Smart Search feature so that when a category is selected, the application queries `filter.php?c={category}` and executes a debounced in-memory filter matching the recipe name using React's `useMemo`. When "All" is selected, it queries `search.php?s={query}`. This preserves full API compatibility while delivering seamless multi-criteria Smart Search.

---

## 4. Student Affirmation

I affirm that I understand every line of code included in this project submission. All AI-assisted components, hooks, reducers, and tests have been thoroughly reviewed, adapted, verified, and tested to meet the IN3210 assignment specifications.
