import { Factory } from 'miragejs';
import {
  lorem,
  name,
  random,
} from 'faker';

export default Factory.extend({
  id: () => random.uuid(),
  title: () => lorem.sentence(),
  contributors: () => [{ name: `${name.lastName()}, ${name.firstName()}` }],
  source: () => 'FOLIO',
  identifiers: () => [],
  publication: () => [],
  alternativeTitles: () => [],
  series: () => [],
  physicalDescriptions: () => [],
  languages: () => [],
  notes: () => [],
  electronicAccess: () => [],
  subjects: () => [],
  classifications: () => [],
  childInstances: () => [],
  parentInstances: () => [],
  statisticalCodeIds: () => [],
  hrid: i => `in0000000000${i + 1}`,
});
