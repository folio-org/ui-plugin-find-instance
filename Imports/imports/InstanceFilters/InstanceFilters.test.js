import {
  render,
  screen,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import InstanceFilters from './InstanceFilters';
import Harness from '../../../test/jest/helpers/harness';

jest.mock('../TagsFilter', () => jest.fn().mockReturnValue('TagsFilter'));

const activeFilters = {
  shared: ['true'],
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
const renderInstanceFilters = (props = {}) => render(
  <Harness>
    <InstanceFilters
      activeFilters={activeFilters}
      data={data}
      onChange={onChange}
      onClear={mockClear}
      {...props}
    />
  </Harness>
);

describe('InstanceFilters', () => {
  describe('when filters are not empty', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      renderInstanceFilters();
    });

    it('Should Clear selected filters for shared', () => {
      const clearShared = document.querySelector('[data-testid="clear-shared"]');
      fireEvent.click(clearShared);
      expect(mockClear).toBeCalled();
    });

    it('Should Clear selected filters for effective Location', () => {
      const cleareffectiveLocation = document.querySelector('[data-testid="clear-effectiveLocation"]');
      fireEvent.click(cleareffectiveLocation);
      expect(mockClear).toBeCalled();
    });

    it('Should Clear selected filters for language', () => {
      const clearlanguage = document.querySelector('[data-testid="clear-language"]');
      fireEvent.click(clearlanguage);
      expect(mockClear).toBeCalled();
    });

    it('Should Clear selected filters for resource', () => {
      const clearresource = document.querySelector('[data-testid="clear-resource"]');
      fireEvent.click(clearresource);
      expect(mockClear).toBeCalled();
    });

    it('Should Clear selected filters for format', () => {
      const clearformat = document.querySelector('[data-testid="clear-format"]');
      fireEvent.click(clearformat);
      expect(mockClear).toBeCalled();
    });

    it('Should Clear selected filters for mode', () => {
      const clearmode = document.querySelector('[data-testid="clear-mode"]');
      fireEvent.click(clearmode);
      expect(mockClear).toBeCalled();
    });

    it('Should Clear selected filters for natureOfContent', () => {
      const clearnatureOfContent = document.querySelector('[data-testid="clear-natureOfContent"]');
      fireEvent.click(clearnatureOfContent);
      expect(mockClear).toBeCalled();
    });

    it('Should Clear selected filters for staffSuppress', () => {
      const clearstaffSuppress = document.querySelector('[data-testid="clear-staffSuppress"]');
      fireEvent.click(clearstaffSuppress);
      expect(mockClear).toBeCalled();
    });

    it('Should Clear selected filters for discoverySuppress', () => {
      const cleardiscoverySuppress = document.querySelector('[data-testid="clear-discoverySuppress"]');
      fireEvent.click(cleardiscoverySuppress);
      expect(mockClear).toBeCalled();
    });

    it('Should Clear selected filters for createdDate', () => {
      const clearcreatedDate = document.querySelector('[data-testid="clear-createdDate"]');
      fireEvent.click(clearcreatedDate);
      expect(mockClear).toBeCalled();
    });

    it('Should Clear selected filters for updatedDate', () => {
      const clearupdatedDate = document.querySelector('[data-testid="clear-updatedDate"]');
      fireEvent.click(clearupdatedDate);
      expect(mockClear).toBeCalled();
    });

    it('Should Clear selected filters for source', () => {
      const clearsource = document.querySelector('[data-testid="clear-source"]');
      fireEvent.click(clearsource);
      expect(mockClear).toBeCalled();
    });

    it('should render Shared filter', () => {
      expect(screen.getByText('ui-inventory.filters.shared')).toBeInTheDocument();
    });
  });

  describe('when filters are empty', () => {
    beforeEach(() => {
      renderInstanceFilters({
        activeFilters: {},
      });
    });

    it('should disable clear buttons', () => {
      const clearButtons = screen.getAllByRole('button', { name: 'Clear' });
      clearButtons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });
});
