"use strict";!function(o){o(".menu .item").tab(),o(".tabular.menu .item").tab(),docsearch({apiKey:"3fbbeadab8062263c32927092022ff52",indexName:"diybio",inputSelector:"#docsearch",debug:!1}),o(function(){window.location.pathname.includes("introduction")&&o("#introP").collapse("show"),window.location.pathname.includes("about")&&o("#aboutP").collapse("show"),window.location.pathname.includes("copyright")&&o("#copyrightP").collapse("show"),window.location.pathname.includes("basics")&&o("#basicsP").collapse("show"),window.location.pathname.includes("support")&&o("#supportP").collapse("show"),window.location.pathname.includes("tutorials")&&o("#tutorialsP").collapse("show"),window.location.pathname.includes("resources")&&o("#resourcesP").collapse("show"),o(".accordions").find('.panel-heading a[data-toggle="collapse"]').removeClass("actives"),o(".closeall").click(function(){o(".panel-collapse.in").collapse("hide")}),o(".openall").click(function(){o('.panel-collapse:not(".in")').collapse("show")})})}($);