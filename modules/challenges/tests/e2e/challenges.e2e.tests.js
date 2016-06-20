'use strict';

describe('Challenges E2E Tests:', function () {
  describe('Test Challenges page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/challenges');
      expect(element.all(by.repeater('challenge in challenges')).count()).toEqual(0);
    });
  });
});
