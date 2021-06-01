import React from 'react';
import {
  render,
  cleanup,
} from '@testing-library/react';

import '../test/jest/__mock__';
import PluginFindRecord from './PluginFindRecord';

const renderPluginFindRecord = ({
  selectRecordsCb = jest.fn(),
  onClose = jest.fn(),
  children = jest.fn(),
}) => render(
  <PluginFindRecord
    selectRecordsCb={selectRecordsCb}
    onClose={onClose}
    withTrigger
  >
    {children}
  </PluginFindRecord>
);

describe('Plugin find record', () => {
  let pluginFindRecord;

  beforeEach(() => {
    pluginFindRecord = renderPluginFindRecord({});
  });

  afterEach(cleanup);

  it('should be rendered', () => {
    const { container } = pluginFindRecord;
    const pluginContent = container.querySelector('.searchControl');

    expect(container).toBeVisible();
    expect(pluginContent).toBeVisible();
  });

  it('should render trigger button', () => {
    const { container } = pluginFindRecord;
    const wrapper = container.querySelector('.searchControl.marginBottom0.marginTop0');
    const button = container.querySelector('[data-test-button]');
    const searchIcon = container.querySelector('[data-test-button] span');

    expect(wrapper).toBeVisible();
    expect(button).toBeVisible();
    expect(searchIcon).toBeVisible();
  });
});
