import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { restoreSession } from '../features/auth/authSlice';
import { loadFavouritesForUser } from '../features/favourites/favouritesSlice';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { RecipeDetailsScreen } from '../features/recipes/RecipeDetailsScreen';
import { FoodieLogo } from '../components/FoodieHeader';
import { RootStackParamList } from './types';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isRestoringSession, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  // When user is authenticated, load their favourites immediately
  useEffect(() => {
    if (user?.id) {
      dispatch(loadFavouritesForUser(user.id));
    }
  }, [user?.id, dispatch]);

  if (isRestoringSession) {
    return (
      <View style={styles.splashContainer}>
        <FoodieLogo size="large" />
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 24 }}
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen
              name="RecipeDetails"
              component={RecipeDetailsScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
