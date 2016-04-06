#!/bin/bash

# If there are any errors, fail Travis
set -e

# Define variables depending on the branch
if [[ $TRAVIS_BRANCH == 'release' ]]
  then
    APIENVIRONMENT=3
    AZURE_USER=LIVE_AZURE_USER
    AZURE_PASSWORD=LIVE_AZURE_PASSWORD
    AZURE_WEBSITE=LIVE_AZURE_WEBSITE
fi
if [[ $TRAVIS_BRANCH == 'staging' ]]
  then
    APIENVIRONMENT=2
    AZURE_USER=STAGING_AZURE_USER
    AZURE_PASSWORD=STAGING_AZURE_PASSWORD
    AZURE_WEBSITE=STAGING_AZURE_WEBSITE
fi
if [[ $TRAVIS_BRANCH == 'develop' ]]
  then
    APIENVIRONMENT=1
    AZURE_USER=DEV_AZURE_USER
    AZURE_PASSWORD=DEV_AZURE_PASSWORD
    AZURE_WEBSITE=DEV_AZURE_WEBSITE
fi

# Get the commit details
THE_COMMIT=`git rev-parse HEAD`

# Set git details
git config --global user.email "enquiry@streetsupport.net"
git config --global user.name "Travis CI"

# Delete _dist
rm -rf _dist
mkdir _dist

# Run tests
jasmine

# Set environment
cd src/js
rm env.js
cat > env.js << EOF
module.exports=$APIENVIRONMENT
EOF

echo "env file rewritten to:"
cat env.js

cd ../../

# Run gulp
gulp deploy --debug --production

# Move to created directory
cd _dist

echo "pushing to repo"

# Push to git by overriding previous commits
# IMPORTANT: Supress messages so nothing appears in logs

if [[ $TRAVIS_BRANCH == 'release' ]] || [[ $TRAVIS_BRANCH == 'staging' ]] || [[ $TRAVIS_BRANCH == 'develop' ]]
  then
    git init
    git add -A
    git commit -m "Travis CI automatic build for $THE_COMMIT"
    git push --quiet --force "https://${AZURE_USER}:${AZURE_PASSWORD}@${AZURE_WEBSITE}.scm.azurewebsites.net:443/${AZURE_WEBSITE}.git" master > /dev/null 2>&1
  else
    echo "Not on a build branch so don't push"
fi
