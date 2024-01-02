import { escapeRegExp, template } from 'lodash';
import moment from 'moment';

const DATE_FORMAT = 'YYYY-MM-DD';

export const buildDateRangeQuery = name => values => {
  const [startDateString, endDateString] = values[0]?.split(':') || [];

  if (!startDateString || !endDateString) return '';

  return `metadata.${name}>="${startDateString}" and metadata.${name}<="${endDateString}"`;
};

// Function which takes a filter name and returns
// another function which can be used in filter config
// to parse a given filter into a CQL manually.
export const buildOptionalBooleanQuery = name => values => {
  if (values.length === 2) {
    return 'cql.allRecords=1';
  } else if (values.length === 1 && values[0] === 'false') {
    return `cql.allRecords=1 not ${name}=="true"`;
  } else {
    const joinedValues = values.map(v => `"${v}"`).join(' or ');

    return `${name}==${joinedValues}`;
  }
};

// A closure function which takes the name of the attribute used
// for filtering purposes and returns a function which can be used as a custom
// filter function in <MultiSelection>.
// https://github.com/folio-org/stripes-components/tree/master/lib/MultiSelection#common-props
export function filterItemsBy(name) {
  return (filter, list) => {
    if (!filter) {
      return { renderedItems: list };
    }

    // Escaped filter regex used to filter items on the list.
    const esFilter = new RegExp(escapeRegExp(filter), 'i');

    // Regex used to return filtered items in alphabetical order.
    const regex = new RegExp(`^${esFilter}`, 'i');

    const renderedItems = list
      .filter(item => item[name].match(esFilter))
      .sort((item1, item2) => {
        const match1 = item1[name].match(regex);
        const match2 = item2[name].match(regex);

        if ((match1 && match2) || (!match1 && !match2)) {
          return item1[name] < item2[name] ? -1 : 1;
        }

        if (match1) return -1;
        if (match2) return 1;

        return 1;
      });

    return { renderedItems };
  };
}

export const makeDateRangeFilterString = (startDate, endDate) => {
  const endDateCorrected = moment.utc(endDate).add(1, 'days').format(DATE_FORMAT);

  return `${startDate}:${endDateCorrected}`;
};

export const retrieveDatesFromDateRangeFilterString = filterValue => {
  let dateRange = {
    startDate: '',
    endDate: '',
  };

  if (filterValue) {
    const [startDateString, endDateString] = filterValue.split(':');
    const endDate = moment.utc(endDateString);
    const startDate = moment.utc(startDateString);

    dateRange = {
      startDate: startDate.isValid()
        ? startDate.format(DATE_FORMAT)
        : '',
      endDate: endDate.isValid()
        ? endDate.subtract(1, 'days').format(DATE_FORMAT)
        : '',
    };
  }

  return dateRange;
};

export function getQueryTemplate(queryIndex, indexes) {
  const searchableIndex = indexes.find(({ value }) => value === queryIndex);

  return searchableIndex?.queryTemplate;
}

export function getIsbnIssnTemplate(queryTemplate, identifierTypes, queryIndex) {
  const identifierType = identifierTypes
    .find(({ name }) => name.toLowerCase() === queryIndex);
  const identifierTypeId = identifierType?.id?.['identifier-type-not-found'];

  return template(queryTemplate)({ identifierTypeId });
}

/**
 * Accent Fold
 *
 * For example:
 * LÒpez => Lopez
 *
 * Link:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
 */
export const accentFold = (str = '') => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export const isUserInConsortiumMode = stripes => stripes.hasInterface('consortia');
