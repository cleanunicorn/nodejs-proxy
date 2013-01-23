var http = require( 'http' );
var url = require( 'url' );

http.createServer( function( request, response )
{
	var url_parts = url.parse( request.url );

	var options = {
		hostname 	: request.headers.host,
		port 		: 80,
		path 		: url_parts.path,
		method 		: request.method, 
		headers		: request.headers
	};

	var request_data;

	var proxy_client = http.request( options, function( res )
	{
		console.log( 'Sending request ', options );

		res.on( 'data', function ( chunk )
		{
			console.log( 'Write to client ', chunk.length );
			response.write( chunk, 'binary' );
		} );

		res.on( 'end', function()
		{
			console.log( 'End chunk write to client' );
			response.end();
		} );

		response.writeHead( res.statusCode, res.headers );
	} );

	request.on( 'data', function ( chunk )
	{
		console.log( 'Write to server ', chunk.length );
		console.log( chunk.toString( 'utf8' ) );
		request_data = request_data + chunk;
		proxy_client.write( chunk, 'binary' );
	} );

	request.on( 'end', function()
	{
		console.log( 'End chunk write to server' );
		proxy_client.end();
	} );

	request.on( 'error', function ( e )
	{
		console.log( 'Problem with request ', e );
	} );

} ).listen( 8080 );

console.log( 'all ok' );
