import type { TourStep } from "../types/tour";

/**
 * Default onboarding steps for general (non-SaaS) and SaaS tail (after tenant step).
 * Targets map to the current console sidebar / page chrome (`data-tour` attrs).
 */
export const GENERAL_TOUR_STEPS: TourStep[] = [
  {
    id: "create-model",
    title: "Create Your First Model",
    description:
      'Open Models in the sidebar, then click Add Model to define your first data structure.',
    // Models nav is always visible; Add Model appears once that section is open.
    target: '[data-tour="model-tab"], [data-tour="add-model-button"]',
    placement: "right",
    nextButtonProps: {
      children: "Add Model",
    },
    skipButtonProps: {
      children: "Skip",
    },
  },
  {
    id: "add-fields",
    title: "Add Fields to Your Model",
    description:
      "Add fields on the model page to define what data it can store. Start with a text field.",
    target: '[data-tour="add-fields-button"]',
    placement: "bottom",
    nextButtonProps: {
      children: "Add Fields",
    },
    skipButtonProps: {
      children: "Skip",
    },
  },
  {
    id: "add-content",
    title: "Create Your First Content Entry",
    description:
      'Open Content, pick a collection, then click Create New to add your first entry.',
    target: '[data-tour="create-content-button"], [data-tour="content-tab"]',
    placement: "right",
    nextButtonProps: {
      children: "Add Content",
    },
    skipButtonProps: {
      children: "Skip",
    },
  },
  {
    id: "run-query",
    title: "Test Your GraphQL API",
    description:
      "Open GraphQL API, pick a query in the explorer, then run it to verify your GraphQL endpoint.",
    target:
      '[data-tour="api-tab"], button[title*="Execute query"], button[aria-label*="Execute query"]',
    placement: "right",
    nextButtonProps: {
      children: "Go to GraphQL API",
    },
    skipButtonProps: {
      children: "Skip",
    },
  },
];
