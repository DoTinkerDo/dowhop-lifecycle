// Fnctions that will be called when user object is present and signed in.
// (c) DoWhop.com, 2017

// Tasks:
// Check my session
// Retrieve my DoWhops
// Check for pendings
// Show DoWhop data

// All cases, we load pending div forms for current session:
function checkForPendings(data) {
  console.log('Running checkforpendings v2.0...');
  var requesterName = 'Someone'; // NOTE: just in case we are looking at old data.

  if (data.pending && data.pending.requesterName) {
    requesterName = data.pending.requesterName;
  }
  var pendingNotification = requesterName + ' has requested to meet\n';

  // Check if there are pending data:
  if (data && data.pending != null && data.pending.status != 'approved' && data.pending.status != 'denied') {
    // console.log('pending status true. showing pending div.');
    if (data.pending.whenDateTimePending) {
      pendingNotification +=
        'on ' +
        moment(data.pending.whenDateTimePending).format('dddd MMMM D, YYYY') +
        ' at ' +
        moment(data.pending.whenDateTimePending).format('hh:mmA') +
        '\n';
    }
    if (data.pending.whereAddressPending) pendingNotification += 'at ' + data.pending.whereAddressPending + '\n';

    document.getElementById('pending-div').removeAttribute('hidden');
    document.getElementById('pending-div').innerText = pendingNotification;
    // This means visiting user is the creator of event:
    if (firebase.auth().currentUser.email == data.creatorDescription) {
      // console.log('visiting user is the creator. showing approval form, hiding rescind form.');
      document.getElementById('pending-div').innerText = pendingNotification;
      document.getElementById('approve-pending-form').removeAttribute('hidden');
      document.getElementById('rescind-pending-form').setAttribute('hidden', 'true');

      // This means visiting user is a requestor of event change:
    } else if (firebase.auth().currentUser.uid == data.pending.requester) {
      // console.log('visiting user requested a change. showing rescinding form, hiding approval form.'
      document.getElementById('pending-div').innerText = pendingNotification;
      document.getElementById('rescind-pending-form').removeAttribute('hidden');
      document.getElementById('approve-pending-form').setAttribute('hidden', 'true');
    }
    // All other cases:
  } else {
    // console.log('this means it has passed over logic tests.');
    document.getElementById('approve-pending-form').setAttribute('hidden', 'true');
    document.getElementById('pending-div').innerText = '';
    document.getElementById('approve-pending-form').setAttribute('hidden', 'true');
    document.getElementById('rescind-pending-form').setAttribute('hidden', 'true');
  }
}
