# multi-perfbudget-grunt
This Grunt file provides a means to implement a performance budget for a web project that combines WebPageTest, Google Pagespeed and YSlow across multiple pages.
See [http://timkadlec.com/2013/01/setting-a-performance-budget/](http://timkadlec.com/2013/01/setting-a-performance-budget/) for more on performance budgets.
This file uses grunt-perfbudget, grunt-pagespeed and grunt-yslow.

##Installation
Dependencies are installed with:

	npm install phantomjs -g
	npm install

Note that phantom needs to be installed globally due to this issue: [https://github.com/andyshora/grunt-yslow/issues/9](https://github.com/andyshora/grunt-yslow/issues/9)

##Grunt tasks
**webpagetest:**
Runs webpagetest and applies thresholds

**yslow:**
Runs yslow and applies thresholds

**pagespeed:**
Runs Google Pagespeed and applies thresholds

**default:**
Runs all three of the above

Any threshold that fails to be met will terminate the Grunt run unless --force is set when 
Grunt is invoked.

##Configuration
Note that each configuration file defines its own set of pages (urls) to test.
The following configuration files are expected to exist in the same directory as gruntfile.js:

###webpagetest.json
Defines the WebPageTest tests to run and performance thresholds. Must contain a 'default' data structure that is the same as defined for grunt-perfbudget (https://github.com/tkadlec/grunt-perfbudget), with the exception that 'url' is not required.

The json must also include one or more other structures that define the test(s) to run.

These use the same structure as grunt-perfbudget to define overrides to the definition in 'default'. As such, a 'url' must be provided. A 'title' can also be provided to display along with test result output.
(When [https://github.com/tkadlec/grunt-perfbudget/issues/10](https://github.com/tkadlec/grunt-perfbudget/issues/10) is implemented, this json format will fall in line with grunt-perfbudget completely).

Example:

	{
		"default": {
			"options": {
				"key": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
				"wptInstance": "www.webpagetest.org",
				"location": "Wellington:Chrome",
				"timeout": 300,
				"connectivity": "Cable",
				"runs": 1,
				"budget": {
					"render": 5500,
					"loadTime": 9000,
					"visualComplete": 10000,
					"bytesIn": 1000000,
					"requests": 100,
					"SpeedIndex": 7200
				}
			}
		},
		"home": {
			"title": "Google home",
			"options": {
				"url": "http://www.google.com",
				"timeout": 900
			}
		},
		"home (iPhone)": {
			"title": "Google home (iPhone)",
			"options": {
				"url": "http://www.google.com",
				"timeout": 900
			}
		}
	}

###pagespeed.json
Defines Google pagespeed tests to run and performance thresholds. Structure exactly as defined by grunt-pagespeed.

Example:

	{
		"options": {
			"nokey": true,
			"url": "http://www.google.com"
			},
		"home": {
			"options": {
				"paths": ["/"],
				"locale": "en_GB",
				"strategy": "desktop",
				"threshold": 74
			}
		},
		"home-mobile": {
			"options": {
				"paths": ["/"],
				"strategy": "mobile",
				"locale": "en_GB",
				"threshold": 74
				}
			}
	}

###yslow.json
Defines Yslow tests to run and performance thresholds. Structure exactly as defined by [grunt-yslow](https://github.com/andyshora/grunt-yslow).

Example:

	{
		"options": {
			"thresholds": {
				"weight": 1000,
				"speed": 8000,
				"score": 80,
				"requests": 100
			}
		},
		"pages": {
			"files": [
				{
					"comment": "Home page",
					"src": "http://www.google.com",
					"thresholds": {
						"weight": 550,
						"score": 74,
						"requests": 72
					}
				},
				{
					"comment": "Home page (iPhone)",
					"src": "http://www.google.com",
					"yslowOptions": {
						"userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3",
						"viewport": "320x568"
				},
					"thresholds": {
						"weight": 550,
						"score": 78,
						"requests": 35
					}
				}
			]
		}
	}

##Example output
Using the example configuration above, an example output from `grunt` with no parameters:

	Running "webpagetest" task

	Running "webpagetest-run:home" (webpagetest-run) task
	Checking URL http://www.google.com

	Running "perfbudget:default" (perfbudget) task
	>> -----------------------------------------------
	>> Test for http://www.google.com 	  PASSED
	>> -----------------------------------------------
	>> render: 1620 [PASS]. Budget is 5500
	>> loadTime: 3330 [PASS]. Budget is 9000
	>> visualComplete: 2700 [PASS]. Budget is 10000
	>> bytesIn: 490020 [PASS]. Budget is 1000000
	>> requests: 13 [PASS]. Budget is 100
	>> SpeedIndex: 1858 [PASS]. Budget is 7200
	>> Summary: http://www.webpagetest.org/result/141107_4Z_SKR/

	Running "webpagetest-run:home (iPhone)" (webpagetest-run) task
	Checking URL http://www.google.com

	Running "perfbudget:default" (perfbudget) task
	>> -----------------------------------------------
	>> Test for http://www.google.com 	  PASSED
	>> -----------------------------------------------
	>> render: 1283 [PASS]. Budget is 5500
	>> loadTime: 2715 [PASS]. Budget is 9000
	>> visualComplete: 2100 [PASS]. Budget is 10000
	>> bytesIn: 490026 [PASS]. Budget is 1000000
	>> requests: 13 [PASS]. Budget is 100
	>> SpeedIndex: 1594 [PASS]. Budget is 7200
	>> Summary: http://www.webpagetest.org/result/141107_XG_SMS/

	Running "pagespeed:home" (pagespeed) task

	----------------------------------------------------------------

	URL:       https://www.google.co.uk/?gws_rd=cr,ssl&ei=Je9cVLiQG8zuaNKQgOAM
	Score:     90
	Strategy:  desktop

	Number Resources                                 | 15
	Number Hosts                                     | 6
	Total Request                                    | 3.16 kB
	Number Static Resources                          | 9
	Html Response                                    | 108.47 kB
	Image Response                                   | 46.02 kB
	Javascript Response                              | 863.77 kB
	Other Response                                   | 2.86 kB
	Number Js Resources                              | 5
	                                                 | 
	Avoid Landing Page Redirects                     | 7
	Enable Gzip Compression                          | 0
	Leverage Browser Caching                         | 0
	Main Resource Server Response Time               | 0
	Minify Css                                       | 0
	Minify HTML                                      | 0
	Minify Java Script                               | 0.27
	Minimize Render Blocking Resources               | 0
	Optimize Images                                  | 0
	Prioritize Visible Content                       | 2

	----------------------------------------------------------------


	Running "pagespeed:home-mobile" (pagespeed) task

	----------------------------------------------------------------

	URL:       https://www.google.co.uk/?gws_rd=cr,ssl&ei=Ju9cVMT-Isv1atfTgBg
	Score:     78
	Strategy:  mobile

	Number Resources                                 | 14
	Number Hosts                                     | 3
	Total Request                                    | 2.72 kB
	Number Static Resources                          | 10
	Html Response                                    | 66.51 kB
	Image Response                                   | 83.47 kB
	Javascript Response                              | 368.26 kB
	Other Response                                   | 2.34 kB
	Number Js Resources                              | 3
	                                                 | 
	Avoid Landing Page Redirects                     | 25.5
	Avoid Plugins                                    | 0
	Configure Viewport                               | 0
	Enable Gzip Compression                          | 0
	Leverage Browser Caching                         | 0
	Main Resource Server Response Time               | 0
	Minify Css                                       | 0
	Minify HTML                                      | 0
	Minify Java Script                               | 0.12
	Minimize Render Blocking Resources               | 0
	Optimize Images                                  | 0.56
	Prioritize Visible Content                       | 0
	Size Content To Viewport                         | 0
	Size Tap Targets Appropriately                   | 1.55
	Use Legible Font Sizes                           | 0

	----------------------------------------------------------------


	Running "yslow:pages" (yslow) task
	>> Testing 2 URLs, this might take a few moments...
	>> 
	>> -----------------------------------------------
	>> Test 2: http://www.google.com
	>> -----------------------------------------------
	>> Requests: 8 [PASS]
	>> YSlow score: 96/100 [PASS]
	>> Page load time: 411ms [PASS]
	>> Page weight: 132.807kb [PASS]
	>> 
	>> -----------------------------------------------
	>> Test 1: http://www.google.com
	>> -----------------------------------------------
	>> Requests: 8 [PASS]
	>> YSlow score: 96/100 [PASS]
	>> Page load time: 1276ms [PASS]
	>> Page weight: 211.803kb [PASS]


## Notes on running WebpageTest
You will need a webpagetest API key - you can request one from the WebPageTest.org site. If
you do this be aware you will be limited in in the number of tests per day you can run. A
better option is to put in place your own private instance of WebPageTest and use this.

A simple private instance can be set up on Amazon Web Services (AWS) that provides test 
agents (locations) in all of the AWS zones:
[https://github.com/WPO-Foundation/webpagetest/blob/master/docs/EC2/Server%20AMI.md](https://github.com/WPO-Foundation/webpagetest/blob/master/docs/EC2/Server%20AMI.md)
If you choose to use this AMI, be aware that spinning up the first instance of a test 
agent in a given location can take some time, so your first test for each agent/location
combination should have a long timeout (I suggest 10 minutes).

