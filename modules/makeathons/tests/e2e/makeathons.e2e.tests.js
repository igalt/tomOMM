'use strict';

describe('Makeathons E2E Tests:', function () {
  describe('Test Makeathons page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/makeathons');
      expect(element.all(by.repeater('makeathon in makeathons')).count()).toEqual(0);
    });
  });
});
