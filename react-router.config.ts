import type { Config } from '@react-router/dev/config';
import { hydrogenPreset } from '@shopify/hydrogen/react-router-preset';

// The official Hydrogen preset supplies the React Router settings Oxygen needs.
export default {
  presets: [hydrogenPreset()],
} satisfies Config;
