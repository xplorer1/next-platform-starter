# Accessibility & Mobile Responsiveness Guide

This document outlines the accessibility and mobile responsiveness features implemented in the JobPlat Job Board application.

## WCAG 2.1 AA Compliance

The application has been designed and implemented to meet WCAG 2.1 AA accessibility standards.

### Key Accessibility Features

#### 1. Keyboard Navigation
- **Skip Links**: Allow users to skip to main content, navigation, and footer
- **Focus Management**: Proper focus trapping in modals and menus
- **Tab Order**: Logical tab order throughout the application
- **Keyboard Shortcuts**: All interactive elements accessible via keyboard

#### 2. Screen Reader Support
- **Semantic HTML**: Proper use of headings, landmarks, and semantic elements
- **ARIA Labels**: Comprehensive ARIA labeling for complex components
- **Live Regions**: Dynamic content changes announced to screen readers
- **Alternative Text**: All images have appropriate alt text

#### 3. Visual Accessibility
- **Color Contrast**: All text meets WCAG AA contrast requirements (4.5:1 for normal text, 3:1 for large text)
- **High Contrast Mode**: Support for users who prefer high contrast
- **Focus Indicators**: Clear visual focus indicators for all interactive elements
- **Text Scaling**: Content remains usable at 200% zoom

#### 4. Motor Accessibility
- **Touch Targets**: Minimum 44px × 44px touch targets on mobile
- **Reduced Motion**: Respects user's reduced motion preferences
- **Timeout Extensions**: No automatic timeouts that could affect users

## Mobile Responsiveness

### Breakpoint Strategy
- **Mobile First**: Designed mobile-first with progressive enhancement
- **Breakpoints**: 
  - `xs`: 475px (extra small phones)
  - `sm`: 640px (small phones)
  - `md`: 768px (tablets)
  - `lg`: 1024px (small desktops)
  - `xl`: 1280px (large desktops)
  - `2xl`: 1536px (extra large screens)

### Mobile Optimizations

#### 1. Touch-Friendly Interface
- **Touch Targets**: All interactive elements meet minimum size requirements
- **Touch Gestures**: Swipe and tap gestures where appropriate
- **Hover States**: Proper handling of hover states on touch devices
- **Spacing**: Adequate spacing between touch targets

#### 2. Performance Optimizations
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Route-based code splitting for faster loading
- **Lazy Loading**: Images and components loaded on demand
- **Caching**: Efficient caching strategies for better performance

#### 3. Layout Adaptations
- **Flexible Grids**: CSS Grid and Flexbox for responsive layouts
- **Collapsible Navigation**: Mobile-friendly navigation menu
- **Stacked Content**: Content stacks vertically on smaller screens
- **Readable Typography**: Font sizes optimized for mobile reading

## Implementation Details

### Accessibility Utilities

#### `src/lib/accessibility.ts`
Comprehensive accessibility utility library providing:
- Focus management functions
- Screen reader announcement utilities
- Keyboard navigation helpers
- Color contrast utilities
- Touch and mobile utilities
- Form accessibility helpers

#### `src/lib/accessibility-test.ts`
Development testing utilities for:
- Automated accessibility testing
- WCAG compliance checking
- Issue reporting and suggestions
- Performance monitoring

### Responsive Hooks

#### `src/hooks/useResponsive.ts`
Custom hooks for responsive behavior:
- `useResponsive()`: Current breakpoint and device type
- `useMediaQuery()`: Custom media query matching
- `useTouchDevice()`: Touch device detection
- `useReducedMotion()`: Motion preference detection
- `useViewport()`: Viewport dimensions with debouncing

### Mobile-Optimized Components

#### `src/components/layout/MobileOptimizedLayout.tsx`
Layout components optimized for mobile:
- `MobileOptimizedLayout`: Main layout wrapper
- `MobileContainer`: Responsive container
- `MobileGrid`: Responsive grid system
- `MobileStack`: Vertical layout component
- `MobileCard`: Mobile-friendly card component

### Accessibility Components

#### `src/components/accessibility/SkipLink.tsx`
- Skip links for keyboard navigation
- Smooth scrolling to target sections
- Focus management

#### `src/components/accessibility/LiveRegion.tsx`
- Screen reader announcements
- Dynamic content updates
- Global announcement system

## Testing

### Manual Testing Checklist

#### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Skip links work correctly
- [ ] Focus is visible and logical
- [ ] Escape key closes modals/menus
- [ ] Arrow keys work in menus/lists

#### Screen Reader Testing
- [ ] Test with NVDA (Windows)
- [ ] Test with JAWS (Windows)
- [ ] Test with VoiceOver (macOS/iOS)
- [ ] Test with TalkBack (Android)

#### Mobile Testing
- [ ] Test on various device sizes
- [ ] Test touch interactions
- [ ] Test orientation changes
- [ ] Test with different zoom levels
- [ ] Test with assistive technologies

#### Visual Testing
- [ ] Test with high contrast mode
- [ ] Test color contrast ratios
- [ ] Test with reduced motion
- [ ] Test at 200% zoom
- [ ] Test with different font sizes

### Automated Testing

#### Development Testing
```javascript
import { runAccessibilityTest } from '@/lib/accessibility-test'

// Run in development
runAccessibilityTest()
```

#### Continuous Integration
- Lighthouse accessibility audits
- axe-core automated testing
- Color contrast validation
- Performance monitoring

## Browser Support

### Desktop Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Mobile Browsers
- Chrome Mobile 90+
- Safari Mobile 14+
- Firefox Mobile 88+
- Samsung Internet 14+

### Assistive Technologies
- NVDA 2021.1+
- JAWS 2021+
- VoiceOver (macOS 11+, iOS 14+)
- TalkBack (Android 10+)

## Performance Metrics

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Accessibility Performance
- **Lighthouse Accessibility Score**: 95+
- **axe-core Violations**: 0 critical issues
- **Color Contrast**: 100% WCAG AA compliance

## Best Practices

### Development Guidelines

1. **Mobile First**: Always design and develop for mobile first
2. **Progressive Enhancement**: Add features for larger screens
3. **Semantic HTML**: Use proper HTML elements for their intended purpose
4. **ARIA Sparingly**: Only use ARIA when semantic HTML isn't sufficient
5. **Test Early**: Test accessibility and mobile responsiveness throughout development

### Content Guidelines

1. **Clear Language**: Use simple, clear language
2. **Descriptive Links**: Link text should describe the destination
3. **Meaningful Headings**: Use headings to structure content logically
4. **Alternative Text**: Provide meaningful alt text for images
5. **Error Messages**: Provide clear, actionable error messages

### Design Guidelines

1. **Color**: Don't rely on color alone to convey information
2. **Contrast**: Ensure sufficient color contrast
3. **Typography**: Use readable fonts and appropriate sizes
4. **Spacing**: Provide adequate spacing between elements
5. **Focus**: Design clear focus indicators

## Resources

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM Resources](https://webaim.org/resources/)

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WAVE](https://wave.webaim.org/)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)

### Screen Readers
- [NVDA](https://www.nvaccess.org/download/) (Free)
- [JAWS](https://www.freedomscientific.com/products/software/jaws/) (Commercial)
- VoiceOver (Built into macOS/iOS)
- TalkBack (Built into Android)

## Contributing

When contributing to this project, please:

1. Follow the accessibility guidelines outlined in this document
2. Test your changes with keyboard navigation
3. Test your changes with a screen reader
4. Test your changes on mobile devices
5. Run the automated accessibility tests
6. Update this documentation if you add new accessibility features

## Support

For accessibility-related questions or issues, please:

1. Check this documentation first
2. Run the automated accessibility tests
3. Test with assistive technologies
4. Create an issue with detailed information about the accessibility problem
5. Include steps to reproduce and expected behavior