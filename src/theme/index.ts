import type { ThemeConfig } from 'antd';

// Centralized theme configuration based on the database view design
// This theme ensures consistent look and feel across open-core and pro versions
export const apitoTheme: ThemeConfig = {
    token: {
        // Primary color - clean, professional blue
        colorPrimary: '#1c1e20',

        // Typography
        fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif`,
        fontSize: 14,
        fontSizeHeading1: 28,
        fontSizeHeading2: 22,
        fontSizeHeading3: 18,
        fontSizeHeading4: 16,
        fontSizeHeading5: 14,

        // Border radius - minimal for clean look
        borderRadius: 6,
        borderRadiusXS: 2,
        borderRadiusSM: 4,
        borderRadiusLG: 8,

        // Colors - updated to match design
        colorBgContainer: '#ffffff',          // Main surfaces (content area)
        colorBgElevated: '#ffffff',
        colorBgLayout: '#ffffff',             // Page background should be all white
        colorBgSpotlight: '#fafafa',          // Sidebar background

        // Border colors - subtle and consistent
        colorBorder: '#d9d9d9',
        colorBorderSecondary: '#f0f0f0',

        // Text colors
        colorText: '#262626',
        colorTextHeading: '#000000',
        colorTextSecondary: '#8c8c8c',
        colorTextTertiary: '#bfbfbf',
        colorTextQuaternary: '#d9d9d9',

        // Spacing - consistent with database view
        padding: 16,
        paddingSM: 12,
        paddingXS: 8,
        paddingLG: 24,
        paddingXL: 32,

        margin: 16,
        marginSM: 12,
        marginXS: 8,
        marginLG: 24,
        marginXL: 32,

        // Control heights
        controlHeight: 32,
        controlHeightSM: 24,
        controlHeightLG: 40,

        // Line heights
        lineHeight: 1.5714,
        lineHeightHeading1: 1.2105,
        lineHeightHeading2: 1.2727,
        lineHeightHeading3: 1.3333,
        lineHeightHeading4: 1.4,
        lineHeightHeading5: 1.5714,

        // Shadows - subtle for depth
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
        boxShadowSecondary: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',

        // Motion
        motionDurationSlow: '0.3s',
        motionDurationMid: '0.2s',
        motionDurationFast: '0.1s',
    },

    components: {
        // Table styling to match database view
        Table: {
            headerBg: '#fafafa',
            headerColor: '#262626',
            headerSortActiveBg: '#f0f0f0',
            headerSortHoverBg: '#f5f5f5',
            bodySortBg: '#fafafa',
            rowHoverBg: '#f5f5f5',
            borderColor: '#f0f0f0',
            fontSize: 14,
            cellPaddingBlock: 12,
            cellPaddingInline: 16,
        },

        // Button styling
        Button: {
            borderRadius: 6,
            fontWeight: 400,
            primaryShadow: 'none',
            defaultShadow: 'none',
        },

        // Card styling for clean cards
        Card: {
            borderRadiusLG: 8,
            headerBg: 'transparent',
            headerHeight: 56,
            bodyPadding: 24,
            paddingLG: 24,
        },

        // Layout styling
        Layout: {
            siderBg: '#fafafa',               // Sidebar background per design
            triggerBg: '#ffffff',
            triggerColor: '#262626',
            headerBg: '#ffffff',
            headerHeight: 64,
            headerPadding: '0 24px',
            footerBg: '#ffffff',
            bodyBg: '#ffffff',
        },

        // Menu styling for sidebar
        Menu: {
            itemBg: 'transparent',
            itemSelectedBg: '#e6f7ff',
            itemSelectedColor: '#1890ff',
            itemHoverBg: '#f5f5f5',
            itemHoverColor: '#262626',
            itemActiveBg: '#f0f0f0',
            subMenuItemBg: 'transparent',
            fontSize: 14,
            itemHeight: 40,
            itemMarginBlock: 4,
            itemMarginInline: 0,
            itemPaddingInline: 16,
        },

        // Typography styling
        Typography: {
            titleMarginBottom: '0.5em',
            titleMarginTop: '1.2em',
        },

        // Tag styling
        Tag: {
            borderRadiusSM: 4,
            fontSizeSM: 12,
            lineHeightSM: 1.5,
        },

        // Input styling
        Input: {
            borderRadius: 6,
            paddingBlock: 8,
            paddingInline: 12,
        },

        // Select styling
        Select: {
            borderRadius: 6,
        },

        // Modal styling
        Modal: {
            borderRadiusLG: 8,
            headerBg: '#fafafa',
            contentBg: '#ffffff',
            footerBg: 'transparent',
        },

        // Drawer styling
        Drawer: {
            borderRadiusLG: 0,
        },

        // Pagination styling
        Pagination: {
            itemBg: '#ffffff',
            itemSize: 32,
            borderRadius: 6,
        },
    },
};

export default apitoTheme;
