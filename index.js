const Module = require('module');

const configureStore = require('redux-mock-store').default;
const Thunk = require('redux-thunk').default;
const mockStore = configureStore([Thunk]);
const jsdom = require('jsdom');

const Gimmea = require('gimmea');
const KnexCleaner = require('knex-cleaner');


// Mock out `require()` to fake CSS and images
var originalLoader = Module._load;
function mockedLoader (path, parent, is_main) {
    if (path.match(/\.(png|jpg|jpeg|gif|mp4|m4v|flv|mp3|wav|m4a|ogg|ogv|ogm|webm)$/)) {
        return {};
    }
    
    if (path.match(/\.css$/)) {
        return new Proxy({}, {
            get: (styles, method) => {
                return method;
            }
        });
    }
    
    return originalLoader(path, parent, is_main);
}
    
    
const Testing = {
    _mockedAssets: false,
    _mockedDom: false,
    
    
    emptyDatabase (knex) {
        return KnexCleaner.clean(knex, { ignoreTables: ['schema_migrations', 'schema_migrations_lock'] });
    },
    
    
    mockStore (state) {
        return mockStore(state);
    },
    
    
    mockDom (url) {
        if (Testing._mockedDom) return;
        
        url = url || 'http://example.com';
        
        var document = jsdom.jsdom('');
        var window = document.defaultView;
        
        // Set up the document.location bits
        jsdom.changeURL(window, url);
        var url_bits = url.match(/^(https?\:)\/\/([^\:\/])+(\:\d+)?/);
        document.location.scheme = url_bits[1];
        document.location.hostname = url_bits[2];
        document.location.port = url_bits[3] || '';
        
        global.document = document;
        global.window = window;
        global.navigator = {
            userAgent: 'node.js'
        };
        
        Testing._mockedDom = true;
    },
    
    
    unmockDom () {
        if (!Testing._mockedDom) return;
        
        delete global['document'];
        delete global['window'];
        
        Testing._mockedDom = false;
    },
    
    
    mockAssets () {
        if (Testing._mockedAssets) return;
        
        Module._load = mockedLoader;
        Testing._mockedAssets = true;
    },
    
    
    unmockAssets () {
        if (!Testing._mockedAssets) return;
        
        Module._load = originalLoader;
        Testing._mockedAssets = false;
    },
    
    
    uuid () {
        return Gimmea.uuid();
    }
}


module.exports = Testing;