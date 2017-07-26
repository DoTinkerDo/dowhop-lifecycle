# Shell script for saving new files to extracts directory.
# To run, use `/bin/sh firebase_extract.sh` in this directory.

echo 'Preparing to extract database.'

if [ ! -d /extracts ]
then
    mkdir -p extracts
fi

cd extracts/
python ../firebase_extract.py
echo 'Finished.'
