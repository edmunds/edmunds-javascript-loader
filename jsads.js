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
<script type="text/javascript">
    (function() {
        var query_vars = {};
        PAGESETUP.scope.jsads = [];
        function _getQueryString(elem) {
            if (!query_vars.length) {
                var aArgsTemp, aTemp, sQuery;
                sQuery = window.location.search.substr(1, window.location.search.length);
                if(sQuery.length < 1) {
                    return '';
                }

                aArgsTemp = sQuery.split("&");
                for(var i=0 ; i<aArgsTemp.length; i++) {
                    aTemp = aArgsTemp[i].split("=");
                    query_vars[aTemp[0]] = aTemp[1];
                }
            }
            return query_vars[elem];
        }
        
        function _addListener(el, eType, fn, uC) {
            if (el.addEventListener) {
                el.addEventListener(eType, fn, uC);
                    return true;
                } else if (el.attachEvent) {
                    return el.attachEvent('on' + eType, fn);
                } else {
                el['on' + eType] = fn;
            }
        }
        _addListener(window, 'load', function() {
            if (_getQueryString('jstimer') == 'yes') {
                var jstimer = document.getElementById('js-timer-div');
                if (jstimer) {
                    jstimer.innerHTML = 'Loader Chunk Exec Started:'+PAGESETUP.timer.chunk_exec_start+'<br />HTML is Parsed (after ad inclusion):'+PAGESETUP.timer.html+'<br />onload Event:'+PAGESETUP.timer.load_evt;
                }
            }

			var elems = PAGESETUP.scope.jsads;
            var cnt = elems.length;
            for (var i=0; i<cnt; i++) {
                var dest = document.getElementById(elems[i]);
                var src = document.getElementById(elems[i]+'-cache');
                if (dest && src) {
                    var rt = document.getElementById(elems[i]+'-root');
                    if (rt) {
                        var jstags = rt.getElementsByTagName ('script');
                        if (jstags && jstags[0]) {
                            rt.removeChild(jstags[0]);
                        }
                    }
                    if (src.style.height == '0px') {
                        dest.parentNode.parentNode.removeChild(dest.parentNode);
                        src.parentNode.removeChild(src);
                    } else {
                        dest.appendChild(src);
                        src.style.display = '';
                    }
                }
            }
            if (document.getElementById('pushdown_open') && PAGESETUP.scope.customadparam) {
                var exp_pushdown_open = new EDMUNDS.Expander;	
            	var ck = EDMUNDS.Cookie.get('CUSTOMAD');
            	if (ck && ck == 'viewed') {
            	    exp_pushdown_open.init('pushdown_open', 0, 'Click to Expand', 0);
            	    var mask = YAHOO.util.Dom.getElementsByClassName('mask', 'div', 'pushdown_open');
            	    if (mask && mask[0]) {
            	        mask[0].style.display = 'none';
            	        mask[0].style.height = '0px';
            	    }
            	    exp_pushdown_open.close();
            	} else {
                   EDMUNDS.Cookie.set('CUSTOMAD', 'viewed', {expires: new Date(new Date().getTime() + 60*1000*PAGESETUP.scope.customadparam.ck_life), path: '/'});
            	   exp_pushdown_open.init('pushdown_open', 0, 'Click to Expand');
               	   setTimeout(function(){exp_pushdown_open.close();}, PAGESETUP.scope.customadparam.delay*1000);
            	}
            }
        }, false);
  	})();
</script>