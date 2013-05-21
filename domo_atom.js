// domo_atom.js 0.1.0
// (c) 2013  M.( Mathias Prinz )
// is distributed under the MIT license.

  ! function () {
      typeof module == "object"
      ? module.exports = domo_atom
      : window.ATOM = domo_atom
      ;
       
      function domo_atom () {
        if ( ! domo && ! carton ) throw new Error( "No domo or jsCarton provided." )
        var domo = domo || carton;
        var concat = Array.prototype.concat;
        var callback = arguments[ 1 ];
        var attr = arguments[ 0 ];
        var atom = attr.atom;
        var key = attr.key;
        var listen = attr.listen instanceof Array ? attr.listen : [ attr.listen ];
        var dramaturgy = attr.dramaturgy;
        var parsed = false;
        var domFrame = attr.domFrame || domo.SECTION();
      
     
        function isArray ( x ) { return x instanceof Array; }
      
        // make hardcopies
      
        function copy ( arr ) {
          var deep = [], l = arr.length, i = 0;
      
          for ( ; i < l; i = i + 1 ) { deep[ i ] = arr[ i ]; }
          return deep;
        }
      
        // transfer eventname to listener callbacks
        
        function data ( d, k ) {
          
          return function () {
            var args = copy( arguments );
            args.push( d );
            insert.apply( null, args );
          }
        }
      
        // add atom listeners to change the dom
        // on key changes after parsing
      
        function addListeners () {
          var l = listen.length;
          var i = 0;
        
          for ( i; i < l; i++ ) atom[ listen[ i ] ]( key, data( listen[ i ], key ) );
        }
      
        function insert ( args, listener ) {
      
          // if key still doesn't exist when domo is parsing
      
          if ( ! atom.has( key ) ) { parsed = true; return domFrame; }
      
          var childNodes = domFrame.childNodes;
          var fragChildren;
          var fragment;
      
          // update dom on a later key change
      
          function updateDom () {
            domFrame.innerHTML = ''; 
            domFrame.appendChild( fragment );
          }
      
          // if a setup for a dramaturgy exist and it's triggered after the
          // parsing process it will change the dom by makeing a detour using the drama
          // else it uses updateDom() directly
      
          function makeADrama () {
            if ( ! parsed || ! dramaturgy ) { updateDom(); parsed = true; return; }
            fragChildren = copy( fragment.childNodes );
            drama.apply( null, dramaArgs() );
          }
      
          // setup the drama
      
          function dramaArgs () {
            var args = [ dramaturgy ];
            if ( childNodes.length ) args.push( { name: false, nodes: childNodes } );
            args.push( { name: 'init', nodes: fragChildren, begin: updateDom }, { name: true, nodes: fragChildren } );
            return args;
          }
      
          args = args || atom.get( key );
          fragment = domo.FRAGMENT( callback( args, listener, key ) );
      
          makeADrama();
          return domFrame;
        }
      
        function drama () {
          var i = 0;
          var concat = Array.prototype.concat;
          var args = concat.apply( [], arguments );
          var action = args.shift();
      
          // filter nodes by a special nodeType
      
          function filterNodes ( n, type ) {
            var filter = [];
            var i = 0;
            var l = n.length;
      
            for ( ; i < l; i++ ) {
              if ( n[ i ].nodeType == type ) {
                filter.push( n[ i ] );
              }
            }
      
            return filter;
          }
      
          // fire scenes in order
      
          function run () {
            if ( ! args[ i ] ) return;
            var scene = args[ i ];
            if ( typeof scene.begin === 'function' ) scene.begin();
            action( scene.name, filterNodes( scene.nodes, 1 ), function () { if ( typeof scene.done === 'function' ) { scene.done()}; i++; run(); } );
          } 
      
          run();
        }
      
        addListeners();
        return insert();
      }
  }()