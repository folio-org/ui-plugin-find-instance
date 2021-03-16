// import CQLParser, { CQLBoolean } from './cql';

export default function config() {
  this.get('/inventory/instances', (schema) => {
    const {
      instances,
    } = schema;

    return instances.all();
  });

  this.get('/instance-types', ({ instanceTypes }) => {
    return instanceTypes.all();
  });

  this.get('/instance-types/:id');

  this.get('/instance-formats');
  this.get('/instance-formats/:id');

  this.get('/instance-statuses');
  this.get('/instance-statuses/:id');

  this.get('/identifier-types');
  this.get('/identifier-types/:id');

  this.get('/contributor-types');
  this.get('/contributor-types/:id');

  this.get('/contributor-name-types');
  this.get('/contributor-name-types/:id');

  this.get('/classification-types');
  this.get('/classification-types/:id');

  this.get('/alternative-title-types');

  this.get('/instance-relationship-types');
  this.get('/instance-relationship-types/:id');

  this.get('/instance-note-types');
  this.get('/instance-note-types/:id');

  this.get('/modes-of-issuance', ({ issuanceModes }) => issuanceModes.all());
  this.get('/modes-of-issuance/:id', ({ issuanceModes }, { params }) => {
    return issuanceModes.find(params.id);
  });

  this.get('/electronic-access-relationships');
  this.get('/electronic-access-relationships/:id');

  this.get('/statistical-code-types', {
    statisticalCodeTypes: [{
      id: '0d3ec58e-dc3c-4aa1-9eba-180fca95c544',
      name: 'RECM (Record management)',
      source: 'folio'
    }, {
      id: 'e2ab27f9-a726-4e5e-9963-fff9e6128680',
      name: 'SERM (Serial management)',
      source: 'folio'
    }],
    totalRecords: 2
  });
  this.get('/statistical-code-types/:id');

  this.get('/statistical-codes', {
    statisticalCodes: [{
      id: 'c7a32c50-ea7c-43b7-87ab-d134c8371330',
      code: 'ASER',
      name: 'Active serial',
      statisticalCodeTypeId: 'e2ab27f9-a726-4e5e-9963-fff9e6128680',
      source: 'UC'
    }, {
      id: 'b6b46869-f3c1-4370-b603-29774a1e42b1',
      code: 'arch',
      name: 'Archives (arch)',
      statisticalCodeTypeId: '0d3ec58e-dc3c-4aa1-9eba-180fca95c544',
      source: 'UC'
    }],
    totalRecords: 2
  });

  this.get('/ill-policies', {
    illPolicies: [],
    totalRecords: 0
  });

  this.get('/holdings-types', {
    holdingsTypes: [],
    totalRecords: 0
  });

  this.get('/holdings-note-types');
  this.get('/holdings-note-types/:id');

  this.get('/call-number-types', {
    callNumberTypes: [],
    totalRecords: 0
  });

  this.get('/holdings-sources', {
    holdingsRecordsSources: [],
    totalRecords: 0
  });
  this.get('/holdings-sources/:id');

  this.get('/item-note-types');
  this.get('/item-note-types/:id');

  this.get('/item-damaged-statuses', {
    'itemDamageStatuses': [
      {
        'id': '54d1dd76-ea33-4bcb-955b-6b29df4f7930',
        'name': 'Damaged',
        'source': 'local'
      },
      {
        'id': '516b82eb-1f19-4a63-8c48-8f1a3e9ff311',
        'name': 'Not Damaged',
        'source': 'local'
      }
    ],
    'totalRecords': 2
  });
  this.get('/item-damaged-statuses/:id');

  this.get('/nature-of-content-terms');
  this.get('/nature-of-content-terms/:id');

  this.get('/material-types', {
    mtypes: [],
    totalRecords: 0
  });

  this.get('/loan-types', {
    loantypes: [],
    totalRecords: 0
  });

  this.get('/locations', {
    locations: [
      {
        id: '53cf956f-c1df-410b-8bea-27f712cca7c0',
        name: 'Annex',
        code: 'KU/CC/DI/A',
        isActive: true,
        institutionId: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
        campusId: '62cf76b7-cca5-4d33-9217-edf42ce1a848',
        libraryId: '5d78803e-ca04-4b4a-aeae-2c63b924518b',
        primaryServicePoint: '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
        servicePointIds: [
          '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
        ],
      },
      {
        id: 'fcd64ce1-6995-48f0-840e-89ffa2288371',
        name: 'Main Library',
        code: 'KU/CC/DI/M',
        isActive: true,
        institutionId: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
        campusId: '62cf76b7-cca5-4d33-9217-edf42ce1a848',
        libraryId: '5d78803e-ca04-4b4a-aeae-2c63b924518b',
        primaryServicePoint: '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
        servicePointIds: [
          '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
        ],
      },
      {
        id: '758258bc-ecc1-41b8-abca-f7b610822ffd',
        name: 'ORWIG ETHNO CD',
        code: 'KU/CC/DI/O',
        isActive: true,
        institutionId: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
        campusId: '62cf76b7-cca5-4d33-9217-edf42ce1a848',
        libraryId: '5d78803e-ca04-4b4a-aeae-2c63b924518b',
        primaryServicePoint: '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
        servicePointIds: [
          '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
        ],
      },
      {
        id: 'b241764c-1466-4e1d-a028-1a3684a5da87',
        name: 'Popular Reading Collection',
        code: 'KU/CC/DI/P',
        isActive: true,
        institutionId: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
        campusId: '62cf76b7-cca5-4d33-9217-edf42ce1a848',
        libraryId: '5d78803e-ca04-4b4a-aeae-2c63b924518b',
        primaryServicePoint: '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
        servicePointIds: [
          '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
        ],
      },
      {
        id: 'f34d27c6-a8eb-461b-acd6-5dea81771e70',
        name: 'SECOND FLOOR',
        code: 'KU/CC/DI/2',
        isActive: true,
        institutionId: '40ee00ca-a518-4b49-be01-0638d0a4ac57',
        campusId: '62cf76b7-cca5-4d33-9217-edf42ce1a848',
        libraryId: '5d78803e-ca04-4b4a-aeae-2c63b924518b',
        primaryServicePoint: '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
        servicePointIds: [
          '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
        ],
      },
    ],
    totalRecords: 5,
  });
  this.get('/locations/:id', {});


}
