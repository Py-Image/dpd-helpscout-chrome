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

			if ( $( '#dpd-helpscout-content:not(.chrome-extension-loaded)' ).length ) {

				clearInterval( checkForHelpScoutAppLoad );
				
				$( document ).trigger( 'dpd-helpscout-app-loaded', [ $( '#dpd-helpscout-content' ) ] );
				
				$( '#dpd-helpscout-content' ).addClass( 'chrome-extension-loaded' );

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

		$appContainer.find( '.dpd-form:not(form)' ).each( function( formIndex, form ) {
			
			$( form ).find( 'a.dpd-submit' ).each( function( buttonIndex, link ) {
				
				let text = $( link ).text();
				
				$( link ).pyisDpdChangeElementType( 'input' ).attr( 'type', 'submit' ).attr( 'value', text ).removeAttr( 'target' );
				
			} );
			
			$( form ).pyisDpdChangeElementType( 'form' ).find( '.button-container' ).show();
			
		} );

	}
	
	$( document ).on( 'dpd-helpscout-app-loaded', function( event, $appContainer ) {
		
		convertToForms( $appContainer );
		
		$( '#dpd-helpscout-chrome-extension-loading' ).slideUp();
		
	} );
	
	$( document ).on( 'submit', 'form.dpd-form', function( event ) {
		
		event.preventDefault();
		
		var endpoint = $( document.activeElement ).attr( 'id' ).replace( /^dpd_endpoint_/i, '' ),
			helpscoutSecretKey = $( '#dpd-helpscout-secret-key' ).text();
		
		$.ajax( {
			method: 'POST',
			url: '//dev.realbigplugins.com/wp-json/pyis/v1/helpscout/dpd/' + endpoint,
			contentType: 'application/json',
			data: JSON.stringify( {
				'helpscout_data': $( '#dpd-helpscout-data' ).text(), // Need to send as text to ensure our hashes line up
				'customer_id': $( this ).find( '.customer_id' ).text(),
				'purchase_id': $( this ).find( '.purchase_id' ).text(),
			} ),
			beforeSend: function( xhr ) { 
				xhr.setRequestHeader( 'X-HELPSCOUT-SIGNATURE', helpscoutSecretKey );
			},
			success: function( response ) {
				alert( response.html );	
			},
			error: function( XMLHttpRequest, textStatus, errorThrown ) {
				alert( XMLHttpRequest.responseJSON.html );
			}
		} );
		
	} );

} )( jQuery );