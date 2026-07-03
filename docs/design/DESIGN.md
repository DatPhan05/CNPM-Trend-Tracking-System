---
version: 1.0.0
name: TrendTracking Design System
description: A premium, modern, and dark-mode first design system for the Scientific Journal Publication Trend Tracking System.

colors:
  primary: "#3b82f6"
  primaryHover: "#2563eb"
  secondary: "#1f2937"
  accent: "#f59e0b"
  success: "#10b981"
  danger: "#ef4444"
  background: "#0b0f19"
  foreground: "#f3f4f6"
  muted: "#9ca3af"
  border: "#374151"

typography:
  fontFamily: "Inter, system-ui, sans-serif"
  fontSize:
    xs: "12px"
    sm: "14px"
    base: "16px"
    lg: "18px"
    xl: "20px"
    xxl: "30px"
    heading: "36px"
  fontWeight:
    normal: "400"
    medium: "500"
    semibold: "600"
    bold: "700"

spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"

rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
---

# Trend-Tracking Design Guidelines

This document outlines the core layout structures, design tokens, and components governing the user interfaces of the Trend-Tracking platform.

## Design Philosophy
The system is built on four core visual pillars:
1. **Glassmorphism**: Layered cards featuring thin borders, backdrops blurs (`backdrop-filter: blur`), and subtle shadows to create high-tech scientific interfaces.
2. **Dynamic States**: Subtle hover micro-animations (e.g. `scale-[1.02]`) and active scaling transitions.
3. **Contrast & Hierarchy**: Utilizing vivid colors (`#3b82f6`, `#10b981`, `#f59e0b`) on dark backgrounds (`#0b0f19`) to keep metrics readable and visually striking.
4. **Consistency**: UI components must strictly adhere to the token values defined in the front matter of this file.

## Typography
The default font is **Inter**. Standard text weights are restricted to Normal, Medium (for subheadings), Semibold (for buttons/headers), and Bold (titles). Avoid italicized typography except in blockquotes or captions.

## Components

### 1. Interactive Cards
All dashboard items must reside in interactive cards.
- **Do**: Apply a hover border color change (`hover:border-primary/40`) to indicate interactivity.
- **Don't**: Use sharp `0px` border radiuses or solid dark gray backgrounds without transparency.

### 2. Primary Buttons
Buttons must feature rounded corners (`12px`) and smooth background transition scales.
- **Success State**: Primary brand actions use `#3b82f6` transitioning to `#2563eb`.
- **Destructive State**: Account deletion or bookmark removals use `#ef4444`.
