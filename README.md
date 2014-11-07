# multi-perfbudget-grunt
This Grunt file provides a means to implement a performance budget for a web project that combines WebPageTest, Google Pagespeed and YSlow across multiple pages.
See [http://timkadlec.com/2013/01/setting-a-performance-budget/](http://timkadlec.com/2013/01/setting-a-performance-budget/) for more on performance budgets.
This file uses grunt-perfbudget, grunt-pagespeed and grunt-yslow.

The following tasks are provided:

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

An example json file is provided.

###pagespeed.json
Defines Google pagespeed tests to run and performance thresholds. Structure exactly as defined by grunt-pagespeed.

An example json file is provided.

###yslow.json
Defines Yslow tests to run and performance thresholds. Structure exactly as defined by [grunt-yslow](https://github.com/andyshora/grunt-yslow).

An example json file is provided.

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

