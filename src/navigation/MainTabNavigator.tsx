import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { HomeScreen } from '../features/recipes/HomeScreen';
import { SearchScreen } from '../features/search/SearchScreen';
import { FavouritesScreen } from '../features/favourites/FavouritesScreen';
import { ProfileScreen } from '../features/profile/ProfileScreen';
import { MainTabParamList } from './types';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { layout } from '../theme/spacing';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 10);

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: [
          styles.tabBar,
          {
            height: layout.tabBarHeight + bottomPadding,
            paddingBottom: bottomPadding,
          },
        ],
        tabBarItemStyle: styles.tabBarItem,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarHideOnKeyboard: Platform.OS === 'android',
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarAccessibilityLabel: 'Home tab',
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size || 22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarAccessibilityLabel: 'Search tab',
          tabBarIcon: ({ color, size }) => (
            <Feather name="search" size={size || 22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="FavouritesTab"
        component={FavouritesScreen}
        options={{
          tabBarLabel: 'Favourites',
          tabBarAccessibilityLabel: 'Favourites tab',
          tabBarIcon: ({ color, size }) => (
            <Feather name="heart" size={size || 22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarAccessibilityLabel: 'Profile tab',
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size || 22} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.tabBarBackground,
    borderTopWidth: 1,
    borderTopColor: colors.tabBarBorder,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 8,
  },
  tabBarItem: {
    minHeight: layout.minTouchTarget,
    paddingVertical: 4,
  },
  tabBarLabel: {
    ...typography.captionBold,
    fontSize: 11,
    marginTop: 2,
  },
});
