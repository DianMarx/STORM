/**
 * Created by johannmarx on 15/07/31.
 */


QUnit.test( "hello test", function( assert ) {
    assert.ok( 1 == "1", "Passed!" );
});
QUnit.test( "shuffle()", function() {
    ok(shuffle("passed"), 'Shuffle function passed the test');
});