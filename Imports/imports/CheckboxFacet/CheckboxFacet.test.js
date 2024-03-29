import { screen, render, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import CheckboxFacet from './CheckboxFacet';

const defaultProps = {
  dataOptions: [
    {
      disabled: false,
      label: 'TestOption1',
      readOnly: false,
      value: 1,
      count: 5
    },
    {
      disabled: false,
      label: 'TestOption2',
      readOnly: false,
      value: 2,
      count: 12
    },
    {
      disabled: false,
      label: 'TestOption3',
      readOnly: false,
      value: 3,
      count: 4
    },
    {
      disabled: false,
      label: 'TestOption4',
      readOnly: false,
      value: 4,
      count: 6
    },
    {
      disabled: false,
      label: 'TestOption5',
      readOnly: false,
      value: 5,
      count: 8
    },
    {
      disabled: false,
      label: 'TestOption6',
      readOnly: false,
      value: 6,
      count: 10
    }
  ],
  onFetch: jest.fn(),
  onSearch: jest.fn(),
  name: 'Test Name',
  onChange: jest.fn(),
  isPending: false,
  selectedValues: [1, 5],
  isFilterable: true
};

const getComponent = (props) => <CheckboxFacet {...props} />;

const renderCheckboxFacet = (props) => render(getComponent(props));

describe('CheckboxFacet', () => {
  it('Component should render', () => {
    renderCheckboxFacet(defaultProps);
    expect(screen.getByRole('searchbox', { name: 'Test Name-field' })).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(5);
    expect(screen.getByRole('button', { name: 'ui-plugin-find-instance.more' })).toBeInTheDocument();
  });
  it('More options should render when More button is click', () => {
    renderCheckboxFacet(defaultProps);
    fireEvent.click(screen.getByRole('button', { name: 'ui-plugin-find-instance.more' }));
    expect(screen.getAllByRole('checkbox')).toHaveLength(6);
  });
  it('components.readonly should be render when readonly property is true', () => {
    const props = {
      dataOptions: [
        {
          disabled: false,
          label: 'Options1',
          readOnly: true,
          value: 1,
          count: 4
        }
      ],
      name: 'Test Name',
      onChange: jest.fn(),
      isPending: false
    };
    renderCheckboxFacet(props);
    expect(screen.getByText('stripes-components.readonly')).toBeInTheDocument();
  });
  it('No matching options should be render when required search is not found', () => {
    const { rerender } = renderCheckboxFacet(defaultProps);
    fireEvent.change(screen.getByRole('searchbox', { name: 'Test Name-field' }), { target: { value: 'test search' } });

    renderCheckboxFacet(defaultProps, rerender);

    expect(screen.getByText('ui-plugin-find-instance.noMatchingOptions')).toBeInTheDocument();
  });
  it('component should re-render ', () => {
    const props = {
      dataOptions: [
        {
          disabled: false,
          label: 'TestOption1',
          readOnly: false,
          value: 1,
          count: 5
        },
        {
          disabled: false,
          label: 'TestOption2',
          readOnly: false,
          value: 2,
          count: 12
        },
        {
          disabled: false,
          label: 'TestOption3',
          readOnly: false,
          value: 3,
          count: 4
        },
        {
          disabled: false,
          label: 'TestOption4',
          readOnly: false,
          value: 4,
          count: 6
        },
        {
          disabled: false,
          label: 'TestOption5',
          readOnly: false,
          value: 5,
          count: 8
        },
        {
          disabled: false,
          label: 'TestOption6',
          readOnly: false,
          value: 6,
          count: 10
        },
        {
          disabled: false,
          label: 'TestOption7',
          readOnly: false,
          value: 7,
          count: 19
        },
        {
          disabled: false,
          label: 'TestOption8',
          readOnly: false,
          value: 8,
          count: 17
        }
      ],
      onFetch: jest.fn(),
      onSearch: jest.fn(),
      name: 'Test Name',
      onChange: jest.fn(),
      isPending: false,
      selectedValues: [7, 8, 6],
      isFilterable: true
    };
    const { rerender } = renderCheckboxFacet(defaultProps);

    fireEvent.click(screen.getByRole('button', { name: 'ui-plugin-find-instance.more' }));
    rerender(getComponent(props));

    fireEvent.click(screen.getByRole('checkbox', { name: 'TestOption3 4' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'TestOption7 19' }));

    expect(screen.getAllByRole('checkbox')).toHaveLength(8);
  });
});
