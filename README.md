# Edmunds JavaScript Loader

The Edmunds JavaScript Loader is a lightweight JavaScript module responsible for:

- Adding JavaScript files onto the page in an unblocking way
- Executing JavaScript code snippets immediately after all dependencies are loaded
- Executing JavaScript code snippets in a "priority" order
- Providing the ability to debug JavaScript code by loading in unminified versions
- Limiting the effect of JavaScript errors occurring within snippets

Except as otherwise noted, the Edmunds JavaScript Loader is licensed under the [Apache 2.0 License.][license]

## What's on Here

- loader.js: The JavaScript Loader core
- setup.js: The Loader setup object
- jsads.js: JavaScript logic that handles the inclusion of JavaScript ads
- LICENSE: License agreement for using this SDK
- NOTICE: A reference to the License Agreement
- README.md: You're looking at it :)

## Basic Concepts

The JavaScript Loader assumes the following:

- Every JavaScript file you reference must have three versions: file-min.js, file-debug.js and file.js (see Important Flags below)
- The Loader doesn't wait on the onload or the ondomready events. It starts working the moment loader.js is loaded and parsed at the bottom of the page
- The JavaScript ad handling was tested against DoubleClick ads only. If you're using other ad networks, you need to validate the solution for your implementation
- JavaScript snippets are blocks of JavaScript functionality that you submit to the loader's PAGESETUP object with a certain "priority."
- Snippet priorities are: high, normal and low. If you you leave the priority blank, it's assumed to be "normal." See Quick Start below for an example
- You need to keep track of the ads you render on the page as you put your page together (i.e. server-side.) Keep that tally in variable 'adcounter' (see the ad handling part of the Quick Start below)
- You need to keep track of the _JavaScript_ ads you render on the page as you put your page together (i.e. server-side.) Keep that tally in variable 'jsadcounter' _note: this number should be less or equal to adcounter_ (see the ad handling part of the Quick Start below)

#### Important Flags

- To load the unminified version of all JavaScript files, pass the following query string: ?jsflag=full
- To load the debug version of all JavaScript files, pass the following query string: ?jsflag=debug
- To disable all ads on the page, pass the following query string: ?disableallads=true
- To disable all 3rd-party components on the page, pass the following query string: ?disableallthirdparty=true
- To disable ad unit #3 on the page, pass the following query string: ?disableadnumber=3

## Quick Start

Including the JavaScript Loader onto your page is very easy. First you need to include the setup.js in the header section. The file will define the JavaScript object PAGESETUP in the DOM. You will need to configure PAGESETUP's properties with your specific requirements.

	<head>
		<script src="setup.js"></script>
		...
	</head>

At the bottom of your page, include the JavaScript Loader:

		<script src="loader.js"></script>
	</body>

Now that you have the necessary files on the page, you need to start using it. Here's how your different components can take advantage of the JavaScript Loader:

	// Tell the JavaScript Loader to add the files file1.js, file2.js and file3.js
	PAGESETUP.files.push('file1.js'); // This will load file1-min.js
	PAGESETUP.files.push('file2.js'); // This will load file2-min.js
	PAGESETUP.files.push('file3.js'); // This will load file3-min.js
	PAGESETUP.addControl(function() {
		// Do something magical!
	}, 'high');
	
As you can see from the code above, we start by including JavaScript dependencies (don't worry about duplicate files. The Loader handles that for you.) Then we add the JavaScript snippet to be executed later at the priority indicated (here we set it to "high".) Available priorities are: high, normal and low.

### iFrame Ads handling

Handling iFrame ads is as easy as adding an empty iFrame tag on the page and setting its 'src' attribute via a JavaScript snippet:

	<?php ++$adcounter; ?>
	<iframe id="AD_ID-iframe" name="AD_ID-iframe" border="0" marginwidth="0" marginheight="0" frameborder="0" height="xx" width="xx" scrolling="no"></iframe>
	<script type="text/javascript">
	    PAGESETUP.addControl(function() {
			var elem = document.getElementById('AD_ID-iframe');
	        if (elem) {
	            if(EDMUNDS && EDMUNDS.Util && EDMUNDS.Util.getQueryString) {
	                var disableall = EDMUNDS.Util.getQueryString('disableallthirdparty');
	                var disableads = EDMUNDS.Util.getQueryString('disableallads');
	                if (disableall == 'yes' || disableads == 'yes' || EDMUNDS.Util.getQueryString('disableadnumber') == <?php echo $adcounter; ?>) {
	                    return;
	                }
	            }
	             if (elem && elem.contentWindow) {
					elem.contentWindow.location.replace('http://ads.doubleclick.net/......');
				} else if (elem.contentDocument) {
					elem.contentDocument.location.replace('http://ads.doubleclick.net/......')
				}
			}
	    }, 'low');
	</script>

### JavaScript Ads handling

_note: this is tested with DoubleClick ads ONLY. You need to verify implementation if you're using other ad networks_

The problem with JavaScript ads is that they use document.write to inject their assets onto the page. As a result, we cannot really lazy-load or control when those ads are included on the page. What we can do, however, is to delay their inclusion until after the Loader has started working and right before the page is completely parsed.

To make the Loader handle your JavaScript ad inclusion on your pages, you need to include the jsads.js file right _after_ loader.js:

		<script src="loader.js"></script>
		<script src="jsads.js"></script>
	</body>

When you're building out your page, you should add the following markup where your JavaScript ad is supposed to render:

	<?php ++$adcounter; ++$jsadcounter; ?>
	<div>
		<div id="AD_ID"></div>
	</div>
	<script type="text/javascript">
		(function() {
			var sQuery = window.location.search.substr(1, window.location.search.length);
			// Make sure that ads aren't disabled
    		var mtch = sQuery.match(/(disableadnumber|disableallads|disableallthirdparty)=(\w)&?/);
    		if (mtch === null || (mtch[1] == 'disableadnumber' && mtch[2] != <?php echo $adcounter; ?>)) {
        		PAGESETUP.thirdpartyids.push('${thirdpartyId}');
        		PAGESETUP.thirdpartydetails['${thirdpartyId}'] = {};
        		PAGESETUP.thirdpartydetails['${thirdpartyId}']['type'] = 'ad';
        		PAGESETUP.thirdpartydetails['${thirdpartyId}']['src'] = 'http://ads.doubleclick.com/.......';
			})();
	</script>

You need to do that for every single JavaScript ad on your page. Then, at the very bottom of the page, add the following logic:

	<?php
	 	$len = count($jsadcounter);
		for($i=; $len < $i; $i++) {
	?>>
	<script type="text/javascript">                                            
	  	if (PAGESETUP.thirdpartyids.length > 0) {
	        (function() {
	            var id = PAGESETUP.thirdpartyids.shift();
	            var file = PAGESETUP.thirdpartydetails[id].src;
				PAGESETUP.scope = PAGESETUP.scope || {};
				PAGESETUP.scope.thirdpartyids = PAGESETUP.scope.thirdpartyids || [];
				PAGESETUP.scope.thirdpartyids.push(id+'-cache');
				PAGESETUP.scope.jsads.push(id);
				if (file) {
				    document.write('<div id="'+id+'-cache'+'" style="display:none;"><div id="'+id+'-root'+'">');
					document.write('<script type="text/javascript" src="'+file+'" ><\/script>');
				}
	        })();
	    }
	</script>
	<script type="text/javascript">
		document.write('</div></div>');
	</script>
	<?php } ?>

[license]: http://www.apache.org/licenses/LICENSE-2.0.html "Apache 2.0 License"