# Change Log

All notable changes to the "cds-csv-generator" extension will be documented in this file.

## v0.0.5 - 26-04-2021

### Added
- Entities annotated with `@cds.persistence.skip` are excluded. ([Issue 1](https://github.com/ozgurkadir/vscode-cds-csv-generator/issues/1))
- Enumeration values support. ([Issue 13](https://github.com/ozgurkadir/vscode-cds-csv-generator/issues/13))
- Allow users to modify the number of rows to be created on extension settings. ([Issue 6](https://github.com/ozgurkadir/vscode-cds-csv-generator/issues/6))
- Provide an extension settings option to decide if CSV files for "sap.common.CodeList" entities will be created. ([Issue 7](https://github.com/ozgurkadir/vscode-cds-csv-generator/issues/7))

### Changed
- 

### Fixed
- CSV files names corrected: from "com.namespace.EntityName.csv" to "com.namespace-EntityName.csv" ([Issue 3](https://github.com/ozgurkadir/vscode-cds-csv-generator/issues/3))
- Error on finding target field on association-to-association relationship ([Issue 4](https://github.com/ozgurkadir/vscode-cds-csv-generator/issues/4))


### Initial release