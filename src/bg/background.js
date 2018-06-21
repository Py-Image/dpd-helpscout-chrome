chrome.tabs.onUpdated.addListener( function( tabId, changeInfo, tab ) {

	if ( changeInfo.status == 'complete' ) {
		
		if ( typeof jQuery == 'undefined' ) {
			chrome.tabs.executeScript( tab.ib, {
				file: './js/jquery/jquery.min.js'
			} );
		}

		// We do it this way because we are relying on jQuery and we need to ensure that that is loaded
		// Also, because of the way HelpScout "load" pages, Chrome cannot know which pages to load it on as a Content Script correctly
		chrome.tabs.executeScript( tab.ib, {
			file: './src/inject/inject.js'
		} );

	}

} );