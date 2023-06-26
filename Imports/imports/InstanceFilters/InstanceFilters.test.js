import React from 'react';
import '../../../test/jest/__mock__';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InstanceFilters from './InstanceFilters';

jest.mock('../TagsFilter', () => jest.fn().mockReturnValue('TagsFilter'));

const activeFilters = {
  effectiveLocation: ['location1'],
  resource: ['resource1'],
  language: ['language1'],
  format: ['format1'],
  mode: ['mode1'],
  natureOfContent: ['natureOfContent1'],
  discoverySuppress: ['discoverySuppress1'],
  staffSuppress: ['staffSuppress1'],
  createdDate: ['2023-06-01'],
  updatedDate: ['2023-06-01'],
  source: ['source1'],
  tags: ['tags1'],
};

const data = {
  locations: [
    {
      name: 'location1',
      id: 'locationid1'
    }
  ],
  resourceTypes: [{
    name: 'resourceType1',
    id: 'resourceTypeid1'
  }],
  instanceFormats: [{
    name: 'instanceFormats1',
    id: 'instanceFormatsid1'
  }],
  modesOfIssuance: [{
    name: 'modesOfIssuance1',
    id: 'modesOfIssuanceid1'
  }],
  natureOfContentTerms: [{
    name: 'natureOfContentTerms1',
    id: 'natureOfContentTermsid1'
  }],
  tagsRecords: [{
    name: 'tagsRecords1',
    id: 'tagsRecordsid1'
  }],
};

const mockClear = jest.fn();
const onChange = jest.fn();
const renderInstanceFilters = () => render(
  <InstanceFilters
    activeFilters={activeFilters}
    data={data}
    onChange={onChange}
    onClear={mockClear}
  />
);

describe('InstanceFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    renderInstanceFilters();
  });

  it('Should Clear selected filters for effective Location', () => {
    const cleareffectiveLocation = document.querySelector('[data-testid="clear-effectiveLocation"]');
    userEvent.click(cleareffectiveLocation);
    expect(mockClear).toBeCalled();
  });

  it('Should Clear selected filters for language', () => {
    const clearlanguage = document.querySelector('[data-testid="clear-language"]');
    userEvent.click(clearlanguage);
    expect(mockClear).toBeCalled();
  });

  it('Should Clear selected filters for resource', () => {
    const clearresource = document.querySelector('[data-testid="clear-resource"]');
    userEvent.click(clearresource);
    expect(mockClear).toBeCalled();
  });

  it('Should Clear selected filters for format', () => {
    const clearformat = document.querySelector('[data-testid="clear-format"]');
    userEvent.click(clearformat);
    expect(mockClear).toBeCalled();
  });

  it('Should Clear selected filters for mode', () => {
    const clearmode = document.querySelector('[data-testid="clear-mode"]');
    userEvent.click(clearmode);
    expect(mockClear).toBeCalled();
  });

  it('Should Clear selected filters for natureOfContent', () => {
    const clearnatureOfContent = document.querySelector('[data-testid="clear-natureOfContent"]');
    userEvent.click(clearnatureOfContent);
    expect(mockClear).toBeCalled();
  });

  it('Should Clear selected filters for staffSuppress', () => {
    const clearstaffSuppress = document.querySelector('[data-testid="clear-staffSuppress"]');
    userEvent.click(clearstaffSuppress);
    expect(mockClear).toBeCalled();
  });

  it('Should Clear selected filters for discoverySuppress', () => {
    const cleardiscoverySuppress = document.querySelector('[data-testid="clear-discoverySuppress"]');
    userEvent.click(cleardiscoverySuppress);
    expect(mockClear).toBeCalled();
  });

  it('Should Clear selected filters for createdDate', () => {
    const clearcreatedDate = document.querySelector('[data-testid="clear-createdDate"]');
    userEvent.click(clearcreatedDate);
    expect(mockClear).toBeCalled();
  });

  it('Should Clear selected filters for updatedDate', () => {
    const clearupdatedDate = document.querySelector('[data-testid="clear-updatedDate"]');
    userEvent.click(clearupdatedDate);
    expect(mockClear).toBeCalled();
  });

  it('Should Clear selected filters for source', () => {
    const clearsource = document.querySelector('[data-testid="clear-source"]');
    userEvent.click(clearsource);
    expect(mockClear).toBeCalled();
  });
});
describe('InstanceFilters with empty filters', () => {
  const emptyActiveFilters = {};
  beforeEach(() => {
    render(
      <InstanceFilters
        activeFilters={emptyActiveFilters}
        data={data}
        onChange={onChange}
        onClear={mockClear}
      />
    );
  });

  it('Clear buttons Should be disabled when activeFilters are Empty', () => {
    const clearButtons = screen.getAllByRole('button', { name: 'Clear' });
    clearButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });
});
