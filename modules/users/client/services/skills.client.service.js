(function () {
    'use strict';

    //Send Mail service
    var app = angular.module('users');

    app.service('SkillTagService', SkillTagService);

    SkillTagService.$inject = ['$rootScope', '$http'];

    function SkillTagService($rootScope, $http) {

        var allSkillTags;

        function initSkillTags() {
            $http.get('/api/skillTags', { cache: true })
                .then(function(response) {
                    console.log(response);
                    allSkillTags = response.data[0].skills;
                });
        }

        function filterTags(query) {
            if (! allSkillTags) {
                return [{"text": "No valid skills found - just hit TAB."}];
            }
            return allSkillTags.filter(function (skill) {
                return skill.text.toLowerCase().indexOf(query.toLowerCase()) !== -1;
            });
        }

        return {
            initSkillTags: initSkillTags,
            filterTags: filterTags
        };
    }
})();
