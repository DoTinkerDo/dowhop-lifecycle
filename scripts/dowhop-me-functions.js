// Fnctions that will be called when user object is present and signed in.
// (c) DoWhop.com, 2017

// Tasks:
// Check my session
// Retrieve my DoWhops
// Check for pendings
// Show DoWhop data

function retrieveMySession(uid) {
  database.ref('/session').child(uid).on('value', function(snap) {
    console.log('session change', snap.val().current_tab);
    console.log('session change', snap.val().current_dowhop);
  });
}
