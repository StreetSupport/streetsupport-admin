#!/bin/bash

# If there are any errors, fail Travis
set -e

# Define variables depending on the branch
if [[ $TRAVIS_BRANCH == 'release' ]]
  then
    REPO="github.com/StreetSupport/admin.streetsupport.net-live.git"
    DOMAIN="service.streetsupport.net"
    APIENVIRONMENT=3
fi
if [[ $TRAVIS_BRANCH == 'staging' ]]
  then
    REPO="github.com/StreetSupport/admin.streetsupport.net-staging.git"
    DOMAIN="dev-service.streetsupport.net"
    APIENVIRONMENT=2
fi
if [[ $TRAVIS_BRANCH == 'develop' ]]
  then
    REPO="github.com/StreetSupport/admin.streetsupport.net-dev.git"
    DOMAIN="dev-service.streetsupport.net"
    APIENVIRONMENT=1
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
module.exports = $APIENVIRONMENT
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

if [[ $TRAVIS_BRANCH == 'release' ]]
  then
    git init
    git add -A
    git commit -m "Travis CI automatic build for $THE_COMMIT"
    git push --quiet --force "https://${LIVE_AZURE_USER}:${LIVE_AZURE_PASSWORD}@${LIVE_AZURE_WEBSITE}.scm.azurewebsites.net:443/${LIVE_AZURE_WEBSITE}.git" master > /dev/null 2>&1
fi

if [[ $TRAVIS_BRANCH == 'staging' ]]
  then
    git init
    git add -A
    git commit -m "Travis CI automatic build for $THE_COMMIT"
    git push --quiet --force "https://${STAGING_AZURE_USER}:${STAGING_AZURE_PASSWORD}@${STAGING_AZURE_WEBSITE}.scm.azurewebsites.net:443/${STAGING_AZURE_WEBSITE}.git" master > /dev/null 2>&1
fi

if [[ $TRAVIS_BRANCH == 'develop' ]]
  then
    git init
    git add -A
    git commit -m "Travis CI automatic build for $THE_COMMIT"
    git push --quiet --force "https://${DEV_AZURE_USER}:${DEV_AZURE_PASSWORD}@${DEV_AZURE_WEBSITE}.scm.azurewebsites.net:443/${DEV_AZURE_WEBSITE}.git" master > /dev/null 2>&1
fi
