import type { ThemeConfig } from "antd";
import { theme } from "antd";
import { apitoTokens } from "./tokens";

/** Shared layout surfaces — keep ConsoleLayout in sync via this constant. */
export const apitoSidebarBg = apitoTokens.palette.bgLayout;

// Centralized monotone theme for open-core + pro (single ConfigProvider source).
export const apitoTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: apitoTokens.palette.primary,
    // Keep info accent neutral — do NOT reuse primary or Alert info fills go dark.
    colorInfo: apitoTokens.palette.info,
    colorSuccess: apitoTokens.palette.success,
    colorWarning: apitoTokens.palette.warning,
    colorError: apitoTokens.palette.error,

    fontFamily: apitoTokens.typography.fontFamily,
    fontSize: apitoTokens.typography.fontSize,
    fontSizeHeading1: apitoTokens.typography.headings.h1,
    fontSizeHeading2: apitoTokens.typography.headings.h2,
    fontSizeHeading3: apitoTokens.typography.headings.h3,
    fontSizeHeading4: apitoTokens.typography.headings.h4,
    fontSizeHeading5: apitoTokens.typography.headings.h5,

    borderRadius: apitoTokens.radii.md,
    borderRadiusXS: apitoTokens.radii.xs,
    borderRadiusSM: apitoTokens.radii.sm,
    borderRadiusLG: apitoTokens.radii.lg,

    colorBgContainer: apitoTokens.palette.surface,
    colorBgElevated: apitoTokens.palette.surface,
    colorBgLayout: apitoTokens.palette.bgLayout,
    // Ant Design uses this for Tooltip/Popover spotlight — must stay dark for readable text.
    colorBgSpotlight: apitoTokens.palette.primary,
    colorTextLightSolid: apitoTokens.palette.surface,

    colorBorder: apitoTokens.palette.borderMuted,
    colorBorderSecondary: apitoTokens.palette.border,

    colorText: apitoTokens.palette.text,
    colorTextHeading: apitoTokens.palette.textHeading,
    colorTextSecondary: apitoTokens.palette.textSecondary,

    colorFill: apitoTokens.palette.surfaceMuted,
    colorFillSecondary: apitoTokens.palette.bgLayout,
    colorFillTertiary: apitoTokens.palette.surfaceMuted,

    padding: apitoTokens.spacing.md,
    paddingSM: apitoTokens.spacing.sm,
    paddingXS: apitoTokens.spacing.xs,
    paddingLG: apitoTokens.spacing.lg,
    paddingXL: apitoTokens.spacing.xl,

    margin: apitoTokens.spacing.md,
    marginSM: apitoTokens.spacing.sm,
    marginXS: apitoTokens.spacing.xs,
    marginLG: apitoTokens.spacing.lg,
    marginXL: apitoTokens.spacing.xl,

    controlHeight: apitoTokens.controlHeights.md,
    controlHeightSM: apitoTokens.controlHeights.sm,
    controlHeightLG: apitoTokens.controlHeights.lg,

    lineHeight: apitoTokens.typography.lineHeights.body,
    lineHeightHeading1: apitoTokens.typography.lineHeights.h1,
    lineHeightHeading2: apitoTokens.typography.lineHeights.h2,
    lineHeightHeading3: apitoTokens.typography.lineHeights.h3,
    lineHeightHeading4: apitoTokens.typography.lineHeights.h4,
    lineHeightHeading5: apitoTokens.typography.lineHeights.h5,

    boxShadow: "none",
    boxShadowSecondary: "none",
  },

  components: {
    Tooltip: {
      colorBgSpotlight: apitoTokens.palette.primary,
      colorTextLightSolid: apitoTokens.palette.surface,
    },
    Popover: {
      colorBgElevated: apitoTokens.palette.surface,
    },
    Table: {
      headerBg: apitoTokens.palette.surfaceMuted,
      headerColor: apitoTokens.palette.textSecondary,
      headerSortActiveBg: apitoTokens.palette.surfaceMuted,
      headerSortHoverBg: apitoTokens.palette.surfaceMuted,
      bodySortBg: apitoTokens.palette.bgLayout,
      rowHoverBg: apitoTokens.palette.surfaceMuted,
      borderColor: apitoTokens.palette.borderMuted,
      fontSize: apitoTokens.typography.fontSize,
      cellPaddingBlock: 10,
      cellPaddingInline: 12,
    },
    Button: {
      borderRadius: apitoTokens.radii.sm,
      fontWeight: 500,
      primaryShadow: "none",
      defaultShadow: "none",
      primaryColor: apitoTokens.palette.surface,
      colorPrimaryHover: apitoTokens.palette.text,
      colorPrimaryActive: apitoTokens.palette.primary,
    },
    Tabs: {
      itemColor: apitoTokens.palette.textMuted,
      itemSelectedColor: apitoTokens.palette.primary,
      itemHoverColor: apitoTokens.palette.text,
      inkBarColor: apitoTokens.palette.primary,
      titleFontSize: 13,
    },
    Card: {
      borderRadiusLG: apitoTokens.radii.lg,
      headerBg: "transparent",
      headerHeight: 44,
      bodyPadding: 16,
      paddingLG: 16,
      boxShadow: "none",
    },
    Layout: {
      siderBg: apitoTokens.palette.surface,
      triggerBg: apitoTokens.palette.surface,
      triggerColor: apitoTokens.palette.text,
      headerBg: apitoTokens.palette.surface,
      headerHeight: apitoTokens.layout.headerHeight,
      headerPadding: `0 ${apitoTokens.spacing.lg}px`,
      footerBg: apitoTokens.palette.surface,
      bodyBg: apitoTokens.palette.bgLayout,
    },
    Menu: {
      itemBg: "transparent",
      itemSelectedBg: apitoTokens.palette.primary,
      itemSelectedColor: apitoTokens.palette.surface,
      itemHoverBg: apitoTokens.palette.surfaceMuted,
      itemHoverColor: apitoTokens.palette.text,
      itemActiveBg: apitoTokens.palette.primary,
      subMenuItemBg: "transparent",
      fontSize: 13,
      itemHeight: 36,
      itemMarginBlock: 2,
      itemMarginInline: 0,
      itemPaddingInline: 16,
    },
    Typography: {
      titleMarginBottom: "0.5em",
      titleMarginTop: "1.2em",
    },
    Tag: {
      borderRadiusSM: apitoTokens.radii.sm,
      fontSizeSM: 12,
      lineHeightSM: 1.5,
    },
    Input: {
      borderRadius: apitoTokens.radii.md,
      // Keep paddingBlock in lockstep with controlHeight (32). Extra block
      // padding inflates Input.Search while the addon button stays 32px.
      paddingBlock: 5,
      paddingInline: 11,
    },
    Select: {
      borderRadius: apitoTokens.radii.md,
    },
    Modal: {
      borderRadiusLG: apitoTokens.radii.lg,
      headerBg: apitoTokens.palette.surfaceMuted,
      contentBg: apitoTokens.palette.surface,
      footerBg: "transparent",
    },
    Pagination: {
      itemBg: apitoTokens.palette.surface,
      itemSize: 32,
      borderRadius: apitoTokens.radii.md,
    },
    Alert: {
      borderRadiusLG: apitoTokens.radii.lg,
      defaultPadding: "12px 16px",
      withDescriptionPadding: "16px 16px",
      colorInfoBg: apitoTokens.palette.surfaceMuted,
      colorInfoBorder: apitoTokens.palette.borderMuted,
    },
    Segmented: {
      trackBg: apitoTokens.palette.surfaceMuted,
      itemColor: apitoTokens.palette.text,
      itemHoverBg: apitoTokens.palette.surfaceMuted,
      itemHoverColor: apitoTokens.palette.text,
      itemSelectedBg: apitoTokens.palette.primary,
      itemSelectedColor: apitoTokens.palette.surface,
      itemActiveBg: apitoTokens.palette.surfaceMuted,
    },
    Breadcrumb: {
      linkColor: apitoTokens.palette.textSecondary,
      linkHoverColor: apitoTokens.palette.text,
      separatorColor: apitoTokens.palette.borderMuted,
    },
    Progress: {
      defaultColor: apitoTokens.palette.primary,
    },
  },
};

export default apitoTheme;
