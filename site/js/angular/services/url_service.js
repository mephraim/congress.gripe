/**
 * @ngInject
 */
function UrlService($interpolate) {
  var MEMBER_URL_TEMPLATE = '/members/{{name}}/{{id}}';
  var STATE_URL_TEMPLATE = '/states/{{state}}';
  var STATE_DISTRICT_URL_TEMPLATE = '/states/{{state}}/district/{{district}}';
  var YOUTUBE_URL_TEMPLATE = 'https://www.youtube.com/user/{{youtubeId}}';

  return {
    getDistrictUrl: getDistrictUrl,
    getMemberUrl: getMemberUrl,
    getPhoneUrl: getPhoneUrl,
    getStateUrl: getStateUrl,
    getYouTubeUrl: getYouTubeUrl
  };

  /**
   * Returns a url for the state and district.
   * @returns {String}
   */
  function getDistrictUrl(state, district) {
    return $interpolate(STATE_DISTRICT_URL_TEMPLATE)({
      district: district,
      state: state.toLowerCase()
    });
  }

  /**
   * Returns a url for the member.
   * @returns {String}
   */
  function getMemberUrl(member) {
    return $interpolate(MEMBER_URL_TEMPLATE)({
      id: member.person.id,
      name: member.person.firstname + '+' + member.person.lastname
    });
  }

  /**
   * Returns the url for a phone number (this can be used to trigger a phone
   * call on a mobile device).
   */
  function getPhoneUrl(phoneNumber) {
    return 'tel:' + phoneNumber;
  }

  /**
   * Returns a url for the state.
   * @returns {String}
   */
  function getStateUrl(state) {
    return $interpolate(STATE_URL_TEMPLATE)({
      state: state.toLowerCase()
    });
  }

  /**
   * Returns a url for the YouTube account.
   * @returns {String}
   */
  function getYouTubeUrl(youtubeId) {
    return $interpolate(YOUTUBE_URL_TEMPLATE)({
      youtubeId: youtubeId
    });
  }
}

module.exports = UrlService;
