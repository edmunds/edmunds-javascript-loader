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

(function() {
    try {
        var VERSION = '2.1.3';
        var head = document.getElementsByTagName('head')[0];
        
        // Check the integrity of PAGESETUP
        if (!window.PAGESETUP) throw 'Edmunds UI Loader: PAGESETUP global variable is not defined';
        if (typeof window.PAGESETUP != 'object') throw 'Edmunds UI Loader: PAGESETUP global variable is not an object';
        if (!PAGESETUP.files) PAGESETUP.files = [];
        if (!PAGESETUP.loaded) PAGESETUP.loaded = false;
        if (!PAGESETUP.query_vars) PAGESETUP.query_vars = {};
		if (!PAGESETUP.default_libs) PAGESETUP.default_libs = [];
        if (!PAGESETUP.jsdownloaded) PAGESETUP.jsdownloaded = 0;
        if (!PAGESETUP.urlstub1) throw 'Edmunds UI Loader: PAGESETUP requires a YUI CDN to be defined in PAGESETUP.urlstub1';
        if (!PAGESETUP.urlstub2) throw 'Edmunds UI Loader: PAGESETUP requires a EDMUI CDN to be defined in PAGESETUP.urlstub2';

		// Browsers
		var isIE = (navigator.userAgent.toLowerCase().indexOf('msie') !== -1);
		var isFF3 = (navigator.userAgent.match(/firefox\/3\./i) != null);
        var isBB = (navigator.userAgent.toLowerCase().indexOf('blackberry') !== -1);

        // Check if the page already has a loader instance running
        if (PAGESETUP.loaded) {
            return;
        }
        PAGESETUP.loadedfiles = {};
    
        /**
         *    Parse the JavaScript file array one file at a time and recursively call the function until the array is empty
         *
         *    @param    void
         *    @return    void
         */
        function load() {
            // Get reference to this function in this scope
            var parent = arguments.callee;
            // If there is still a file to be loaded
            if (unique_files.length) {
                // pop a file from the array
                var file = unique_files.shift();
				// 2.1.3 UPDATE FOR UNOBFUSCATING THE URLs
				file = file.replace(/\|/g, '/').replace(/\;/g, '.');
				// Add the file to the list of files processed so it doesn't get included again
                PAGESETUP.loadedfiles[file] = 'loaded';
                
				// If the file does not start with http (i.e. absolutely referenced file)
 				if (file.indexOf('http') !== 0) {
                 	// read the flad
	                 var flag = flag || getQS('jsflag');
                 
	                 // EDMUI files
	                 if (file.indexOf('stub2') !== -1) {
	                     file = file.replace(/stub2/, PAGESETUP.urlstub2);
	                 } else if (file.indexOf('stub1') !== -1) { // YUI files
	                     file = file.replace(/stub1/, PAGESETUP.urlstub1);
	                 }
                 
	                 // The file is not utilities and no flag is set
	                 if (!flag && file.indexOf('utilities') === -1) {
	                     file = file.replace(/\.js/, '-min.js');
	                 } else if (flag == 'debug' && file.indexOf('utilities') === -1) { //The file is not utilities and a flag is set to debug
	                        file = file.replace(/\.js/, '-debug.js');
	                 }
				}
                 // include the file
                 var js = document.createElement('script');
                 js.type = 'text/javascript';
                 
             	// If this is IE, load files sequentially
           		if (isIE) {
           		    js.src = file;
                	js.onreadystatechange = function() {
                    	if (this.readyState == 'complete' || this.readyState == 'loaded' || this.status == 304 || this.status == 404) {
                        	parent();
                       	}
                  	};
             		head.appendChild(js);
                } else if(js.async) {
                    js.async = false;
                    js.src = file;
                    if(unique_files.length < 1) {
                        js.onload = function(){parent();};
                    }
                    head.appendChild(js);
                    if(unique_files.length) {
                        parent();
                    }
                } else {
                // Otherwise, load them in parallel
                    js.src = file;
                    document.body.appendChild(js);
                    if ((isFF3 && unique_files.length) || (isBB)) {
                    	parent();
                  	} else { // If this is the last file, execute the chunks when it's done loading
                    	js.onload = function() {
                            parent();
                      	};
                        js.onerror = function() {
                        	parent();
                     	};
                 	}
            	}
            } else { // No file is left to load, execute the JS chunks
				PAGESETUP.loaded = true;
                if (PAGESETUP.execControls) {
                    PAGESETUP.execControls();
                }
            }
        }
    
        /**
         *    Retrieve the value of a query string variable
         *
         *    @param    string    elem    Query string variable
         *    @return    string    Value of the query string variable
         */
        function getQS(elem) {
            if (!PAGESETUP.query_vars.length) {
                var aArgsTemp, aTemp, sQuery;
                sQuery = window.location.search.substr(1, window.location.search.length);
                // Check that query string exists and contains data
                // If not (length < 1) then return
                if(sQuery.length < 1) {
                    return '';
                }
                aArgsTemp = sQuery.split("&");
                for(var i=0 ; i<aArgsTemp.length; i++) {
                    aTemp = aArgsTemp[i].split("=");
                    PAGESETUP.query_vars[aTemp[0]] = aTemp[1];
                }
            }
            return PAGESETUP.query_vars[elem];
        }
    
        /**
		 *	Parse out the duplicate values in an array
		 *
		 *	@param	array	arr		Original array to parse
	     *	@return	array			Unique valued array
	     */
	    function unique(arr) {
			var tmp_cache = {};
			var new_arr = [];
			var len = arr.length;
			for (var i=0; i<len; i++) {
				if (!tmp_cache[arr[i]] && !tmp_cache[combined_libs[arr[i]]]) {
					new_arr.push(arr[i]);
					tmp_cache[arr[i]] = 1;
				}
			}
			tmp_cache = null; // gc
			return new_arr;
		}
		
		// Javascript files whose logic is part of another, bigger file
		var combined_libs = PAGESETUP.combined_libs || {};
		
       
		// In debug mode, call in the individual files that make up YUI's utilities.js
        var edmui_util_breakdown_full = PAGESETUP.breakdown_libs || [];
        // Get the flag value
        var flag = getQS('jsflag');
        // If the flag is set, use the breakdown list of base files
        if (flag == 'full' || flag == 'debug') {
            var load_files = edmui_util_breakdown_full.concat(PAGESETUP.files);
            
        } else { // Otherwise, include YUI utilities and EDMUI core before the rest of the files requested
            var load_files = PAGESETUP.default_libs.concat(PAGESETUP.files);
        }
		// Filter the files array from duplicate values
		var unique_files = unique(load_files);
		// Load away!
		load();

    }
    // An error happened!
    catch(e) {
		throw new Error("EDMUI Loader Error: " + e);
    }
})();