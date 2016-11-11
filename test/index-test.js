const Lab = require('lab');
const expect = require('code').expect;

const lab = exports.lab = Lab.script();

const Testing = require('..');


lab.experiment('Testing:', () => {
    lab.suite('mockAssets', () => {
        lab.test('can make require(image) work', (done) => {
            let image = null;
            
            try {
                image = require('../image.png');
            } catch (e) {}
            expect(image).to.be.null();
            
            Testing.mockAssets();
            image = null;
            try {
                image = require('../image.png');
            } catch (e) {}
            expect(image).to.not.be.null();
            
            Testing.unmockAssets();
            image = null;
            try {
                image = require('../image.png');
            } catch (e) {}
            expect(image).to.be.null();
            
            done();
        });
    });
    
    
    lab.suite('mockDom', () => {
        lab.test('can mock out a global DOM', (done) => {
            expect(global.document).to.be.undefined();
            
            Testing.mockDom();
            
            expect(global.document).to.not.be.undefined();
            
            Testing.unmockDom();
            
            expect(global.document).to.be.undefined();
            
            done();
        });
    });
});