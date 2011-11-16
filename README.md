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
	PAGESETUP.files.push('file1.js');
	PAGESETUP.files.push('file2.js');
	PAGESETUP.files.push('file3.js');
	PAGESETUP.addControl(function() {
		// Do something magical!
	}, 'high');
	
As you can see from the code above, we start by including JavaScript dependencies (don't worry about duplicate files. The Loader handles that for you.) Then we add the JavaScript snippet to be executed later at the priority indicated (here we set it to "high".) Available priorities are: high, normal and low.

[license]: http://www.apache.org/licenses/LICENSE-2.0.html "Apache 2.0 License"