#!/bin/bash

# Define variables depending on the branch
if [[ $TRAVIS_BRANCH == 'master' ]]
  then
    REPO="github.com/StreetSupport/admin.streetsupport.net-live.git"
    DOMAIN="service.streetsupport.net"
    APIENVIRONMENT=2
  else
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

if [[ $TRAVIS_BRANCH == 'master' ]] # live
  then
    git init
    git add -A
    git commit -m "Travis CI automatic build for $THE_COMMIT"
    git push --force --quiet "https://${GH_TOKEN}@${REPO}" master > /dev/null 2>&1
fi

if [[ $TRAVIS_BRANCH == 'develop' ]] # dev
  then
    git init
    git add -A
    git commit -m "Travis CI automatic build for $THE_COMMIT"
    git push --force --quiet "https://${GH_TOKEN}@${REPO}" master:gh-pages > /dev/null 2>&1
    echo $vincetestenvvar
fi
