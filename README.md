CDS CSV Generator is a tool to create initial CSV data files for [SAP Cloud Application Programming Model](https://cap.cloud.sap/docs/) applications.

The purpose is just to speed up the development 🚀

Available on [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=ozgurkadir.cds-csv-generator) and [Open VSX](https://open-vsx.org/extension/ozgurkadir/cds-csv-generator)


## Extension Settings & Customization
This extension has two custom setting which are accessible from [`Settings editor`](https://code.visualstudio.com/docs/getstarted/settings).

1️⃣ Common Entities -> If checked, CSV files for aspect `sap.common.CodeList` will be produced.
Values for entities Countries, Currencies and Languages are retrieved from [`SAP-samples/cloud-cap-samples`](https://github.com/SAP-samples/cloud-cap-samples/tree/master/common/data).

2️⃣ Number of Rows -> Used to customize the number of rows to be created, default value is 10.


<p align="center">
<img src="https://github.com/ozgurkadir/vscode-cds-csv-generator/raw/main/demo/cds-csv-generator-settings.png" width=100%>
<br/>
</p>


## How It Works 
Reads the [Schema Notation (CSN)](https://cap.cloud.sap/docs/cds/csn) file and parses the `entities`, `fields` and `types` that decleared inside the `schema.cds` file. 
Afterwards, generates csv files filled with `mock` or `random` data for each entity. 

Random strings come from `mock-data/mockStrings.json` file.

> ATTENTION: This early preview version does not support all data types and features of  [Definition Language (CDL)](https://cap.cloud.sap/docs/cds/cdl) yet.

## SWAPI App Demo
> INFO: The sample app that used in this demo is : [https://github.com/SAP-samples/cloud-cap-hana-swapi](https://github.com/SAP-samples/cloud-cap-hana-swapi). This awesome and quite complex application is really good choice to try this extension.

<p align="center">
<img src="https://github.com/ozgurkadir/vscode-cds-csv-generator/raw/main/demo/cds-csv-generator.gif" width=100%>
<br/>
</p>

## How to Use

1. Bring up Command Palette(`Ctrl+Shift+P`) and type `Generate CSV Files` ⌨️

2. Type the namespace of `schema.cds` file ✍️

3. Choose `csn` file from file dialog 📋

4. Choose a folder to save csv files([db/csv, db/data/ or db/src/csv](https://cap.cloud.sap/docs/guides/databases#providing-initial-data)) 📁


## Requirements

To use CAP CSV Generator, csn file should be created by building the app([mbt build or cds build](https://cap.cloud.sap/docs/advanced/deploy-to-cloud#build-config))

## Supported Features & Types 🎉
✔️ [Compositions and Associations are supported as one-to-one.](https://cap.cloud.sap/docs/cds/cdl#associations)

✔️ [Enums](https://cap.cloud.sap/docs/cds/cdl#enums) supported with release v0.0.5. The values will be selected from the list of enumeration values.

✔️ `cds.UUID`

✔️ `cds.Timestamp`

✔️ `cds.DateTime`

✔️ `cds.Integer`

✔️ `cds.String`

✔️ `cds.LargeString`

✔️ `cds.Boolean`


## Excluded Features
> ATTENTION: Below features are excluded to avoid creating a large number of potentially unnecessary files, entites and elements.

❎ [Virtual Elements are excluded.](https://cap.cloud.sap/docs/cds/cdl#virtual-elements)

❎ [Abstract Entites are excluded.](https://cap.cloud.sap/docs/cds/cdl#entities)

❎ [Views and Projections are excluded.](https://cap.cloud.sap/docs/cds/cdl#views)

❎ [sap.common.CodeList entities (Countries, Currencies, Languages) are excluded by default with option to include from `Extension Settings` ](https://cap.cloud.sap/docs/cds/common#code-lists)

❎ [Entities annotated with `@cds.persistence.skip` are excluded.](https://cap.cloud.sap/docs/cds/annotations)


## Unsupported Features & Limitations
❌ Many-to-many  Relationships are not supported yet.

❌ Mock `string` values are selected from a list of `one to three` words. In case of exactly one word required(e.g. for a key element), two or three words may appear.


🎉 **Enjoy!** 
