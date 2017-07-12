# Omar Malik. 2017.
# Run this script using `python this_file.py`. Written for Python version 3.6.
import pyrebase
import requests
import json
import getpass
import datetime

# Configuring Firebase database settings:
config = {
  "apiKey": "AIzaSyB95x1zEsSkXfaDgOVdTw7ESavk9O9geN0",
  "authDomain": "dowhop-lifecycle.firebaseapp.com",
  "databaseURL": "https://dowhop-lifecycle.firebaseio.com",
  "storageBucket": "dowhop-lifecycle.appspot.com",
}

firebase = pyrebase.initialize_app(config)
auth = firebase.auth()

# Log the user in for security::
email = input('email:')
password = getpass.getpass('pass:')
user = auth.sign_in_with_email_and_password(email, password)
userIdToken = user['idToken'];

print('Fetching the data...\n')

# Gathering data:
r = requests.get(url='https://dowhop-lifecycle.firebaseio.com/.json?print=pretty&format=export&download=dowhop-lifecycle-export.json&auth=%s' % userIdToken)
allData = r.json()

# Exporting file:
t = datetime.datetime.now()
fileName = "result_%s_%s_%s-%s_%s.json" % (t.year, t.month, t.day, t.hour, t.minute)

with open(fileName, 'w') as outfile:
    json.dump(allData, outfile)

print('File has been written.')
