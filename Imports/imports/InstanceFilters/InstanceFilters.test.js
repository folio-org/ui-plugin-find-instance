import {
  render,
  screen,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import InstanceFilters from './InstanceFilters';
import Harness from '../../../test/jest/helpers/harness';
import { USER_TOUCHED_STAFF_SUPPRESS_STORAGE_KEY } from '../constants';

jest.mock('../TagsFilter', () => jest.fn().mockReturnValue('TagsFilter'));
jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  CheckboxFilter: ({ name, onChange }) => ((
    <button type="button" onClick={() => onChange()}>change facet {name}</button>
  )),
}));
jest.unmock('@folio/stripes/components');

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
      tenantId: 'cs00000int_0001',
      name: 'location1',
      id: 'locationid1'
    }
  ],
  consortiaTenants: [{
    id: 'cs00000int_0001',
    name: 'College',
  }],
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
  isLoadingLocationsForTenants: false,
};

const mockClear = jest.fn();
const onChange = jest.fn();
const renderInstanceFilters = (props = {}, { dataContext } = {}) => render(
  <Harness
    dataContext={dataContext}
  >
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
      const clearShared = screen.getByRole('button', { name: 'Clear selected filters for "ui-plugin-find-instance.filters.shared"' });
      fireEvent.click(clearShared);
      expect(mockClear).toHaveBeenCalled();
    });

    it('Should Clear selected filters for effective Location', () => {
      const cleareffectiveLocation = screen.getByRole('button', { name: 'Clear selected filters for "ui-plugin-find-instance.filters.effectiveLocation"' });
      fireEvent.click(cleareffectiveLocation);
      expect(mockClear).toHaveBeenCalled();
    });

    it('Should Clear selected filters for language', () => {
      const clearlanguage = screen.getByRole('button', { name: 'Clear selected filters for "ui-plugin-find-instance.instances.language"' });
      fireEvent.click(clearlanguage);
      expect(mockClear).toHaveBeenCalled();
    });

    it('Should Clear selected filters for resource', () => {
      const clearresource = screen.getByRole('button', { name: 'Clear selected filters for "ui-plugin-find-instance.instances.resourceType"' });
      fireEvent.click(clearresource);
      expect(mockClear).toHaveBeenCalled();
    });

    it('Should Clear selected filters for format', () => {
      const clearformat = screen.getByRole('button', { name: 'Clear selected filters for "ui-plugin-find-instance.instanceFormat"' });
      fireEvent.click(clearformat);
      expect(mockClear).toHaveBeenCalled();
    });

    it('Should Clear selected filters for mode', () => {
      const clearmode = screen.getByRole('button', { name: 'Clear selected filters for "ui-plugin-find-instance.modeOfIssuance"' });
      fireEvent.click(clearmode);
      expect(mockClear).toHaveBeenCalled();
    });

    it('Should Clear selected filters for natureOfContent', () => {
      const clearnatureOfContent = screen.getByRole('button', { name: 'Clear selected filters for "ui-plugin-find-instance.natureOfContentTerms"' });
      fireEvent.click(clearnatureOfContent);
      expect(mockClear).toHaveBeenCalled();
    });

    it('Should Clear selected filters for staffSuppress', () => {
      const clearstaffSuppress = screen.getByRole('button', { name: 'Clear selected filters for "ui-plugin-find-instance.staffSuppress"' });
      fireEvent.click(clearstaffSuppress);
      expect(mockClear).toHaveBeenCalled();
    });

    it('Should Clear selected filters for discoverySuppress', () => {
      const cleardiscoverySuppress = screen.getByRole('button', { name: 'Clear selected filters for "ui-plugin-find-instance.discoverySuppress"' });
      fireEvent.click(cleardiscoverySuppress);
      expect(mockClear).toHaveBeenCalled();
    });

    it('Should Clear selected filters for createdDate', () => {
      const clearcreatedDate = screen.getByRole('button', { name: 'Clear selected filters for "ui-plugin-find-instance.createdDate"' });
      fireEvent.click(clearcreatedDate);
      expect(mockClear).toHaveBeenCalled();
    });

    it('Should Clear selected filters for updatedDate', () => {
      const clearupdatedDate = screen.getByRole('button', { name: 'Clear selected filters for "ui-plugin-find-instance.updatedDate"' });
      fireEvent.click(clearupdatedDate);
      expect(mockClear).toHaveBeenCalled();
    });

    it('Should Clear selected filters for source', () => {
      const clearsource = screen.getByRole('button', { name: 'Clear selected filters for "ui-plugin-find-instance.source"' });
      fireEvent.click(clearsource);
      expect(mockClear).toHaveBeenCalled();
    });

    it('should render Shared filter', () => {
      expect(screen.getByText('ui-plugin-find-instance.filters.shared')).toBeInTheDocument();
    });
  });

  describe('when user selects staff suppress options', () => {
    const mockSetItem = jest.fn();
    beforeEach(() => {
      global.Storage.prototype.setItem = mockSetItem;
    });

    afterEach(() => {
      global.Storage.prototype.setItem.mockReset();
    });

    it('should set a flag that user selected some option', async () => {
      renderInstanceFilters();
      const staffSuppressFacet = screen.queryByRole('button', { name: 'ui-plugin-find-instance.staffSuppress filter list' });
      await fireEvent.click(staffSuppressFacet);
      await fireEvent.click(screen.getByText('change facet staffSuppress'));

      expect(mockSetItem).toHaveBeenCalledWith(USER_TOUCHED_STAFF_SUPPRESS_STORAGE_KEY, true);
    });
  });
});
