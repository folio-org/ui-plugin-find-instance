import {
  buildDateRangeQuery,
  buildOptionalBooleanQuery,
  filterItemsBy,
  makeDateRangeFilterString,
  retrieveDatesFromDateRangeFilterString,
  getQueryTemplate,
  getIsbnIssnTemplate,
  getLocationFilterOptions,
} from './utils';

describe('buildDateRangeQuery', () => {
  const mockName = 'date';
  it('should return the correct query string when valid values are provided', () => {
    const values = ['2023-01-01:2023-12-31'];
    const expectedQuery = 'metadata.date>="2023-01-01" and metadata.date<="2023-12-31"';
    const dateRangeQuery = buildDateRangeQuery(mockName)(values);
    expect(dateRangeQuery).toBe(expectedQuery);
  });
  it('should return an empty string when values are not provided or are invalid', () => {
    const emptyValues = [];
    const invalidValues = ['2023-01-01'];
    const emptyQuery = buildDateRangeQuery(mockName)(emptyValues);
    const invalidQuery = buildDateRangeQuery(mockName)(invalidValues);
    expect(emptyQuery).toBe('');
    expect(invalidQuery).toBe('');
  });
});

describe('buildOptionalBooleanQuery', () => {
  const mockName = 'published';
  it('should return the correct query string when two values are provided', () => {
    const values = ['true', 'false'];
    const expectedQuery = 'cql.allRecords=1';
    const optionalBooleanQuery = buildOptionalBooleanQuery(mockName)(values);
    expect(optionalBooleanQuery).toBe(expectedQuery);
  });
  it('should return the correct query string when one value is "false"', () => {
    const values = ['false'];
    const expectedQuery = 'cql.allRecords=1 not published=="true"';
    const optionalBooleanQuery = buildOptionalBooleanQuery(mockName)(values);
    expect(optionalBooleanQuery).toBe(expectedQuery);
  });
  it('should return the correct query string when other values are provided', () => {
    const values = ['value1', 'value2', 'value3'];
    const joinedValues = '"value1" or "value2" or "value3"';
    const expectedQuery = `published==${joinedValues}`;
    const optionalBooleanQuery = buildOptionalBooleanQuery(mockName)(values);
    expect(optionalBooleanQuery).toBe(expectedQuery);
  });
});

describe('filterItemsBy', () => {
  const list = [
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Orange' },
    { id: 4, name: 'Grapes' },
  ];
  it('should return all items when filter is empty', () => {
    const name = 'name';
    const filter = '';
    const { renderedItems } = filterItemsBy(name)(filter, list);
    expect(renderedItems).toEqual(list);
  });
  it('should filter items based on the provided filter', () => {
    const name = 'name';
    const filter = 'a';
    const { renderedItems } = filterItemsBy(name)(filter, list);
    const expectedItems = [
      { id: 1, name: 'Apple' },
      { id: 2, name: 'Banana' },
      { id: 4, name: 'Grapes' },
      { id: 3, name: 'Orange' },
    ];
    expect(renderedItems).toEqual(expectedItems);
  });
  it('should handle empty filtered items', () => {
    const name = 'name';
    const filter = 'xyz';
    const { renderedItems } = filterItemsBy(name)(filter, list);
    const expectedItems = [];
    expect(renderedItems).toEqual(expectedItems);
  });
});

describe('makeDateRangeFilterString', () => {
  it('should return the correct date range filter string', () => {
    const startDate = '2023-01-01';
    const endDate = '2023-12-31';
    const expectedFilterString = '2023-01-01:2024-01-01';
    const filterString = makeDateRangeFilterString(startDate, endDate);
    expect(filterString).toBe(expectedFilterString);
  });
});

describe('retrieveDatesFromDateRangeFilterString', () => {
  it('should return the correct dates when valid filter value is provided', () => {
    const filterValue = '2023-01-01:2023-12-31';
    const expectedDates = {
      startDate: '2023-01-01',
      endDate: '2023-12-30',
    };
    const dates = retrieveDatesFromDateRangeFilterString(filterValue);
    expect(dates).toEqual(expectedDates);
  });
  it('should return empty strings for dates when filter value is empty', () => {
    const filterValue = '';
    const expectedDates = {
      startDate: '',
      endDate: '',
    };
    const dates = retrieveDatesFromDateRangeFilterString(filterValue);
    expect(dates).toEqual(expectedDates);
  });
});

describe('getQueryTemplate', () => {
  const mockIndexes = [
    { value: 1, queryTemplate: 'Template 1' },
    { value: 2, queryTemplate: 'Template 2' },
  ];
  it('should return the query template when matching index is found', () => {
    const queryIndex = 1;
    const expectedTemplate = 'Template 1';
    const template = getQueryTemplate(queryIndex, mockIndexes);
    expect(template).toBe(expectedTemplate);
  });
  it('should return undefined when matching index is not found', () => {
    const queryIndex = 3;
    const template = getQueryTemplate(queryIndex, mockIndexes);
    expect(template).toBeUndefined();
  });
});

describe('getIsbnIssnTemplate', () => {
  const mockQueryTemplate = 'Identifier type is <%= identifierTypeId %>';
  const mockIdentifierTypes = [
    { name: 'isbn', id: { 'identifier-type-not-found': 'ISBN' } },
    { name: 'issn', id: { 'identifier-type-not-found': 'ISSN' } },
  ];
  it('should return the template with the correct identifier type when matching query index is found', () => {
    const queryIndex = 'isbn';
    const expectedTemplate = 'Identifier type is ISBN';
    const template = getIsbnIssnTemplate(mockQueryTemplate, mockIdentifierTypes, queryIndex);
    expect(template).toBe(expectedTemplate);
  });
  it('should not return an empty string when matching query index is found', () => {
    const queryIndex = 'other';
    const template = getIsbnIssnTemplate(mockQueryTemplate, mockIdentifierTypes, queryIndex);
    expect(template).toBe('Identifier type is ');
  });
});

describe('getLocationFilterOptions', () => {
  describe('when the mode is consortium', () => {
    describe('and locations with duplicates', () => {
      it('should remove locations with the same id and append tenant name to the label of duplicates', () => {
        const locations = [
          {
            id: '53cf956f-c1df-410b-8bea-27f712cca7c0',
            name: 'Annex',
            _tenantId: 'cs00000int_0001',
          },
          {
            id: '53cf956f-c1df-410b-8bea-27f712cca7c0',
            name: 'Annex',
            _tenantId: 'cs00000int',
          },
          {
            id: '184aae84-a5bf-4c6a-85ba-4a7c73026cd5',
            name: 'Online',
            _tenantId: 'cs00000int_0003',
          },
          {
            id: '8e9f7ced-d720-4cd4-b098-0f7c1f7c3ceb',
            name: 'Annex',
            _tenantId: 'cs00000int_0005',
          },
        ];

        const consortiaTenants = [
          {
            id: 'cs00000int_0001',
            name: 'College',
          },
          {
            id: 'cs00000int',
            name: 'Central Office',
          },
          {
            id: 'cs00000int_0003',
            name: 'School',
          },
          {
            id: 'cs00000int_0005',
            name: 'University',
          },
        ];

        const stripes = {
          hasInterface: () => true,
        };

        expect(getLocationFilterOptions(locations, consortiaTenants, stripes)).toEqual([
          { label: 'Annex (College)', value: '53cf956f-c1df-410b-8bea-27f712cca7c0' },
          { label: 'Online', value: '184aae84-a5bf-4c6a-85ba-4a7c73026cd5' },
          { label: 'Annex (University)', value: '8e9f7ced-d720-4cd4-b098-0f7c1f7c3ceb' },
        ]);
      });
    });

    it('should return options for non-consortium', () => {
      const locations = [
        {
          id: '53cf956f-c1df-410b-8bea-27f712cca7c0',
          name: 'Annex',
        },
        {
          id: '184aae84-a5bf-4c6a-85ba-4a7c73026cd5',
          name: 'Online',
        },
      ];

      const consortiaTenants = undefined;

      const stripes = {
        hasInterface: () => false,
      };

      expect(getLocationFilterOptions(locations, consortiaTenants, stripes)).toEqual([
        { label: 'Annex', value: '53cf956f-c1df-410b-8bea-27f712cca7c0' },
        { label: 'Online', value: '184aae84-a5bf-4c6a-85ba-4a7c73026cd5' },
      ]);
    });
  });
});
