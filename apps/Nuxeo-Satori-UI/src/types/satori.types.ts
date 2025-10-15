/**
 * Satori Design System Type Definitions
 * 
 * This file contains custom TypeScript interfaces and type guards 
 * specifically for working with the Satori design system in a type-safe manner.
 */

import type { SatNavigationItem } from '@hylandsoftware/satori-devkit';
import type { SatNavigationItem as PlatformNavSatNavigationItem } from '@hylandsoftware/satori-ui/platform-nav';

// =============================================================================
// THEME INTERFACES
// =============================================================================

/**
 * Represents a Satori theme configuration
 */
export interface ISatoriTheme {
  readonly name: string;
  readonly mode: 'light' | 'dark' | 'auto';
  readonly primary?: string;
  readonly secondary?: string;
  readonly accent?: string;
}

/**
 * Comprehensive Satori application configuration
 */
export interface ISatoriConfig {
  readonly theme: ISatoriTheme;
  readonly navigation: SatNavigationItem[];
  readonly features?: ISatoriFeatures;
  readonly i18n?: ISatoriI18nConfig;
}

/**
 * Feature flags for Satori components
 */
export interface ISatoriFeatures {
  readonly enableDarkMode: boolean;
  readonly enableI18n: boolean;
  readonly enableAccessibility: boolean;
  readonly enableAnimations: boolean;
}

/**
 * Internationalization configuration
 */
export interface ISatoriI18nConfig {
  readonly defaultLanguage: string;
  readonly availableLanguages: readonly string[];
  readonly fallbackLanguage: string;
}

// =============================================================================
// NAVIGATION INTERFACES  
// =============================================================================

/**
 * Extended navigation item with additional metadata
 */
export interface IExtendedNavigationItem extends SatNavigationItem {
  readonly permissions?: readonly string[];
  readonly isVisible?: boolean;
  readonly badge?: string | number;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Navigation menu structure
 */
export interface INavigationMenu {
  readonly id: string;
  readonly title: string;
  readonly items: readonly IExtendedNavigationItem[];
  readonly isCollapsible: boolean;
}

// =============================================================================
// COMPONENT INTERFACES
// =============================================================================

/**
 * Base interface for all Satori components
 */
export interface ISatoriComponent {
  readonly id: string;
  readonly className?: string;
  readonly theme?: ISatoriTheme;
  readonly disabled?: boolean;
}

/**
 * Layout component configuration
 */
export interface ISatoriLayoutConfig extends ISatoriComponent {
  readonly layout: 'sidebar' | 'topbar' | 'hybrid';
  readonly sidebar?: {
    readonly width: number;
    readonly collapsible: boolean;
    readonly defaultCollapsed: boolean;
  };
  readonly header?: {
    readonly height: number;
    readonly fixed: boolean;
  };
}

// =============================================================================
// TYPE GUARDS
// =============================================================================

/**
 * Type guard to check if an object is a valid SatNavigationItem
 */
export function isSatoriNavigationItem(item: unknown): item is SatNavigationItem {
  return (
    typeof item === 'object' &&
    item !== null &&
    'label' in item &&
    'link' in item &&
    typeof (item as Record<string, unknown>)['label'] === 'string' &&
    typeof (item as Record<string, unknown>)['link'] === 'string'
  );
}

/**
 * Type guard to check if an object is a valid Satori theme
 */
export function isSatoriTheme(theme: unknown): theme is ISatoriTheme {
  return (
    typeof theme === 'object' &&
    theme !== null &&
    'name' in theme &&
    'mode' in theme &&
    typeof (theme as ISatoriTheme).name === 'string' &&
    ['light', 'dark', 'auto'].includes((theme as ISatoriTheme).mode)
  );
}

/**
 * Type guard to check if an object is a valid Satori configuration
 */
export function isSatoriConfig(config: unknown): config is ISatoriConfig {
  return (
    typeof config === 'object' &&
    config !== null &&
    'theme' in config &&
    'navigation' in config &&
    isSatoriTheme((config as ISatoriConfig).theme) &&
    Array.isArray((config as ISatoriConfig).navigation)
  );
}

/**
 * Type guard for extended navigation items
 */
export function isExtendedNavigationItem(item: unknown): item is IExtendedNavigationItem {
  return isSatoriNavigationItem(item);
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Utility type for theme mode selection
 */
export type ThemeMode = ISatoriTheme['mode'];

/**
 * Utility type for navigation item without readonly modifiers
 */
export type MutableNavigationItem = {
  -readonly [K in keyof SatNavigationItem]: SatNavigationItem[K];
};

/**
 * Utility type for creating partial Satori configurations
 */
export type PartialSatoriConfig = Partial<ISatoriConfig> & {
  theme: ISatoriTheme;
};

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Default Satori theme configuration
 */
export const DEFAULT_SATORI_THEME: ISatoriTheme = {
  name: 'default',
  mode: 'light',
} as const;

/**
 * Default Satori features configuration
 */
export const DEFAULT_SATORI_FEATURES: ISatoriFeatures = {
  enableDarkMode: true,
  enableI18n: true,
  enableAccessibility: true,
  enableAnimations: true,
} as const;

/**
 * Available theme modes
 */
export const THEME_MODES = ['light', 'dark', 'auto'] as const;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Creates a new Satori theme with validation
 */
export function createSatoriTheme(
  name: string,
  mode: ThemeMode,
  colors?: Partial<Pick<ISatoriTheme, 'primary' | 'secondary' | 'accent'>>
): ISatoriTheme {
  const theme: ISatoriTheme = {
    name,
    mode,
    ...colors,
  };

  if (!isSatoriTheme(theme)) {
    throw new Error('Invalid Satori theme configuration');
  }

  return theme;
}

/**
 * Safely converts SatNavigationItem to PlatformNavSatNavigationItem
 */
export function convertNavigationItem(
  item: SatNavigationItem
): PlatformNavSatNavigationItem {
  if (!isSatoriNavigationItem(item)) {
    throw new Error('Invalid navigation item provided');
  }

  // This would typically use the NavigationConverterPipe in a real implementation
  return item as unknown as PlatformNavSatNavigationItem;
}

/**
 * Validates and sanitizes navigation items array
 */
export function validateNavigationItems(
  items: unknown[]
): SatNavigationItem[] {
  return items.filter(isSatoriNavigationItem);
}

/**
 * Creates a complete Satori configuration with defaults
 */
export function createSatoriConfig(
  config: PartialSatoriConfig
): ISatoriConfig {
  const fullConfig: ISatoriConfig = {
    theme: config.theme,
    navigation: config.navigation || [],
    features: { ...DEFAULT_SATORI_FEATURES, ...config.features },
    ...(config.i18n && { i18n: config.i18n }),
  };

  if (!isSatoriConfig(fullConfig)) {
    throw new Error('Invalid Satori configuration');
  }

  return fullConfig;
}