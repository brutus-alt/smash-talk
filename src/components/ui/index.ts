/**
 * Design system — exports centralisés.
 *
 * Règle de co-location (Audit v2 §11.1) :
 * - Composant utilisé par 2+ écrans → vit ici.
 * - Composant utilisé par 1 seul écran → vit à côté de cet écran.
 * - Composant utilisé par 0 écran → n'existe pas.
 */

// Layout
export { Screen } from "./screen";
export { ModalHeader } from "./modal-header";
export { Divider } from "./divider";

// Animations
export { FadeInUp, FadeIn, ScaleBounce } from "./animated-view";

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
