( function( $ ) {

	if ( window.location.href.indexOf( 'https://secure.helpscout.net/conversation/' ) > -1 ) {
		
		var checkForHelpScoutAppLoad = setInterval( function() {
			
			if ( $( 'li[id$="some-id"]' ).length ) {
				
				clearInterval( checkForHelpScoutAppLoad );
				
				console.log( 'App Loaded' );
				
				$.ajax( {
					method: 'GET',
					url: '//someurl.com',
					success: function( response ) {
						console.log( response );	
					},
				} );
				
			}
			
		}, 10 );
		
	};

} )( jQuery );