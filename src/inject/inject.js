// https://stackoverflow.com/a/11458713
$.fn.pyisDpdChangeElementType = function(newType) {
	var attrs = {};

	$.each(this[0].attributes, function(idx, attr) {
		attrs[attr.nodeName] = attr.nodeValue;
	});

	var newelement = $("<" + newType + "/>", attrs).append($(this).contents());
	this.replaceWith(newelement);
	return newelement;
};

( function( $ ) {

	if ( window.location.href.indexOf( 'https://secure.helpscout.net/conversation/' ) > -1 ) {

		var checkForHelpScoutAppLoad = setInterval( function() {

			if ( $( '#dpd-helpscout-content' ).length ) {

				clearInterval( checkForHelpScoutAppLoad );
				
				$( document ).trigger( 'dpd-helpscout-app-loaded', [ $( '#dpd-helpscout-content' ) ] );

			}

		}, 10 );

	};

	/**
	 * Convert <div> forms passed into HelpScout into real <form>s
	 * 
	 * @param {object} $appContainer jQuery DOM Object
	 *                               
	 * @since {{VERSION}}
	 * @return void
	 */
	function convertToForms( $appContainer ) {

		$appContainer.find( '.dpd-form:not(form)' ).each( function( index, form ) {
			
			$( form ).pyisDpdChangeElementType( 'form' ).find( '.button-container' ).show();
			
		} );

	}
	
	$( document ).on( 'dpd-helpscout-app-loaded', function( event, $appContainer ) {
		
		convertToForms( $appContainer );
		
		$( '#dpd-helpscout-chrome-extension-loading' ).slideUp();
		
	} );
	
	$( document ).on( 'click', '.dpd-form .dpd-regenerate', function( event ) {
		
		event.preventDefault();
		
		// Only try to submit if the Form was converted
		$( this ).closest( 'form.dpd-form' ).submit();
		
	} );
	
	$( document ).on( 'submit', 'form.dpd-form', function( event ) {
		
		event.preventDefault();
		
		var helpscoutSecretKey = $( '#dpd-helpscout-secret-key' ).text();
		
		$.ajax( {
			method: 'POST',
			url: '//dev.realbigplugins.com/wp-json/pyis/v1/helpscout/dpd/regenerate-data',
			data: {
				'helpscout_data': $( '#dpd-helpscout-data' ).text(), // Need to send as text to ensure our hashes line up
			},
			beforeSend: function( xhr ) { 
				xhr.setRequestHeader( 'X-HELPSCOUT-SIGNATURE', helpscoutSecretKey );
			},
			success: function( response ) {
				console.log( response );	
			},
		} );
		
	} );

} )( jQuery );