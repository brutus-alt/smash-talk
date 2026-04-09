/**
 * Design system — exports centralises.
 *
 * Regle de co-location (Audit v2 §11.1) :
 * - Composant utilise par 2+ ecrans -> vit ici.
 * - Composant utilise par 1 seul ecran -> vit a cote de cet ecran.
 * - Composant utilise par 0 ecran -> n'existe pas.
 */

// Layout
export { Screen } from "./screen";
export { ModalHeader } from "./modal-header";
export { Divider } from "./divider";

// Animations
export { FadeInUp, FadeIn, ScaleBounce } from "./animated-view";

// Branding
export { Logo } from "./logo";
export { MeshGradient } from "./mesh-gradient";

// Actions
export { Button } from "./button";
export { FAB } from "./fab";

// Data entry
export { Input } from "./input";
export { Stepper } from "./stepper";
export { SegmentedControl } from "./segmented-control";

// Display
export { Card } from "./card";
export { Avatar } from "./avatar";
export { Pill } from "./pill";
export { BadgeIcon } from "./badge-icon";
export { StatRow } from "./stat-row";
export { SectionHeader } from "./section-header";
export { EmptyState } from "./empty-state";

// Loading
export { Skeleton, SkeletonRankingRow, SkeletonMatchCard } from "./skeleton";
