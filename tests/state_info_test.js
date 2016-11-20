var StateInfo = require('../site/js/lib/state_info.js');

describe('StateInfo', function() {
  describe('getAbbreviation', function() {
    it('returns the abbreviation for a state based on the name', function() {
      expect(StateInfo.getAbbreviation('Iowa')).toEqual('IA');
      expect(StateInfo.getAbbreviation('California')).toEqual('CA');
    });
  });

  describe('getName', function() {
    it('returns the full name of a state based on the abbreviation', function() {
      expect(StateInfo.getName('IA')).toEqual('Iowa');
      expect(StateInfo.getName('CA')).toEqual('California');
    });
  });

  describe('getFontClass', function() {
    it('returns a font class for a state abbreviation', function() {
      expect(StateInfo.getFontClass('ia')).toEqual('state-face-ia');
    });

    it('returns a font class for a state name', function() {
      expect(StateInfo.getFontClass('iowa')).toEqual('state-face-ia');
    });
  });

  describe('isState', function() {
    it('returns true for a valid state abbreviation', function() {
      expect(StateInfo.isState('IA')).toBeTruthy();
    });

    it('returns false for an invalid state abbreviation', function() {
      expect(StateInfo.isState('ZZ')).toBeFalsy();
    });

    it('returns true for a valid state name', function() {
      expect(StateInfo.isState('Iowa')).toBeTruthy();
    });

    it('returns false for a invalid state name', function() {
      expect(StateInfo.isState('Bad')).toBeFalsy();
    });
  });

  describe('isStateAbbreviation', function() {
    it('returns true for a valid state abbreviation', function() {
      expect(StateInfo.isStateAbbreviation('ia')).toBeTruthy();
    });

    it('returns false for an invalid state abbreviation', function() {
      expect(StateInfo.isStateAbbreviation('zz')).toBeFalsy();
    });
  });

  describe('isStateName', function() {
    it('returns true for a valid state name', function() {
      expect(StateInfo.isStateName('iowa')).toBeTruthy();
    });

    it('returns false for an invalid state name', function() {
      expect(StateInfo.isStateName('bad')).toBeFalsy();
    });
  });
});
