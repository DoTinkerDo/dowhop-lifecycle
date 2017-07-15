# Firebase Database Extraction.
# Run with `python firebase_extract.py` using Python version 3.6 or above.
# (c) 2017, DoWhop.com. San Diego, CA.

import pyrebase, requests, json, getpass, datetime

# Configuring Firebase database settings:
config = {
  "apiKey": "AIzaSyB95x1zEsSkXfaDgOVdTw7ESavk9O9geN0",
  "authDomain": "dowhop-lifecycle.firebaseapp.com",
  "databaseURL": "https://dowhop-lifecycle.firebaseio.com",
  "storageBucket": "dowhop-lifecycle.appspot.com",
}

firebase = pyrebase.initialize_app(config)
auth = firebase.auth()

# Logging in user to get temporary auth token to download db data:
email = input('email:')
password = getpass.getpass('pass:')
user = auth.sign_in_with_email_and_password(email, password)
userIdToken = user['idToken'];

print('Fetching the data...\n')

# Gathering data via HTTP with new key:
r = requests.get(url='https://dowhop-lifecycle.firebaseio.com/.json?print=pretty&format=export&download=dowhop-lifecycle-export.json&auth=%s' % userIdToken)
allData = r.json()

# Exporting file to current folder:
t = datetime.datetime.now()
fileName = "result_%s_%s_%s-%s_%s.json" % (t.year, t.month, t.day, t.hour, t.minute)

with open(fileName, 'w') as outfile:
    json.dump(allData, outfile)

print('File has been written.')
