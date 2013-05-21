require('domo').global();
var atom = require('./atom');
var ATOM = require('./domo_atom');
var http = require('http');
var M = atom();

M.set({ 'news1': { 'headline': 'This is news 1', 'txt': 'This is a text 1!' } })
M.set({ 'news2': { 'headline': 'This is news 2', 'txt': 'This is a text 2!' } })



http.createServer( function( req, res ) {

  if ( req.url  === '/favicon.ico') res.end('');
   
  res.writeHead(200, {"Content-Type": "text/html"})

    
   var news = function ( key ) {
     return ( 
       ATOM( 
         { key: key , atom: M, listen: [ 'on' ], dramaturgy: undefined }
       , function ( key, listener ) {
          return FRAGMENT( 
            H1( 'News:',key.headline )
          , P( key.txt ) );
       }) 
     )
   }
  res.end( 
    DOCUMENT(
      HTML( { lang: 'en' }
        ,
        BODY(
          news( 'news1' )
          , 
          news( 'news2' )
          , 
          news( 'news3' )
          , 
          A({ id: 'addNews' }, 'Add News' )
          , 
          ' | '
          , 
          A({ id: 'updateNews' }, 'Update News' )
        )
      )
    ).outerHTML 
  );
  M.set('news1',{ 'headline': 'blaa', txt: 'sdfghfjg'  })
}).listen( 8080 );

console.log( 'Hello :) Domo is now on :8080 !' );