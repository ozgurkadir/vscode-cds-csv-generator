CDS CSV Generator is a tool to create initial CSV data files for [SAP Cloud Application Programming Model](https://cap.cloud.sap/docs/) applications.

The purpose is just to speed up the development :rocket:

## How It Works 
Reads the [Schema Notation (CSN)](https://cap.cloud.sap/docs/cds/csn) file and parses the `entities`, `fields` and `types` that decleared inside the `schema.cds` file. 
Afterwards, generates csv files filled with `mock` or `random` data for each entity. 

Random strings come from `mock-data/mockStrings.json` file.

> ATTENTION: This early preview version does not support all data types and features of  [Definition Language (CDL)](https://cap.cloud.sap/docs/cds/cdl) yet.

## SWAPI App Demo
> INFO: The sample app that used in this demo is : [https://github.com/SAP-samples/cloud-cap-hana-swapi](https://github.com/SAP-samples/cloud-cap-hana-swapi). This awesome and quite complex application is really good choice to try this extension.

<p align="center">
<img src="demo/cds-csv-generator.gif" width=100%>
<br/>
</p>

## How to Use

1. Bring up Command Palette(`Ctrl+Shift+P`) and type `Generate CSV Files` :keyboard: 

2. Type the namespace of `schema.cds` file :writing_hand: 

3. Choose `csn` file from file dialog :clipboard: 

4. Choose a folder to save csv files([db/csv, db/data/ or db/src/csv](https://cap.cloud.sap/docs/guides/databases#providing-initial-data)) :file_folder:


## Requirements

To use CAP CSV Generator, csn file should be created by building the app([mbt build or cds build](https://cap.cloud.sap/docs/advanced/deploy-to-cloud#build-config))

## Supported Features & Types :tada:
:heavy_check_mark: [Compositions and Associations are supported as one-to-one.](https://cap.cloud.sap/docs/cds/cdl#associations)

:heavy_check_mark: `cds.UUID`

:heavy_check_mark: `cds.Timestamp`

:heavy_check_mark: `cds.Integer`

:heavy_check_mark: `cds.String`

:heavy_check_mark: `cds.Boolean`

## Excluded Features
> ATTENTION: Below features are excluded to avoid creating a large number of potentially unnecessary files, entites and elements.

:negative_squared_cross_mark: [Virtual Elements are excluded.](https://cap.cloud.sap/docs/cds/cdl#virtual-elements)

:negative_squared_cross_mark: [Abstract Entites are excluded.](https://cap.cloud.sap/docs/cds/cdl#entities)

:negative_squared_cross_mark: [Views and Projections are excluded.](https://cap.cloud.sap/docs/cds/cdl#views)

:negative_squared_cross_mark: [Common Types & Aspects are excluded for now. Later on, the desired ones will be included via a configuration option.](https://cap.cloud.sap/docs/cds/common#code-lists)


## Unsupported Features & Limitations
:x: Many-to-many  Relationships are not supported yet.

:x: By default, 10 rows of data will be produced. Next releses will allow to modify this behaviour via configuration option.

:x: [Enums](https://cap.cloud.sap/docs/cds/cdl#enums) not yet supported.

:x: Mock `string` values are selected from a list of `one to three` words. In case of exactly one word required(e.g. for a key element), two or three words may appear.

:x: The entities with `@cds.persistence.skip` annotation will be excluded in next releases.


## Known Issues
CSV files name should be like this : `com.namespace-EntityName.csv`. Temporarily, they will be created as `com.namespace.EntityName.csv` and need to be modified manually.


:tada: **Enjoy!** 
