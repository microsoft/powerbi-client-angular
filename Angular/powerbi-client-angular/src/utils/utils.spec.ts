// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { EventHandler } from '../components/powerbi-embed/powerbi-embed.component';
import { stringifyMap } from './utils';

describe('tests of PowerBIEmbed', () => {
  // Tests for utils stringifyMap
  describe('tests PowerBIEmbed stringifyMap method', () => {
    it('stringifies the event handler map', () => {
      // Arrange
      const eventHandlerMap = new Map<string, EventHandler | null>([
        ['loaded', () => console.log('Report loaded')],
        ['rendered', () => console.log('Rendered')]
      ]);

      const expectedString = `[["loaded","() => console.log('Report loaded')"],["rendered","() => console.log('Rendered')"]]`;

      // Act
      const jsonStringOutput = stringifyMap(eventHandlerMap);

      // Assert
      expect(jsonStringOutput).toBe(expectedString);
    });

    it('stringifies empty event handler map', () => {
      // Arrange
      const eventHandlerMap = new Map<string, EventHandler | null>([]);
      const expectedString = `[]`;

      // Act
      const jsonStringOutput = stringifyMap(eventHandlerMap);

      // Assert
      expect(jsonStringOutput).toBe(expectedString);
    });

    it('stringifies null in event handler map', () => {

    	// Arrange
    	const eventHandlerMap = new Map<string, EventHandler | null>([
    		['loaded', null],
    		['rendered', () => console.log('Rendered')]
    	]);
    	const expectedString = `[["loaded",""],["rendered","() => console.log('Rendered')"]]`;

    	// Act
    	const jsonStringOutput = stringifyMap(eventHandlerMap);

    	// Assert
    	expect(jsonStringOutput).toBe(expectedString);
    });
  });
});
