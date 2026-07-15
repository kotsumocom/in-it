/**
 * @module components
 * UI and interactive components built with hono/jsx.
 * All components use the `ii-` CSS class prefix.
 *
 * @example
 * ```tsx
 * import { Button, Card, Switch, ThemeToggle } from "@kotsumo/in-it/components";
 *
 * function App() {
 *   return (
 *     <Card>
 *       <Button variant="filled">Click me</Button>
 *       <ThemeToggle />
 *     </Card>
 *   );
 * }
 * ```
 */

// UI
export { Badge, Card, Button, StatCard, DataTable, Input, Avatar, Chip, Skeleton, EmptyState } from "./ui/mod.tsx";
export type { BadgeProps, CardProps, ButtonProps, StatCardProps, DataTableColumn, DataTableProps, InputProps, AvatarProps, ChipProps, SkeletonProps, EmptyStateProps } from "./ui/mod.tsx";

export { Textarea, Alert, Progress, ProgressCircular, Breadcrumb, Divider, Kbd } from "./ui/extras.tsx";
export type { TextareaProps, AlertProps, ProgressProps, ProgressCircularProps, BreadcrumbItem, BreadcrumbProps, DividerProps, KbdProps } from "./ui/extras.tsx";

export { Aside } from "./ui/Aside.tsx";
export type { AsideProps, AsideVariant } from "./ui/Aside.tsx";

// Interactive
export { Switch } from "./interactive/Switch.tsx";
export type { SwitchProps } from "./interactive/Switch.tsx";
export { Dialog } from "./interactive/Dialog.tsx";
export type { DialogProps } from "./interactive/Dialog.tsx";
export { Tabs } from "./interactive/Tabs.tsx";
export type { TabsProps, TabItem } from "./interactive/Tabs.tsx";
export { Menu } from "./interactive/Menu.tsx";
export type { MenuProps, MenuItemDef } from "./interactive/Menu.tsx";
export { ToastContainer, toast } from "./interactive/Toast.tsx";
export type { ToastContainerProps, ToastItem } from "./interactive/Toast.tsx";
export { Select } from "./interactive/Select.tsx";
export type { SelectProps, SelectOption } from "./interactive/Select.tsx";
export { Accordion } from "./interactive/Accordion.tsx";
export type { AccordionProps, AccordionItemDef } from "./interactive/Accordion.tsx";
export { Popover } from "./interactive/Popover.tsx";
export type { PopoverProps } from "./interactive/Popover.tsx";
export { ThemeToggle } from "./interactive/ThemeToggle.tsx";
export type { ThemeToggleProps, Theme } from "./interactive/ThemeToggle.tsx";
export { Combobox } from "./interactive/Combobox.tsx";
export type { ComboboxProps } from "./interactive/Combobox.tsx";
export { Checkbox } from "./interactive/Checkbox.tsx";
export type { CheckboxProps } from "./interactive/Checkbox.tsx";
export { RadioGroup } from "./interactive/RadioGroup.tsx";
export type { RadioGroupProps, RadioOption } from "./interactive/RadioGroup.tsx";
export { Drawer } from "./interactive/Drawer.tsx";
export type { DrawerProps } from "./interactive/Drawer.tsx";
export { Slider } from "./interactive/Slider.tsx";
export type { SliderProps } from "./interactive/Slider.tsx";
export { Pagination } from "./interactive/Pagination.tsx";
export type { PaginationProps } from "./interactive/Pagination.tsx";
export { Steps } from "./interactive/Steps.tsx";
export type { StepsProps, StepItem } from "./interactive/Steps.tsx";
export { Tooltip } from "./interactive/Tooltip.tsx";
export type { TooltipProps } from "./interactive/Tooltip.tsx";
export { AuthForm } from "./interactive/AuthForm.tsx";
export type { AuthFormProps, AuthFormData, AuthMode, AuthProvider } from "./interactive/AuthForm.tsx";
export { UserMenu } from "./interactive/UserMenu.tsx";
export type { UserMenuProps, UserMenuItem } from "./interactive/UserMenu.tsx";
export { FileUpload } from "./interactive/FileUpload.tsx";
export type { FileUploadProps, FileUploadError } from "./interactive/FileUpload.tsx";

// UI
export { PricingCard } from "./ui/PricingCard.tsx";
export type { PricingCardProps } from "./ui/PricingCard.tsx";
export { SettingsSection } from "./ui/SettingsSection.tsx";
export type { SettingsSectionProps } from "./ui/SettingsSection.tsx";
export { ErrorPage } from "./ui/ErrorPage.tsx";
export type { ErrorPageProps } from "./ui/ErrorPage.tsx";
export { BlogCard, BlogGrid, BlogArticle } from "./ui/Blog.tsx";
export type { BlogCardProps, BlogGridProps, BlogArticleProps, BlogPost } from "./ui/Blog.tsx";

// Layout
export { AdminShell } from "./admin/AdminShell.tsx";
export type { AdminShellProps, NavItem } from "./admin/AdminShell.tsx";
export { DocsShell } from "./layout/DocsShell.tsx";
export type { DocsShellProps, DocsSidebarGroup, DocsSidebarItem, DocsTocItem } from "./layout/DocsShell.tsx";
export { CodePreview } from "./docs/CodePreview.tsx";
export type { CodePreviewProps } from "./docs/CodePreview.tsx";
export { LandingHeader, LandingHero, LandingFeatures, LandingSection, LandingFooter } from "./layout/Landing.tsx";
export type { LandingHeaderProps, LandingHeroProps, FeatureCard, LandingFeaturesProps, LandingSectionProps, LandingFooterProps } from "./layout/Landing.tsx";

// Charts
export { BarChart } from "./charts/BarChart.tsx";
export type { BarChartProps } from "./charts/BarChart.tsx";
export { LineChart } from "./charts/LineChart.tsx";
export type { LineChartProps } from "./charts/LineChart.tsx";
export { DonutChart } from "./charts/DonutChart.tsx";
export type { DonutChartProps, DonutSegment } from "./charts/DonutChart.tsx";
export { SparkLine } from "./charts/SparkLine.tsx";
export type { SparkLineProps } from "./charts/SparkLine.tsx";
