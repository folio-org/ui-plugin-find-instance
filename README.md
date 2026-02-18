# ui-plugin-find-instance

Copyright (C) 2017-2019 The Open Library Foundation

This software is distributed under the terms of the Apache License,
Version 2.0. See the file "[LICENSE](LICENSE)" for more information.

## Introduction

This package furnishes a single Stripes plugin of type `find-instance`,
which can be included in Stripes modules by means of a `<Pluggable
type="find-instance">` element. See [the *Plugins*
section](https://github.com/folio-org/stripes-core/blob/master/doc/dev-guide.md#plugins)
of the Module Developer's Guide.

## Props

| Name | Type | Description | Required |
--- | --- | --- | --- |
| `disabled` | boolean | Flag to control `disabled` property of plugin's button, since it's rendered inside the plugin | No |
| `searchButtonStyle` | string | optional styling of plugin's button | No |
| `searchLabel` | React.node | optional jsx for plugin's button label | No |
| `isMultiSelect` | boolean | Flag to control if user can select several instances, default is `false` | No |
| `selectInstance` | function | Callback with selected array of instances | No |
| `renderNewBtn` | function | Render function for button `New` | No |
| `config` | object | Allows to pass some options to the plugin components | No |
| `include` | array | List of instance properties to pass as `include` parameter to mod-search. | No |

## Config

| Name | Type | Description | Required |
--- | --- | --- | --- |
| `availableSegments` | array of objects | Object should contain `name` field, which represent what exact section will be rendered. Possible variants of segments: `instances`, `holdings`, `items`. All uniq passed segments will be rendered. If nothing passed, all sections will be rendered. | No |

This is a [Stripes](https://github.com/folio-org/stripes-core/) UI module to display, filter and select Inventory instance(s).

## Additional information

Other [modules](https://dev.folio.org/source-code/#client-side).

See project [UIPFI](https://issues.folio.org/browse/UIPFI)
at the [FOLIO issue tracker](https://dev.folio.org/guidelines/issue-tracker/).

Other FOLIO Developer documentation is at [dev.folio.org](https://dev.folio.org/)
