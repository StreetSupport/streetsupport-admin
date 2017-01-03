#!/bin/bash

# If there are any errors, fail Travis
set -e

# Define variables depending on the branch
if [[ $TRAVIS_BRANCH == 'release' ]]
  then
    AZURE_WEBSITE=$PROD_AZURE_WEBSITE_W_EUR
    APIENVIRONMENT=3
fi
if [[ $TRAVIS_BRANCH == 'uat' ]]
  then
    AZURE_WEBSITE=$UAT_AZURE_WEBSITE
    APIENVIRONMENT=2
fi
if [[ $TRAVIS_BRANCH == 'develop' ]]
  then
    AZURE_WEBSITE=$DEV_AZURE_WEBSITE
    APIENVIRONMENT=1
fi

# Get the commit details
THE_COMMIT=`git rev-parse HEAD`

# Set git details
git config --global user.email "enquiry@streetsupport.net"
git config --global user.name "Travis CI"

# Set environment
cd src/js
rm env.js
cat > env.js << EOF
module.exports = $APIENVIRONMENT
EOF

echo "env.js file rewritten to:"
cat env.js
cd ../../

# Create version.txt
DATE=`date +%Y%m%d%H%M`
cd src/files

cat > version.txt << EOF
$DATE
EOF

cd ../../

# Run gulp
gulp deploy --debug --production

if [[ $TRAVIS_PULL_REQUEST == 'false' ]]
  then
    # Move to created directory
    cd _dist

    if [[ $TRAVIS_BRANCH == 'release' ]] || [[ $TRAVIS_BRANCH == 'uat' ]] || [[ $TRAVIS_BRANCH == 'develop' ]]
      then
        git init
        git add -A
        git commit -m "Travis CI automatic build for $THE_COMMIT"
        # Push to git by overriding previous commits
        # IMPORTANT: Supress messages so nothing appears in logs
        echo "pushing to ${AZURE_WEBSITE}"

        git push --quiet --force "https://${AZURE_USER}:${AZURE_PASSWORD}@${AZURE_WEBSITE}.scm.azurewebsites.net:443/${AZURE_WEBSITE}.git" master > /dev/null 2>&1
      else
        echo "Not on a build branch so don't push the changes to GitHub Pages"
    fi
fi
