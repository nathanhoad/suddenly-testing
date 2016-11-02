# Suddenly Testing

A few helpers for testing Suddenly apps.


## Usage

```javascript
const Testing = require('suddenly-testing');


// Truncates all non-migration tables
Testing.emptyDatabase(knex); // Assuming knex is an initialized Knex instance


// Mocks out a Redux store
Testing.mockStore(state);
// or
Testing.mockStore(Immutable.fromJS({
    is_loading: false,
    things: {}
}));


// Mocks out calls to `require` for images and css files
// so that React components can require them and not fail in tests
Testing.mockAssets();
Testing.unmockAssets();


// Get a UUID
Testing.uuid();
```