# couchbase-compare
> NodeJS tool to compare and transfer views between Couchbase Server (v2.5) Clusters.

## Usage

Update `config/defaut.json` with your preferred source and target Host / bucket names.
Optionally run in `dry-run` mode which prints the design documents to the console instead of copying design documents to target.

```js
node src/compare.js
```