export interface ProjectTemplate {
  id: string;
  label: string;
  title: string;
  description: string;
  models: string[];
  relations: string[];
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: "crm",
    label: "CRM",
    title: "Sales CRM",
    description:
      "Full-featured CRM for sales teams: companies, contacts, deals, activities, tasks, products, and quotes. Track pipeline stages, log calls and meetings, and manage follow-ups.",
    models: [
      "Company",
      "Contact",
      "Deal",
      "Activity",
      "Task",
      "Product",
      "Quote",
      "User",
    ],
    relations: [
      "Contact belongs to Company",
      "Deal belongs to Company and Contact",
      "Deal has many Tasks and Activities",
      "Quote belongs to Deal and Contact",
      "Quote has many Products (line items)",
      "Activity belongs to Contact or Deal",
      "Task belongs to Deal and assigned User",
    ],
  },
  {
    id: "blog",
    label: "Content Blog",
    title: "Content Blog",
    description:
      "Publishing platform with posts, authors, categories, tags, comments with threading, and media. Supports drafts, scheduling, and SEO metadata.",
    models: [
      "Post",
      "Author",
      "Category",
      "Tag",
      "Comment",
      "Media",
      "Page",
    ],
    relations: [
      "Post belongs to Author",
      "Post has many Categories and Tags",
      "Post has many Comments",
      "Comment belongs to Post and optional parent Comment",
      "Media belongs to Post or Page",
      "Page belongs to Author",
    ],
  },
  {
    id: "fitness",
    label: "Fitness App",
    title: "Fitness Tracker",
    description:
      "Track workouts, exercises, sets, body measurements, and goals. Users log sessions, monitor progress over time, and follow workout programs.",
    models: [
      "User",
      "Workout",
      "Exercise",
      "ExerciseSet",
      "BodyMeasurement",
      "Goal",
      "WorkoutProgram",
    ],
    relations: [
      "Workout belongs to User",
      "Workout has many ExerciseSets",
      "ExerciseSet belongs to Exercise and Workout",
      "BodyMeasurement belongs to User",
      "Goal belongs to User",
      "WorkoutProgram has many Exercises",
    ],
  },
  {
    id: "movie",
    label: "Movie Database",
    title: "Movie & TV Database",
    description:
      "Catalog films and shows with cast, crew, studios, genres, and user reviews. Track watchlists, ratings, and recommendations.",
    models: [
      "Movie",
      "Actor",
      "Director",
      "Genre",
      "Studio",
      "Review",
      "Watchlist",
      "User",
    ],
    relations: [
      "Movie has many Actors and Directors",
      "Movie has many Genres",
      "Movie belongs to Studio",
      "Review belongs to Movie and User",
      "Watchlist belongs to User",
      "Watchlist has many Movies",
    ],
  },
  {
    id: "ecommerce",
    label: "E-commerce",
    title: "E-commerce Store",
    description:
      "Complete online store: products, variants, categories, orders, customers, addresses, carts, and reviews. Handles inventory and order fulfillment.",
    models: [
      "Product",
      "ProductVariant",
      "Category",
      "Order",
      "OrderItem",
      "Customer",
      "Address",
      "Cart",
      "Review",
    ],
    relations: [
      "Product belongs to Category",
      "Product has many Variants",
      "Order belongs to Customer",
      "Order has many OrderItems",
      "OrderItem belongs to Product and Order",
      "Customer has many Addresses",
      "Cart belongs to Customer",
      "Cart has many OrderItems",
      "Review belongs to Product and Customer",
    ],
  },
  {
    id: "task",
    label: "Task Management",
    title: "Project & Task Manager",
    description:
      "Kanban-style project management: projects, tasks, subtasks, assignees, labels, comments, and attachments. Supports milestones and time tracking.",
    models: [
      "Project",
      "Task",
      "Subtask",
      "User",
      "Label",
      "Comment",
      "Attachment",
      "Milestone",
    ],
    relations: [
      "Task belongs to Project",
      "Task belongs to User (assignee)",
      "Task has many Subtasks and Labels",
      "Subtask belongs to Task",
      "Comment belongs to Task or Project",
      "Attachment belongs to Task",
      "Milestone belongs to Project",
    ],
  },
];

export function findProjectTemplate(
  idOrLabel: string | null | undefined,
): ProjectTemplate | undefined {
  const needle = idOrLabel?.trim();
  if (!needle) return undefined;
  return PROJECT_TEMPLATES.find(
    (template) =>
      template.id === needle ||
      template.title === needle ||
      template.label === needle,
  );
}
