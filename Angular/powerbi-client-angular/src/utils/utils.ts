// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { EventHandler } from '../components/powerbi-embed/powerbi-embed.component';

/**
 * Get JSON string representation of the given map.
 *
 * @param map Map of event and corresponding handler method
 *
 */
export const stringifyMap = (map: Map<string, EventHandler | null> | undefined): string => {
  // Return empty string for empty/null map
  if (!map) {
    return '';
  }

  // Get entries of map as array
  const mapEntries = Array.from(map);

  // Return JSON string
  return JSON.stringify(
    mapEntries.map((mapEntry) =>
      // Convert event handler method to a string containing its source code for comparison
      [mapEntry[0], mapEntry[1] ? mapEntry[1].toString() : '']
    )
  );
};

// SDK information to be used with service instance
export const sdkType = 'powerbi-client-angular';
export const sdkWrapperVersion = '3.0.5';
