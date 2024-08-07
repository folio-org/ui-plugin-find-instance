import {
  render,
  screen,
  within,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  ButtonGroup,
  Button,
} from '@folio/stripes/components';
import { segments } from '@folio/stripes-inventory-components';

import FilterNavigation from './FilterNavigation';

describe('FilterNavigation', () => {
  const buttonGroupTestId = 'buttonGroup';
  const mockedSetSegment = jest.fn();
  const mockOnChange = jest.fn();
  const defaultProps = {
    onChange: mockOnChange,
    setSegment: mockedSetSegment,
  };

  const renderFilterNavigation = (props = {}) => render(
    <FilterNavigation
      segment={segments.instances}
      onChange={mockOnChange}
      setSegment={mockedSetSegment}
      {...props}
    />
  );

  const getButton = (segment) => within(screen.getByTestId(buttonGroupTestId)).getByText(`ui-plugin-find-instance.filters.${segment}`);
  const testSegments = (segmentsForTest, activeSegment) => {
    segmentsForTest.forEach((segment, index) => {
      const number = index + 1;

      it(`should render ${segment} button`, () => {
        const button = getButton(segment);

        expect(Button).toHaveBeenNthCalledWith(number, expect.objectContaining({
          buttonStyle: segment === activeSegment ? 'primary' : 'default',
        }), {});
        expect(button).toBeInTheDocument();
      });
    });
  };

  afterEach(() => {
    Button.mockClear();
    ButtonGroup.mockClear();
    mockOnChange.mockClear();
    mockedSetSegment.mockClear();
  });

  describe('when "availableSegments" is not passed', () => {
    const segmentsForTest = Object.keys(segments);

    beforeEach(() => {
      render(
        <FilterNavigation
          {...defaultProps}
        />
      );
    });

    testSegments(segmentsForTest, segmentsForTest[0]);
  });

  describe('when "availableSegments" is passed', () => {
    describe('and contains only one item', () => {
      const mockedAvailableSegments = [{
        name: segments.items,
      }];

      beforeEach(() => {
        render(
          <FilterNavigation
            {...defaultProps}
            availableSegments={mockedAvailableSegments}
            segment={segments.items}
          />
        );
      });

      it('should set passed segment as active', () => {
        expect(mockedSetSegment).toHaveBeenCalledWith(segments.items);
      });

      it('should not render "ButtonGroup"', () => {
        expect(screen.queryByTestId(buttonGroupTestId)).not.toBeInTheDocument();
      });

      it('should not render any buttons', () => {
        expect(screen.queryAllByRole('button')).toHaveLength(0);
      });
    });

    describe('and contains more than one item', () => {
      const mockedAvailableSegments = [{
        name: segments.holdings,
      }, {
        name: segments.items,
      }];
      const segmentsForTest = mockedAvailableSegments.map(segment => segment.name);

      beforeEach(() => {
        render(
          <FilterNavigation
            {...defaultProps}
            availableSegments={mockedAvailableSegments}
            segment={segments.holdings}
          />
        );
      });

      it('should set first passed segment as active', () => {
        expect(mockedSetSegment).toHaveBeenCalledWith(segments.holdings);
      });

      testSegments(segmentsForTest, segments.holdings);
    });
  });

  describe('when pressing the current segment', () => {
    it('should not fire onChange', () => {
      const { getByRole } = renderFilterNavigation();

      const instanceSegment = getByRole('button', { name: 'ui-plugin-find-instance.filters.instances' });
      fireEvent.click(instanceSegment);

      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe('when clicking another segment', () => {
    it('should fire onChange', () => {
      const { getByRole } = renderFilterNavigation();

      const holdingsSegment = getByRole('button', { name: 'ui-plugin-find-instance.filters.holdings' });
      fireEvent.click(holdingsSegment);

      expect(mockOnChange).toHaveBeenCalled();
    });
  });
});
