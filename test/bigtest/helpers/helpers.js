import { beforeEach } from '@bigtest/mocha';

import { setupStripesCore } from '@folio/stripes/core/test';

import mirageOptions from '../network';
import PluginHarness from './PluginHarness';
import PluginHarnessMultiselect from './PluginHarnessMultiselect';

mirageOptions.serverType = 'miragejs';

export default function setupApplication({
  hasAllPerms = true,
  isMultiSelect,
  scenarios,
} = {}) {
  setupStripesCore({
    mirageOptions,
    scenarios,
    stripesConfig: { hasAllPerms },

    // setup a dummy app for the plugin that renders a harness.
    modules: [{
      type: 'app',
      name: '@folio/ui-dummy',
      displayName: 'dummy.title',
      route: '/dummy',
      module: isMultiSelect ? PluginHarnessMultiselect : PluginHarness,
    }],

    translations: {
      'dummy.title': 'Dummy'
    },
  });

  beforeEach(function () {
    this.visit('/dummy');
  });
}
