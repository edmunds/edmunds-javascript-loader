/**
 * Edmunds JavaScript Loader
 * 
 * Copyright © 2009-2011 Edmunds.com, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); 
 * you may not use this file except in compliance with the License.  
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, 
 * software distributed under the License is distributed on an 
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
 * either express or implied.  See the License for the specific 
 * language governing permissions and limitations under the License.
 *
 */

// Core Object.
PAGESETUP = {
	VERSION: '2.1.3', 
	queue: {
		high:[], 
		normal:[], 
		low:[]
	},
	thirdpartyids: [],
	thirdpartydetails: {},
	timer: {
		start: (new Date()).getTime(), 
		load_evt: -1
	},
	scope: {},
	execControls: function(start) {
	    if (!PAGESETUP.timer.chunk_exec_start) {PAGESETUP.timer.chunk_exec_start = (new Date()).getTime() - PAGESETUP.timer.start;}
	    var start = start || 0;
	    if (!this.merged) {
	        this.merged = PAGESETUP.queue.high;
	        this.merged = this.merged.concat(PAGESETUP.queue.normal).concat(PAGESETUP.queue.low);
	    } 
	    var merged = this.merged;
	    setTimeout(function() {
	        var item = merged.shift();
	        if (merged.length > 0) {
	            setTimeout(arguments.callee, 25);
	        } else {
	            PAGESETUP.timer.chunk_exec_end = (new Date()).getTime() - PAGESETUP.timer.start;
	        }
	        if(item){
				item.call();
			}
	    }, 0);
	},
	addControl: function(fn, priority) {
	     switch(priority) {
	         case 'high':
	            this.queue.high.push(fn);
	         break;
	         case 'low':
	            this.queue.low.push(fn);
	         break;
	         case 'normal':
	         default:
	            this.queue.normal.push(fn);
	         break;
	     }
	}
};

// Change the values below per your environment. 
PAGESETUP.urlstub1 = 'http://static.ed.edmunds-media.com/edmunds-webassets/1.14.101/yui2';
PAGESETUP.urlstub2 = 'http://static.ed.edmunds-media.com/edmunds-webassets/1.14.101/edmui'; 
PAGESETUP.default_libs = ['http://static.ed.edmunds-media.com/edmunds-webassets/1.14.101/js/utilities-min.js'];

// Files that the loader will include by default. Change to what makes sense for you.
PAGESETUP.files = [
    'stub1/json/json.js',
    'stub1/carousel/carousel.js',
    'stub1/selector/selector.js',
    'stub1/container/container.js',
    'stub1/menu/menu.js',
    'stub1/datasource/datasource.js',
    'stub1/autocomplete/autocomplete.js',
    'stub2/storage/storage.js',
    'stub2/expander/expander.js'
];

// The inidividual files that make up the default libs files. This ensures that files aren't included twice.
PAGESETUP.combined_libs = {
	'stub1/animation/animation.js': PAGESETUP.default_libs[0], 
	'stub1/animation/animation-min.js': PAGESETUP.default_libs[0],	
	'stub1/animation/animation-debug.js': PAGESETUP.default_libs[0],
	'stub1/yahoo/yahoo.js': PAGESETUP.default_libs[0], 
	'stub1/yahoo/yahoo-min.js': PAGESETUP.default_libs[0],	
	'stub1/yahoo/yahoo-debug.js': PAGESETUP.default_libs[0],
	'stub1/event/event.js': PAGESETUP.default_libs[0], 
	'stub1/event/event-min.js': PAGESETUP.default_libs[0],	
	'stub1/event/event-debug.js': PAGESETUP.default_libs[0],
	'stub1/dom/dom.js': PAGESETUP.default_libs[0], 
	'stub1/dom/dom-min.js': PAGESETUP.default_libs[0],	
	'stub1/dom/dom-debug.js': PAGESETUP.default_libs[0],
	'stub1/connection/connection.js': PAGESETUP.default_libs[0], 
	'stub1/connection/connection-min.js': PAGESETUP.default_libs[0],	
	'stub1/connection/connection-debug.js': PAGESETUP.default_libs[0],
	'stub1/dragdrop/dragdrop.js': PAGESETUP.default_libs[0], 
	'stub1/dragdrop/dragdrop-min.js': PAGESETUP.default_libs[0],	
	'stub1/dragdrop/dragdrop-debug.js': PAGESETUP.default_libs[0],
	'stub1/element/element.js': PAGESETUP.default_libs[0], 
	'stub1/element/element-min.js': PAGESETUP.default_libs[0],	
	'stub1/element/element-debug.js': PAGESETUP.default_libs[0], 
	'stub1/get/get.js': PAGESETUP.default_libs[0], 
	'stub1/get/get-min.js': PAGESETUP.default_libs[0],	
	'stub1/get/get-debug.js': PAGESETUP.default_libs[0], 
	'stub1/yuiloader/yuiloader.js': PAGESETUP.default_libs[0], 
	'stub1/yuiloader/yuiloader-min.js': PAGESETUP.default_libs[0],	
	'stub1/yuiloader/yuiloader-debug.js': PAGESETUP.default_libs[0], 
	'stub1/selector/selector.js': PAGESETUP.default_libs[0], 
	'stub1/selector/selector-min.js': PAGESETUP.default_libs[0],	
	'stub1/selector/selector-debug.js': PAGESETUP.default_libs[0],
	'stub1/json/json.js': PAGESETUP.default_libs[0], 
	'stub1/json/json-min.js': PAGESETUP.default_libs[0],	
	'stub1/json/json-debug.js': PAGESETUP.default_libs[0],
	'stub1/carousel/carousel.js': PAGESETUP.default_libs[0], 
	'stub1/carousel/carousel-min.js': PAGESETUP.default_libs[0],	
	'stub1/carousel/carousel-debug.js': PAGESETUP.default_libs[0],
	'stub1/tabview/tabview.js': PAGESETUP.default_libs[0], 
	'stub1/tabview/tabview-min.js': PAGESETUP.default_libs[0],	
	'stub1/tabview/tabview-debug.js': PAGESETUP.default_libs[0],
	'stub1/container/container.js': PAGESETUP.default_libs[0], 
	'stub1/container/container-min.js': PAGESETUP.default_libs[0],	
	'stub1/container/container-debug.js': PAGESETUP.default_libs[0],
	'stub1/menu/menu.js': PAGESETUP.default_libs[0], 
	'stub1/menu/menu-min.js': PAGESETUP.default_libs[0],	
	'stub1/menu/menu-debug.js': PAGESETUP.default_libs[0],
	'stub1/datasource/datasource.js': PAGESETUP.default_libs[0], 
	'stub1/datasource/datasource-min.js': PAGESETUP.default_libs[0],	
	'stub1/datasource/datasource-debug.js': PAGESETUP.default_libs[0],
	'stub1/autocomplete/autocomplete.js': PAGESETUP.default_libs[0], 
	'stub1/autocomplete/autocomplete-min.js': PAGESETUP.default_libs[0],	
	'stub1/autocomplete/autocomplete-debug.js': PAGESETUP.default_libs[0],
	'stub1/yahoo-dom-event/yahoo-dom-event.js': PAGESETUP.default_libs[0],
	'stub2/edmunds/edmunds.js': PAGESETUP.default_libs[0], 
	'stub2/edmunds/edmunds-min.js': PAGESETUP.default_libs[0], 
	'stub2/storage/storage.js': PAGESETUP.default_libs[0], 
	'stub2/storage/storage-min.js': PAGESETUP.default_libs[0],
	'stub2/expander/expander.js': PAGESETUP.default_libs[0], 
	'stub2/expander/expander-min.js': PAGESETUP.default_libs[0]
};

// The inidividual files that make up default_libs. This is used for debugging purposes (?jsflag=full) instead of calling in utilities.js
PAGESETUP.breakdown_libs = [
	'stub1/yahoo/yahoo.js',
    'stub1/dom/dom.js', 
    'stub1/event/event.js', 
    'stub1/connection/connection.js', 
    'stub1/animation/animation.js', 
    'stub1/element/element.js', 
    'stub1/get/get.js', 
    'stub1/yuiloader/yuiloader.js', 
	'stub1/selector/selector.js', 
	'stub1/json/json.js',
	'stub1/carousel/carousel.js', 
	'stub1/tabview/tabview.js', 
	'stub1/container/container.js', 
	'stub1/menu/menu.js', 
	'stub1/datasource/datasource.js', 
	'stub1/autocomplete/autocomplete.js', 
	'stub1/yahoo-dom-event/yahoo-dom-event.js', 
    'stub2/edmunds/edmunds.js', 
	'stub2/storage/storage.js', 
	'stub2/expander/expander.js'
];

// Get the time when the onload is fired!
window.onload = function() {
	PAGESETUP.timer.load_evt = (new Date()).getTime() - PAGESETUP.timer.start;
};