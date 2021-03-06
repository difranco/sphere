(function($) {

	$(document).ready(function() {

    /** Instantsearch stuff */
    const APPLICATION_ID = 'ITI5JHZJM9';
    const SEARCH_ONLY_API_KEY = '5828bf68d90dbb0251e6ce88aabe2e07';
    const INDEX_NAME = 'diybiosphere';

    const EMPTY_TEMPLATE =
      '<div class="text-center">No results found matching <strong>{{query}}</strong>.</div>';

    const HIT_TEMPLATE = `
		<div class="ui link relaxed items">
			<div class="item">
			  <div class="ui small image">
			    <img class="ui middle aligned" src="{{ logo }}" alt="logo">
			  </div>
			  <div class="content">
				<span class="right floated"><i class="marker icon"></i>{{ city }}, {{#country}} {{ country }} {{/country}}</span>
			    <a href="{{url}}" class="header">{{{ _highlightResult.title.value }}}</a>
			    <div class="meta">
			      <span class="cinema"> {{#collection}} {{collection}} {{/collection}}| {{#type-org}} {{ type-org }} {{/type-org}} </span>
			    </div>
			    <div class="description">
			      <p>{{{ _highlightResult.text.value }}}</p>
			    </div>
			    <div class="extra">
			    <div class="ui tiny label">{{ tags }}</div>
			    </div>
			  </div>
			</div>
			<hr>
		</div>
    `;

    let search = instantsearch({
      appId: APPLICATION_ID,
      apiKey: SEARCH_ONLY_API_KEY,
      indexName: INDEX_NAME,
      urlSync: true
    });

    search.addWidget(
      instantsearch.widgets.searchBox({
        container: '#search-box',
        placeholder: 'Search for an entry',
				cssClasses: {
					root: 'ui icon left input fluid'
				},
			})
    );

    search.addWidget(
      instantsearch.widgets.currentRefinedValues({
        container: '#current-refined-values',
				autoHideContainer: true,
				cssClasses: {
					root: 'ui medium labels',
        },
				templates: {
					item: `
					<a class="ui grey label">
					  {{name}}
					  <i class="delete icon"></i>
					</a>`
        },
      })
    );

    search.addWidget(
      instantsearch.widgets.stats({
        container: '#stats-container',
				templates: {
					body: ` <h3 class="ui header">{{nbHits}} matching entries</h3>`
				},
      })
    );

    search.addWidget(
      instantsearch.widgets.hits({
        container: '#hits-container',
        templates: {
          empty: EMPTY_TEMPLATE,
          item: HIT_TEMPLATE
        },
				cssClasses: {
					root: 'ui divided items'
				},
        hitsPerPage: 3
      })
    );

    search.addWidget(
      instantsearch.widgets.refinementList({
        container: '#collection',
        attributeName: 'collection',
        operator: 'or',
        limit: 10,
        cssClasses: {
					root: 'ui secondary inverted vertical menu',
					item: 'link item',
					active: 'active item'
        },
        templates: {
          header: `<h4 class="ui inverted header">Collection</h4>`,
          item: `
						  {{name}} - {{count}}
						`
        },
      })
    );

    search.addWidget(
      instantsearch.widgets.refinementList({
        container: '#type-org',
        attributeName: 'type-org',
        operator: 'or',
        limit: 10,
				cssClasses: {
					root: 'ui secondary inverted vertical menu',
					item: 'link item',
					active: 'active item'
        },
        templates: {
          header: `<h4 class="ui inverted header">Type of Initiative</h4>`,
          item: `
						{{name}} - {{count}}
					`
        }
      })
    );


    search.addWidget(
      instantsearch.widgets.refinementList({
        container: '#tags',
        attributeName: 'tags',
				operator: 'or',
				limit: 10,
				searchForFacetValues: {
					placeholder: 'Search for keywords'
				},
				cssClasses: {
					root: 'ui labels',
					item: 'ui label xo paddingfull half',
					active: 'ui grey label xo paddingfull half'
        },
        templates: {
          header: `<h4 class="ui inverted header">Keywords</h4>`,
          item: `{{name}} - {{count}}`
        }
      })
    );

    search.addWidget(
      instantsearch.widgets.pagination({
        container: '#pagination-container',
				labels: {
					previous: '<i class="fa fa-angle-left"></i>',
					next: '<i class="fa fa-angle-right"></i>',
					first: '<i class="fa fa-double-angle-left"></i>',
					last: '<i class="fa fa-double-angle-right"></i>',
				},
        padding: 1, //number of pages on each side
        cssClasses: {
					root: 'ui horizontal link list no-bullets',
          item: 'item',
          active: 'active item',
          disabled: 'disabled item'
        }
      })
    );

    search.addWidget(
      instantsearch.widgets.hitsPerPageSelector({
        container: '#hits-per-page-selector',
        cssClasses: {
          root: 'ui inline dropdown'
        },
        options: [
          {value: 5, label: '5 per page'},
          {value: 10, label: '10 per page'},
          {value: 25, label: '25 per page'},
          {value: 50, label: '50 per page'},
          {value: 100, label: '100 per page'}
        ]
      })
    );

    search.addWidget(tableWidget());

    search.start();

    search.on('render', () => {
       // Set icon depending of collection
      $('.collection-icon').each((idx, el) => {
        let $el = $(el);
        let dataCollection = $el.data('collection');
      	if(dataCollection === 'Lab') $el.addClass('lab');
      	if(dataCollection === 'Group') $el.addClass('users');
      	if(dataCollection === 'Event') $el.addClass('ticket');
      	if(dataCollection === 'Other') $el.addClass('umbrella');
      	if(dataCollection === 'Project') $el.addClass('travel');
      	if(dataCollection === 'Network') $el.addClass('share alternate');
      	if(dataCollection === 'Startup') $el.addClass('rocket');
      	if(dataCollection === 'Incubator') $el.addClass('leaf');
    	});
    });

    function tableWidget() {
      let tableWidget = {
        getConfiguration: searchParams => {},
        init: options => {},
        render: options => {
          console.log('tableWidget render options: ', options);
          let hits = options.results.hits;
          var data = [];
          $table.rows().remove();
          $table.rows.add(hits).draw(); // add data and 'refresh' the table.
        }
      };
      return tableWidget;
    }

		/**
		 * This DataTable will contain all the info from all collections accross the
		 * site, they're stored in a json file and the table will be populated via
		 * ajax.
		 *
		 * Params details:
		 *   "dom": https://datatables.net/reference/option/dom
		 *   "buttons": dataTable.buttons @see https://datatables.net/extensions/buttons/
		*/
		var $table = $('#library-table').DataTable({
			"paging": false,
			"ordering": true,
			"dom": '<"top"i<"pull-right"B>>rt<"bottom"ip<"clear">>',
			"buttons": [{
				extend: 'csvHtml5',
				text: '<i class="fa fa-download"></i> Download as CSV',
				titleAttr: 'CSV',
				className: 'link selectable text-dark'
			}],
			"columnDefs": [
				{
					"visible": true,
					"targets": 0,
					"name": "collection",
					"data": "collection"
				},
				{
					"visible": true,
					"targets": 1,
					"name": "title",
					"data": "title",
					"render": function(data, type, row) {
            return `<a class="link selectable" href="${row.url}">${data}</a>`;
					}
				},
				{
					"visible": true,
					"targets": 2,
					"name": "start-date",
					"data": "start-date"
				},
        {
					"visible": true,
					"targets": 3,
					"name": "host-org",
					"data": "host-org",
					"render": function(data, type, row) {
						// host name, web page and sphere page links
						var name = '', web = '', sphere = '';
						if(data !== null) {
							name = data.name || '';
							if(data.web !== null) {
								web = `
                  <a class="link selectable" href="${data.web}">
                    <i class="fa fa-link"></i>
                  </a>
                `;
							}
							if(data.sphere !== null) {
								sphere = `
                  <a class="link selectable" href="${data.sphere}">
                    <i class="fa fa-external-link"></i>
                  </a>
                `;
							}
							return `${name} ${web} ${sphere}`;
						} else return '';
					}
				},
        {
					"visible": true,
					"targets": 4,
					"name": "type-org",
					"data": "type-org"
				},
				{
					"visible": true,
					"targets": 5,
					"name": "city",
					"data": "city"
				},
				{
					"visible": true,
					"targets": 6,
					"name": "country",
					"data": "country"
				},
        {
					"visible": true,
					"targets": 7,
					"name": "lastest-commit",
					"data": "last_modified"
				},
				{
					"visible": true,
					"targets": 8,
					"name": "tags",
					"data": "tags",
          "render": (data, type, row) => `${data.join(',')}`
				}
			],
			"language": {
				"thousands": ",",
				"zeroRecords": "Nothing found - sorry",
				"info": "Showing _TOTAL_ entries",
				"infoEmpty": "Showing _TOTAL_ entries",
				"infoFiltered": "from _MAX_ total"
			}
		});

		$('#entries tfoot td').each( function () {
			let $this = $(this)
			let title = $this.text();
			let id = title.toLowerCase();
			$this.html( `<input id="${id}" type="text" placeholder="Search ${title}" />` );
		});

		// Apply the search
		$table.columns().every( function () {
			var _this = this;
			$( 'input', this.footer() ).on( 'keyup change', function () {
				if(_this.search() !== this.value) {
					_this
						.search( this.value )
						.draw();
				}
			});
		});

	}); // end document ready

})($);
