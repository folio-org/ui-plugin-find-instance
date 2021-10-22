# Change history for ui-plugin-find-instance

* Find instance plugin make unnecessary requests that produce performance issues. Refs UIPFI-82.

## [6.0.0] (https://github.com/folio-org/ui-plugin-find-instance/tree/v6.0.0) (2021-10-05)

* Change default search index to align it with the `ui-inventory` module. Fixes UIPFI-36.
* Increment stripes to v7. Refs UIPFI-77.

## [5.1.0] (https://github.com/folio-org/ui-plugin-find-instance/tree/v5.1.0) (2021-06-15)
[Full Changelog](https://github.com/folio-org/ui-plugin-find-instance/compare/v5.0.0...v5.1.0)

* Update the .gitignore file. Refs UIPFI-25.
* Add pull request template. Refs UIPFI-26.
* Update search and filter pane to mirror `ui-inventory`. Refs UIPFI-6, UIPFI-18, UIPFI-19, UIPFI-20.
* Add settings up for Jest/RTL tests. Refs UIPFI-27.
* Add tests fot directory `PluginFindRecord`. Refs UIPFI-28.

## [5.0.0](https://github.com/folio-org/ui-plugin-find-instance/tree/v5.0.0) (2021-03-10)
[Full Changelog](https://github.com/folio-org/ui-plugin-find-instance/compare/v4.0.0...v5.0.0)

* Do not show results without performing a query. Fixes UIPFI-17.
* Update to stripes v6. Refs UIPFI-21.
* Update to `stripes-cli v2.0.0`. Refs UIPFI-23.

## [4.0.0](https://github.com/folio-org/ui-plugin-find-instance/tree/v4.0.0) (2020-10-07)
[Full Changelog](https://github.com/folio-org/ui-plugin-find-instance/compare/v3.0.0...v4.0.0)

* Update `@folio/stripes` to `v5`, `react-router` to `v5.2`.
* Fix UI Glitch When Opening plugin modal.
* Update translation strings.

## [3.0.0](https://github.com/folio-org/ui-plugin-find-instance/tree/v3.0.0) (2020-06-10)
[Full Changelog](https://github.com/folio-org/ui-plugin-find-instance/compare/v2.0.0...v3.0.0)

* Purge `intlShape` in prep for `react-intl` `v4` migration. Update to `@folio/stripes` `v4.0.0`. Refs STRIPES-672.
* Update translation strings.
* Fix tests broken by MCL refactoring. Refs UIPFI-12.

## [2.0.0](https://github.com/folio-org/ui-plugin-find-instance/tree/v2.0.0) (2020-03-13)
[Full Changelog](https://github.com/folio-org/ui-plugin-find-instance/compare/v1.6.0...v2.0.0)

### Stories
* [UIPFI-2](https://issues.folio.org/browse/UIPFI-2) ui-plugin-find-instance | Build BigTest unit test code coverage above 80%
* Update to `@folio/stripes` `v3.0.0`

### Bug fixes
* [UIPFI-7](https://issues.folio.org/browse/UIPFI-7) Security update eslint to >= 6.2.1 or eslint-util >= 1.4.1

## [1.6.0](https://github.com/folio-org/ui-plugin-find-instance/tree/v1.6.0) (2019-12-4)
[Full Changelog](https://github.com/folio-org/ui-plugin-find-instance/compare/v1.5.0...v1.6.0)

* Update translation strings

## [1.5.0](https://github.com/folio-org/ui-plugin-find-instance/tree/v1.5.0) (2019-09-11)
[Full Changelog](https://github.com/folio-org/ui-plugin-find-instance/compare/v1.4.0...v1.5.0)

* Update translation strings
* Rewrite using `SearchAndSortQuery`. UIOR-345.
* Don't use shared components. UIOR-345.

## [1.4.0](https://github.com/folio-org/ui-plugin-find-instance/tree/v1.4.0) (2019-03-19)
[Full Changelog](https://github.com/folio-org/ui-plugin-find-instance/compare/v1.3.0...v1.4.0)

* Accessibility change. STCOM-396.

## [1.3.0](https://github.com/folio-org/ui-plugin-find-instance/tree/v1.3.0) (2019-01-25)
[Full Changelog](https://github.com/folio-org/ui-plugin-find-instance/compare/v1.2.0...v1.3.0)

* Upgrade to stripes v2.0.0.

## [1.2.0](https://github.com/folio-org/ui-plugin-find-instance/tree/v1.2.0) (2018-12-10)
[Full Changelog](https://github.com/folio-org/ui-plugin-find-instance/compare/v1.1.0...v1.2.0)

* Lenient prop-types for labels.

## [1.1.0](https://github.com/folio-org/ui-plugin-find-instance/tree/v1.1.0) (2018-10-05)
[Full Changelog](https://github.com/folio-org/ui-plugin-find-instance/compare/v1.0.1...v1.1.0)

* Update inventory UI path
* Use `stripes` framework 1.0

## [1.0.1] (2018-09-13, initial release)

* Cribbed from ui-plugin-find-user.
* Portuguese translations.
* Dependency cleanup.
