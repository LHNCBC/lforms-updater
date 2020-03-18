// Tests for the util.js module
const assert = require('assert');
let util = require('../source/util');

describe('versionLessThan', ()=>{
  it('should detect major version differences', ()=>{
    assert(util.versionLessThan('21.1.2', '22.0.0'));
    assert(util.versionLessThan('21.1.2', '22.2.3'));
    assert(!util.versionLessThan('21.1.2', '21.1.2'));
    assert(!util.versionLessThan('22.0.0', '21.1.2'));
    assert(!util.versionLessThan('22.2.3', '21.1.2'));
  });

  it('should detect minor version differences', ()=>{
    assert(util.versionLessThan('21.2.2', '21.12.0'));
    assert(util.versionLessThan('21.1.2', '21.2.0'));
    assert(util.versionLessThan('21.1.2', '21.2.3'));
    assert(!util.versionLessThan('21.12.0', '21.2.2'));
    assert(!util.versionLessThan('21.2.0', '21.1.2'));
    assert(!util.versionLessThan('21.2.3', '21.1.2'));
  });

  it('should detect patch version differences', ()=>{
    assert(util.versionLessThan('21.1.2', '21.1.3'));
    assert(!util.versionLessThan('21.1.3', '21.1.2'));
  });
});
