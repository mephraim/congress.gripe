require('../site/js/angular/app.js');

var angular = require('angular');
require('angular-mocks');

describe('SearchService', function() {
  var service;

  beforeEach(angular.mock.module('CongressApp'));

  beforeEach(angular.mock.inject(function(SearchService) {
    service = SearchService;
  }));

  describe('isValidAddressSearch', function() {
    it('returns true for queries with >= 3 words', function() {
      expect(service.isValidAddressSearch('150 North Chicago')).toBeTruthy();
    });

    it('returns false for queries with < 3 words', function() {
      expect(service.isValidAddressSearch('Chuck Grassley')).toBeFalsy();
    });

    it('returns false for empty strings', function() {
      expect(service.isValidAddressSearch('')).toBeFalsy();
    });

    it('returns false for undefined strings', function() {
      expect(service.isValidAddressSearch()).toBeFalsy();
    });
  });

  describe('isValidNameSearch', function() {
    it('returns true for queries with <= 4 words', function() {
      expect(service.isValidNameSearch('Mr. Chuck Grassley Jr.')).toBeTruthy();
    });

    it('returns false for queries with > 4 words', function() {
      expect(service.isValidNameSearch('This is more than 4 words')).toBeFalsy();
    });

    it('returns false for empty string', function() {
      expect(service.isValidNameSearch('')).toBeFalsy();
    });

   it('returns false for undefined strings', function() {
      expect(service.isValidNameSearch()).toBeFalsy();
    });
  });

  describe('isValidStateSearch', function() {
    it('returns false for an empty string', function() {
      expect(service.isValidStateSearch('')).toBeFalsy();
    });

    it('returns false for an undefined string', function() {
      expect(service.isValidStateSearch()).toBeFalsy();
    });

    it('returns true for a state abbreviation', function() {
      expect(service.isValidStateSearch('IA')).toBeTruthy();
    });

    it('returns true for a state name', function() {
      expect(service.isValidStateSearch('Iowa')).toBeTruthy();
    });
  });

  describe('isValidZipcodeSearch', function() {
    it('returns false for an empty string', function() {
      expect(service.isValidZipcodeSearch('')).toBeFalsy();
    });

    it('returns false for an undefined string', function() {
      expect(service.isValidZipcodeSearch()).toBeFalsy();
    });

    it('returns false for a non-number string', function() {
      expect(service.isValidZipcodeSearch('not number')).toBeFalsy();
    });

    it('returns false for a number that is too short to be a zipcode', function() {
      expect(service.isValidZipcodeSearch(30)).toBeFalsy();
    });

    it('returns false for a string that is too long to be a zipcode', function() {
      expect(service.isValidZipcodeSearch(300000)).toBeFalsy();
    });

    it('returns false for a string that has non-numeric characters in it', function() {
      expect(service.isValidZipcodeSearch('4432 zip')).toBeFalsy();
    });

    it('returns true for a string that can be turned into a zipcode', function() {
      expect(service.isValidZipcodeSearch('00101')).toBeTruthy();
    });

    it('returns true for a number that could be a valid zipcode', function() {
      expect(service.isValidZipcodeSearch(50010)).toBeTruthy();
    });
  });
});
