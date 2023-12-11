import { render } from '@folio/jest-config-stripes/testing-library/react';
import { Accordion } from '@folio/stripes/components';
import { MultiSelectionFilter } from '@folio/stripes/smart-components';
import TagsFilter from './TagsFilter';

const mockOnChange = jest.fn();
const mockOnClear = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/',
    search: '?',
  }),
}));

const tagsRecords = [
  {
    'id': '9a9a8754-ca90-41d2-9e80-f4b314c84b3d',
    'label': 'urgent',
    'description': 'Requires urgent attention',
    'metadata': {
      'createdDate': '2023-11-17T12:31:40.252+00:00'
    },
  },
  {
    'id': 'f6267db5-cd5a-45bc-af00-e34a2c7d32cc',
    'label': 'important',
    'metadata': {
      'createdDate': '2023-11-17T12:31:40.238+00:00'
    },
  },
];

describe('TagsFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderTagsFilter = (props) => (
    render(<TagsFilter
      onChange={mockOnChange}
      onClear={mockOnClear}
      selectedValues={[]}
      tagsRecords={tagsRecords}
      {...props}
    />)
  );

  it('should be closed by default', () => {
    renderTagsFilter();
    expect(Accordion).toHaveBeenCalledWith(expect.objectContaining({ closedByDefault: true }), {});
  });

  describe('when there is a selected option', () => {
    it('should display clear button', () => {
      renderTagsFilter({ selectedValues: ['important'] });
      expect(Accordion).toHaveBeenCalledWith(expect.objectContaining({ displayClearButton: true }), {});
    });
  });

  it('should display correct label', () => {
    renderTagsFilter();
    expect(Accordion).toHaveBeenCalledWith(expect.objectContaining({ label: 'ui-plugin-find-instance.filter.tags' }), {});
  });

  it('should clear selected options', () => {
    renderTagsFilter();
    Accordion.mock.calls[0][0].onClearFilter();
    expect(mockOnClear).toHaveBeenCalledWith('tags');
  });

  it('should have correct options to select', () => {
    const dataOptions = [
      {
        'label': 'important',
        'value': 'important'
      },
      {
        'label': 'urgent',
        'value': 'urgent'
      }
    ];

    renderTagsFilter();
    expect(MultiSelectionFilter).toHaveBeenCalledWith(expect.objectContaining({ dataOptions }), {});
  });

  it('should have correct name', () => {
    renderTagsFilter();
    expect(MultiSelectionFilter).toHaveBeenCalledWith(expect.objectContaining({ name: 'tags' }), {});
  });

  it('should change options', () => {
    renderTagsFilter();
    MultiSelectionFilter.mock.calls[0][0].onChange();
    expect(mockOnChange).toHaveBeenCalled();
  });
});
