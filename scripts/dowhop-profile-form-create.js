// This is the script for dealing with users' profiles.

//  Section for creating profile for first-time users:
function addDoWhopImage(files_arr, node) {
  return (file = files_arr[0]);
  if (!file.type.match('image/.*')) {
    alert('You can only add images at the moment.');
    return;
  }
}
