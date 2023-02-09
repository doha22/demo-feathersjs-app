const assert = require('assert');
const app = require('../../src/app');

describe('\'ToDo\' service', () => {
  it('registered the service', () => {
    const service = app.service('ToDo');

    assert.ok(service, 'Registered the service');
  });
});
