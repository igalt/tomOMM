'use strict';

describe('Registrations E2E Tests:', function () {
  describe('Test Registrations page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/registrations');
      expect(element.all(by.repeater('registration in registrations')).count()).toEqual(0);
    });
  });
});
